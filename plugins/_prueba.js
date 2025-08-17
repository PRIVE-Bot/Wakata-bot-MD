// Comando: .whois <numero>
// Ej: .whois 50499999999

import { jidNormalizedUser, jidDecode } from '@whiskeysockets/baileys'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `📌 Uso: ${usedPrefix + command} 50499999999`

  const raw = args[0].replace(/\D/g, '')
  const jid = jidNormalizedUser(raw + '@s.whatsapp.net')

  // Verificar si existe en WhatsApp
  let results = []
  try {
    results = await conn.onWhatsApp(raw) // acepta número sin @
  } catch (e) {}
  const wa = results?.[0]
  if (!wa || (wa.exists === false)) return m.reply('❌ Ese número no está en WhatsApp')

  // Datos base
  const safeJid = wa.jid || jid
  const lid = wa.lid || null

  // Perfil
  let ppUrl = null, name = 'No disponible', statusText = 'No disponible'
  try { ppUrl = await conn.profilePictureUrl(safeJid, 'image') } catch {}
  try { name = await conn.getName(safeJid) } catch {}
  try {
    const s = await conn.fetchStatus(safeJid)
    if (s?.status) statusText = s.status
  } catch {}

  // Decodificar JID (multi-dispositivo)
  const d = jidDecode(safeJid) || {}
  const decodedLines = []
  if (d.user) decodedLines.push(`• user: ${d.user}`)
  if (d.server) decodedLines.push(`• server: ${d.server}`)
  if (typeof d.device !== 'undefined') decodedLines.push(`• device: ${d.device}`) // 0 = primario, >0 = companion

  // (Opcional) Perfil de negocio
  let businessInfo = null
  try {
    if (typeof conn.getBusinessProfile === 'function') {
      businessInfo = await conn.getBusinessProfile(safeJid) // algunas versiones de Baileys lo soportan
    }
  } catch {}

  let info = [
    '📱 *Información pública del número*',
    '',
    `👤 *Nombre:* ${name}`,
    `📞 *JID:* ${safeJid}`,
    lid ? `🧩 *LID:* ${lid}` : null,
    `💬 *Estado:* ${statusText}`,
    `🖼️ *Foto de perfil:* ${ppUrl ? 'Sí ✅' : 'No ❌'}`,
    decodedLines.length ? `\n🔎 *JID decodificado:*\n${decodedLines.map(l => '   ' + l).join('\n')}` : null,
    businessInfo ? `\n🏪 *Cuenta Business:* Sí\n   • descripción: ${businessInfo.description || 'N/D'}\n   • categorías: ${businessInfo.categories?.join(', ') || 'N/D'}` : '\n🏪 *Cuenta Business:* No detectado',
    '\n⚠️ *Privacidad:* IP, ubicación u otros datos privados NO son accesibles ni legales de recolectar.'
  ].filter(Boolean).join('\n')

  await conn.sendMessage(m.chat, {
    text: info,
    ...(ppUrl ? { contextInfo: { externalAdReply: { title: name, thumbnailUrl: ppUrl, sourceUrl: ppUrl } } } : {})
  }, { quoted: m })

  // Si quieres enviar también la foto completa (si existe):
  if (ppUrl) {
    await conn.sendMessage(m.chat, { image: { url: ppUrl }, caption: `Foto de perfil de ${name}` }, { quoted: m })
  }
}

handler.help = ['whois <número>']
handler.tags = ['herramientas']
handler.command = /^whois|info$/i

export default handler
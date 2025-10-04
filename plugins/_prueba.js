import pkg from '@whiskeysockets/baileys'
const { proto } = pkg

var handler = async (m, { conn, text }) => {
  try {
    const example = '+51 973 419 739'
    const raw = (text && text.trim()) || example
    let clean = raw.replace(/[\s\-\(\)\.]/g, '')
    if (clean.startsWith('+')) clean = clean.slice(1)
    const jid = `${clean}@s.whatsapp.net`
    let ppUrl = null
    try {
      if (typeof conn.profilePictureUrl === 'function') {
        ppUrl = await conn.profilePictureUrl(jid).catch(() => null)
      } else if (typeof conn.getProfilePicture === 'function') {
        ppUrl = await conn.getProfilePicture(jid).catch(() => null)
      }
    } catch (e) {
      ppUrl = null
    }
    if (!ppUrl) {
      return conn.sendMessage(m.chat, { text: `⚠️ No se pudo obtener la foto de perfil de ${raw}.` }, { quoted: m })
    }
    await conn.sendMessage(m.chat, { image: { url: ppUrl }, caption: `Foto de perfil de: ${raw}` }, { quoted: m })
  } catch (err) {
    return conn.sendMessage(m.chat, { text: `❌ Error: ${err.message}` }, { quoted: m })
  }
}

handler.command = /^(pp|getpp|fotoperfil|profilepic)$/i
export default handler
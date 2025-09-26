// detector-device.js
// Handler para Baileys — detecta iOS/Android por heurística de longitud del message ID

let handler = async (m, { conn }) => {
  try {
    // Si respondes a un mensaje, toma el id del citado; si no, el id del mensaje actual
    const target = m.quoted ? m.quoted : m
    const id = target.key?.id || target.id || ''

    if (!id) return m.reply('⚠️ No pude obtener el ID del mensaje.')

    const device = detectPlatformFromId(id)

    // Mención opcional a la persona objetivo
    let who = m.quoted ? (m.quoted.sender || m.sender) : m.sender
    await conn.reply(m.chat, `👤 Usuario: @${who.split('@')[0]}\n📱 Dispositivo (heurístico): ${device}\n🆔 ID: ${id}`, m, { mentions: [who] })

  } catch (err) {
    console.error(err)
    m.reply('❌ Ocurrió un error al intentar detectar el dispositivo.')
  }
}

handler.command = /^device|dispositivo$/i
export default handler

// Heurística basada en tus ejemplos:
// - IDs ~32 caracteres hex => Android
// - IDs ~20 caracteres hex => iOS
// Ajusta los umbrales si ves otros patrones en tu entorno.
function detectPlatformFromId(id) {
  if (!id || typeof id !== 'string') return 'Desconocido'

  // Normalizar (quitar posibles espacios y no-hex)
  const hex = id.replace(/[^a-fA-F0-9]/g, '')
  const len = hex.length

  // Umbrales (basados en tus ejemplos)
  if (len >= 28) return '🤖 Android (heurístico)'
  if (len <= 22) return '🍏 iOS (heurístico)'

  // Si queda en zona gris, intentar detectar por prefijo conocido (opcional)
  // Ejemplo: si comienza con dígito podría indicar iOS en algunos casos
  if (/^[0-9]/.test(hex)) return '🍏 iOS (posible)'
  if (/^[A-Fa-f]/.test(hex)) return '🤖 Android (posible)'

  return 'Desconocido'
}
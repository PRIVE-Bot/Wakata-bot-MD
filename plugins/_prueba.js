let handler = async (m, { conn }) => {
  let who = m.quoted ? m.quoted.sender : m.sender
  let id = m.quoted ? m.quoted.key?.id : m.key?.id

  if (!id) return m.reply("⚠️ No se pudo detectar el dispositivo.")

  // Detectar dispositivo según el ID del mensaje
  let device
  if (id.endsWith("BAE5") || id.endsWith("BAE6")) {
    device = "🍏 iOS"
  } else if (id.endsWith("BAE0") || id.endsWith("BAE1") || id.endsWith("BAE2") || id.endsWith("BAE3")) {
    device = "🤖 Android"
  } else {
    device = "💻 WhatsApp Web / Desconocido"
  }

  await conn.reply(m.chat, `👤 *Usuario:* @${who.split("@")[0]}\n📱 *Dispositivo:* ${device}`, m, { mentions: [who] })
}

handler.command = /^device$/i
export default handler
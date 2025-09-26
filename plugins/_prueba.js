let handler = async (m, { conn }) => {
  let platform = conn.user.platform || "Desconocido"
  await m.reply(`Según WhatsApp: ${platform}`)
}

handler.command = /^device$/i
export default handler
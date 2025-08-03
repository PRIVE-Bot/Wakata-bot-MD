let handler = async (m, { conn, text, command }) => {
  const groupRegex = /(?:https?:\/\/)?chat\.whatsapp\.com\/([0-9A-Za-z]{22,24})/i
  const channelRegex = /(?:https?:\/\/)?(?:chat\.|www\.)?whatsapp\.com\/channel\/([0-9A-Za-z]{22,24})/i

  let groupCode = text.match(groupRegex)?.[1]
  let channelCode = text.match(channelRegex)?.[1]

  try {
    if (groupCode) {
      let groupInfo = await conn.groupGetInviteInfo(groupCode)
      return m.reply(`✅ *ID del grupo:* \n${groupInfo?.id || "No disponible"}`)
    } else if (channelCode) {
      let channelInfo = await conn.newsletterMetadata("invite", channelCode)
      return m.reply(`📢 *ID del canal:* \n${channelInfo?.id || "No disponible"}`)
    } else {
      return m.reply("❌ Enlace no válido. Por favor proporciona un enlace de grupo o canal de WhatsApp.")
    }
  } catch (e) {
    console.log(e)
    return m.reply("⚠️ Error al obtener el ID. Asegúrate de que el enlace sea válido y el bot no esté bloqueado.")
  }
}

handler.command = ['inspeccionar']
export default handler
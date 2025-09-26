let handler = async (m, { conn }) => {
  try {
    // Si el usuario citó un mensaje, se toma el ID del citado
    let target = m.quoted ? m.quoted : m

    // Extraemos el ID del mensaje
    let messageId = target.key?.id || target.id || null

    if (!messageId) {
      return m.reply("✰ No se pudo obtener el ID del mensaje.")
    }

    // Respuesta con el ID
    await m.reply(`🆔 ID del mensaje:\n${messageId}`)
    
  } catch (e) {
    console.error(e)
    await m.reply("⚠️ Ocurrió un error al obtener el ID.")
  }
}

handler.command = /^idmsg$/i
export default handler
let handler = async (m, { conn, text, participants, groupMetadata }) => {
  try {
    const users = participants
      .map(u => u.id)
      .filter(v => v !== conn.user.jid)

    const groupJid = m.chat
    const groupName = text?.trim() || groupMetadata?.subject || 'Todos'

    
    const messageText = `📢 *MENCIÓN MASIVA EN ${groupName.toUpperCase()}*\n\n` +
                        `@everyone`

    await conn.sendMessage(m.chat, {
      text: messageText,
      mentions: users,
      contextInfo: {
        mentionedJid: users,
        externalAdReply: {
          title: `📣 ${groupName}`,
          body: `Mencionando a todos los miembros`,
          thumbnailUrl: icono, 
          sourceUrl: redes,
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: true
        }
      }
    })
  } catch (error) {
    console.error('Error en comando .tagtext:', error)
    await m.reply(`⚠️ Ocurrió un error al ejecutar el comando.`)
  }
}

handler.command = ['tagtext', 'tagt']
handler.help = ['tagtext', 'tagt']
handler.tags = ['grupo']
handler.admin = true
handler.group = true

export default handler
let handler = async (m, { conn, usedPrefix, command }) => {
  if (!m.quoted) return conn.reply(m.chat, `${emoji} Por favor, cita el mensaje que deseas eliminar.`, m, fake)

  try {
    let delet = m.message.extendedTextMessage.contextInfo.participant
    let bang = m.message.extendedTextMessage.contextInfo.stanzaId

    await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }})

    let chat = global.db.data.chats[m.chat] || {}
    let msgs = chat.messages || []
    let lastMsgs = Object.values(msgs)
      .filter(v => v.key.participant == delet || v.key.remoteJid == delet) 
      .slice(-5) 

    for (let msg of lastMsgs) {
      try {
        await conn.sendMessage(m.chat, { delete: msg.key })
      } catch (e) {}
    }

  } catch {
    return conn.sendMessage(m.chat, { delete: m.quoted.vM.key })
  }
}

handler.help = ['delete']
handler.tags = ['grupo']
handler.command = ['del','delete']
handler.group = false
handler.admin = true
handler.botAdmin = true

export default handler
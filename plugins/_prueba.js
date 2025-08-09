// plugins/testreact.js

let pendingReactions = {} // Guardar mensajes en espera de reacción

let handler = async (m, { conn }) => {
  // Enviar mensaje y guardar su key
  let sentMsg = await conn.sendMessage(m.chat, { text: "✅ Reacciona con 👍 para confirmar o ❌ para cancelar" })

  // Guardar info para que la reacción sea detectada
  pendingReactions[sentMsg.key.id] = {
    chat: m.chat,
    user: m.sender
  }
}

handler.help = ['testreact']
handler.tags = ['test']
handler.command = /^testreact$/i

export default handler

// --- DETECTOR DE REACCIONES ---
export async function before(m, { conn }) {
  if (!m.message || !m.message.reactionMessage) return
  let react = m.message.reactionMessage
  let msgId = react.key.id
  let reaction = react.text

  if (pendingReactions[msgId]) {
    let { chat, user } = pendingReactions[msgId]

    if (reaction === '👍') {
      await conn.sendMessage(chat, { text: `✅ Confirmado por @${user.split('@')[0]}`, mentions: [user] })
      delete pendingReactions[msgId]
    }
    if (reaction === '❌') {
      await conn.sendMessage(chat, { text: `❌ Cancelado por @${user.split('@')[0]}`, mentions: [user] })
      delete pendingReactions[msgId]
    }
  }
}
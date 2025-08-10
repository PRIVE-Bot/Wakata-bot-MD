
import { registerMessageReaction, initReactions } from '../lib/reaction.js'

let isInit = false

export default async function handler(m, { conn, command }) {
  if (!isInit) {
    initReactions(conn)
    isInit = true
  }

  let sentMsg = await conn.sendMessage(m.chat, { text: 'Reacciona ❤️ para saludar o 👍 para despedirte.' })

  registerMessageReaction(sentMsg.key, m.chat, {
    '❤️': async ({ conn, chatId, sender }) => {
      await conn.sendMessage(chatId, { text: `¡Hola, @${sender.split('@')[0]}!` }, { mentions: [sender] })
    },
    '👍': async ({ conn, chatId, sender }) => {
      await conn.sendMessage(chatId, { text: `Adiós, @${sender.split('@')[0]}!` }, { mentions: [sender] })
    }
  })
}

handler.command = ['reacciondemo']
export default handler
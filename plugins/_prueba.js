import { registerMessageReaction, initReactions } from '../lib/reaction.js'

let isInit = false

export default async function handler(m, { conn, command }) {
  if (command !== 'reacciondemo') return

  if (!isInit) {
    initReactions(conn)
    isInit = true
  }

  try {
    let sentMsg = await conn.sendMessage(m.chat, { text: 'Reacciona ❤️ para saludar o 👍 para despedirte.' })

    registerMessageReaction(sentMsg.key, m.chat, {
      '❤️': async ({ conn, chatId, sender, key }) => {
        await conn.sendMessage(chatId, { text: `¡Hola, @${sender.split('@')[0]}!` }, { mentions: [sender], quoted: key })
      },
      '👍': async ({ conn, chatId, sender, key }) => {
        await conn.sendMessage(chatId, { text: `Adiós, @${sender.split('@')[0]}!` }, { mentions: [sender], quoted: key })
      }
    })
  } catch (e) {
    console.error('Error enviando mensaje:', e)
  }
}

handler.command = ['reacciondemo']


export default handler
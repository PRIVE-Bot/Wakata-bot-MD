import { registrarMensaje } from './lib/reaction.js'

let handler = async (m, { conn, command }) => {
  if (command !== 'testreact') return

  const texto = 'Reacciona con ❤️ para activar la acción'
  const msg = await conn.sendMessage(m.chat, { text: texto })

  registrarMensaje(msg.key.id, m.chat, '❤️', async (mReact, conn) => {
    await conn.sendMessage(m.chat, { text: `✅ ¡Acción ejecutada! Usuario @${mReact.sender.split('@')[0]} reaccionó con ❤️`, mentions: [mReact.sender] })
  })
}

handler.command = /^testreact$/i
export default handler
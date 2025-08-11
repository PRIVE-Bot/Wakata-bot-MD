import { createMessageWithReactions } from '../lib/reaction.js'

let handler = async (m, { conn, args }) => {
  const template = `
¡Bienvenido a la comunidad!
Reacciona a este mensaje para unirte a los roles.
  
❤️ = Rol de Jugador
👍 = Rol de Suplente
🔥 = Rol de Lider
  `.trim()

  const actions = {
    '❤️': { command: 'addrole jugador' },
    '👍': { command: 'addrole suplente' },
    '🔥': { command: 'addrole lider' }
  }

  await createMessageWithReactions(conn, m, template, actions)
}

handler.help = ['roles']
handler.tags = ['general']
handler.command = /^(roles|reacciones)$/i
handler.group = true

export default handler

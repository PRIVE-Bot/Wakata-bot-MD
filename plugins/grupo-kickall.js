import { createMessageWithReactions } from '../lib/reactions.js'

let handler = async (m, { conn, participants }) => {
  const text = `
⚠️ *ADVERTENCIA* ⚠️
¿Eliminar a todos los que no son admins?

🗑️ = *Sí*, eliminar
❌ = *No*, cancelar
`

  const msg = await conn.reply(m.chat, text, m)

  createMessageWithReactions(msg, {
    "🗑️": async (conn, chat) => {
      const botId = conn.user.id
      const groupNoAdmins = participants.filter(p => !p.admin && p.id !== botId).map(p => p.id)

      if (!groupNoAdmins.length) {
        return conn.sendMessage(chat, { text: "*No hay usuarios para eliminar.*" })
      }

      for (let userId of groupNoAdmins) {
        await conn.groupParticipantsUpdate(chat, [userId], "remove")
        await new Promise(r => setTimeout(r, 2000))
      }
      conn.sendMessage(chat, { text: "*Eliminación Exitosa.*" })
    },
    "❌": "*cancel*" // aquí dispara el comando .cancel
  })
}

handler.help = ['kickall']
handler.tags = ['group']
handler.command = ['kickall']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
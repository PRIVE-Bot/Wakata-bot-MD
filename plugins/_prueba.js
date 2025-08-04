import { chatUpdate } from '../lib/events.js'

let handler = async (m, { conn, args, command, usedPrefix }) => {
  if (!args[1]) {
    return m.reply(`✘ Uso incorrecto del comando.\n\n📌 Ejemplo:\n*${usedPrefix + command} @usuario true*`)
  }

  let isAdd = /true$/i.test(args[1])
  let who

  if (m.isGroup) {
    who = m.mentionedJid && m.mentionedJid.length
      ? m.mentionedJid[0]
      : m.quoted?.sender
  } else {
    who = m.chat
  }

  if (!who) return m.reply(`🚫 Debes mencionar al usuario o responder a su mensaje.`)
  if (!(who in global.db.data.users)) return m.reply(`⚠️ El usuario no está registrado en la base de datos.`)

  global.db.data.users[who].akinator = { sesi: isAdd }

  return m.reply(
    isAdd
      ? `✅ *Usuario añadido a la lista de Akinator.*`
      : `🗑️ *Usuario eliminado de la lista de Akinator.*`
  )
}

handler.command = ['death', 'callar', 'mute', 'silenciar']
handler.group = true
handler.admin = true
handler.botAdmin = true
handler.rowner = true

export default handler
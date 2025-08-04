import { chatUpdate } from '../lib/events.js'

let handler = async (m, { conn, args, command, usedPrefix }) => {
    let isAdd = /true$/i.test(args[1])
    let who

    // Identificar al usuario en grupos
    if (m.isGroup) {
        who = m.mentionedJid[0] 
            ? m.mentionedJid[0] 
            : m.quoted 
            ? m.quoted.sender 
            : false
    } else {
        who = m.chat
    }

    // Validaciones
    if (!who) throw `*[🚀] Ingresa el @tag del usuario que deseas agregar o eliminar.*`
    if (!args[1]) throw `*[⚙️] Usa la función true o false al final del comando.*`
    if (!(who in global.db.data.users)) throw `*[⚙️] El usuario no se encuentra en la base de datos del bot.*`

    // Mensaje de confirmación
    await m.reply(
        `${isAdd ? '*[🚀] Usuario agregado a la lista con éxito.*' : '*[🚀] Usuario eliminado de la lista con éxito.*'}`
    )

    // Actualizar datos en la base de datos
    global.db.data.users[who].akinator = { sesi: isAdd }
}
handler.command = ['death', 'callar', 'mute', 'silenciar'] // Comandos activadores
handler.group = true // Solo en grupos
handler.admin = true // Solo para admins
handler.rowner = true // Solo para el dueño del bot
handler.botAdmin = true // El bot necesita ser admin

export default handler
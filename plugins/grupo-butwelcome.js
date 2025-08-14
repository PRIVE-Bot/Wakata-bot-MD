import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    
    // Verifica si se ha mencionado a un usuario
    const taggedUserJid = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : null;

    if (!taggedUserJid) {
        // Si no se menciona a nadie, envía un mensaje de error o instruye al usuario.
        return conn.reply(m.chat, `Por favor, etiqueta al usuario que quieres saludar, por ejemplo: ${usedPrefix}${command} @nombre`, m);
    }

    // Obtiene el JID y el nombre del usuario mencionado
    const userJid = taggedUserJid;
    const userName = conn.getName(userJid);

    // Obtiene el nombre del grupo, si es un grupo
    let groupName = m.isGroup ? (await conn.groupMetadata(m.chat)).subject : '';

    // Construye el mensaje de bienvenida.
    let welcomeText = `*👋 ¡Bienvenido(a), @${userJid.split('@')[0]}!*
Te damos la bienvenida al grupo *${groupName}*.
Soy *${global.botname}*, tu bot en este grupo.

> Información: Puedes usar los comandos para conocer más sobre el grupo y nuestras funciones.`

    let imageUrl = global.icono

    const message = {
        image: { url: imageUrl },
        caption: welcomeText,
        // Agrega el JID del usuario mencionado al arreglo de menciones
        mentions: [userJid]
    }

    await conn.sendMessage(m.chat, message)
}

handler.command = ['bienvenido', 'bienvenida']
handler.group = true
handler.botAdmin = false
handler.admin = false

export default handler

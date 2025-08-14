import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    
    // 1. Busca si se ha mencionado a un usuario directamente con @
    let userJid = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : null;

    // 2. Si no se encontró una mención, revisa si es una respuesta a otro mensaje
    if (!userJid && m.quoted) {
        userJid = m.quoted.sender;
    }

    // 3. Si no se encontró ninguna de las dos, envía un mensaje de error
    if (!userJid) {
        return conn.reply(m.chat, `Por favor, etiqueta al usuario que quieres saludar con un @ o responde a uno de sus mensajes con el comando: ${usedPrefix}${command}`, m);
    }

    // Obtiene el nombre del usuario (ya sea por mención o por respuesta)
    const userName = conn.getName(userJid);

    // Obtiene el nombre del grupo, si es un grupo
    const groupName = m.isGroup ? (await conn.groupMetadata(m.chat)).subject : '';

    // Construye el mensaje de bienvenida.
    const welcomeText = `*👋 ¡Bienvenido(a), @${userJid.split('@')[0]}!*
Te damos la bienvenida al grupo *${groupName}*.
Soy *${global.botname}*, tu bot en este grupo.

> Información: Puedes usar los comandos para conocer más sobre el grupo y nuestras funciones.`

    const imageUrl = global.icono

    const message = {
        image: { url: imageUrl },
        caption: welcomeText,
        // Agrega el JID del usuario al arreglo de menciones
        mentions: [userJid]
    }

    await conn.sendMessage(m.chat, message)
}

handler.command = ['bienvenido', 'bienvenida']
handler.group = true
handler.botAdmin = false
handler.admin = false

export default handler

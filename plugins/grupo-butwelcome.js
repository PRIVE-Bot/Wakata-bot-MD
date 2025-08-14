import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    
    let userJid = m.sender
    let userName = conn.getName(userJid)
    let groupName = m.isGroup ? (await conn.groupMetadata(m.chat)).subject : ''

    
    let welcomeText = `*👋 ¡Bienvenido(a), @${userName}!*
Te damos la bienvenida al grupo *${groupName}*.
Soy *${global.botname}*, tu bot en este grupo.

> Información: Puedes usar los comandos para conocer más sobre el grupo y nuestras funciones.`

    let imageUrl = global.icono

    const message = {
        image: { url: imageUrl },
        caption: welcomeText,
        mentions: [userJid]
    }

    await conn.sendMessage(m.chat, message)
}

handler.command = ['bienvenido', 'bienvenida']
handler.group = true
handler.botAdmin = false
handler.admin = false

export default handler

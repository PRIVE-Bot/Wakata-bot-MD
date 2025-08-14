import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    
    let mention = m.quoted ? m.quoted.sender : m.sender

    
    let userName = conn.getName(mention)

    
    let groupName = m.isGroup ? (await conn.groupMetadata(m.chat)).subject : ''

    
    let welcomeText = `*👋 ¡Bienvenido(a), @${userName}!*\n\n`
    welcomeText += `Te damos la bienvenida al grupo *${groupName}*.\n`
    welcomeText += `Soy *${global.botname}*, tu bot en este grupo.\n\n`
    welcomeText += `> Información: Puedes usar los comandos para conocer más sobre el grupo y nuestras funciones.`

 
    let imageUrl = global.icono

    
    const message = {
        image: { url: imageUrl },
        caption: welcomeText,
        mentions: [mention]
    }

    
    await conn.sendMessage(m.chat, message)
}


handler.command = ['bienvenido', 'bienvenida']
handler.group = true
handler.botAdmin = false
handler.admin = false

export default handler
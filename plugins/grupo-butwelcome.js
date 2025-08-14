import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    
    // Obtiene el JID del usuario que envió el mensaje
    let userJid = m.sender

    // Obtiene el nombre del usuario
    let userName = conn.getName(userJid)

    // Obtiene el nombre del grupo, si es un grupo
    let groupName = m.isGroup ? (await conn.groupMetadata(m.chat)).subject : ''

    // Construye el mensaje de bienvenida. La clave es que la mención
    // debe estar en el formato @número_de_teléfono
    let welcomeText = `*👋 ¡Bienvenido(a), @${userJid.split('@')[0]}!*
Te damos la bienvenida al grupo *${groupName}*.
Soy *${global.botname}*, tu bot en este grupo.

> Información: Puedes usar los comandos para conocer más sobre el grupo y nuestras funciones.`

    let imageUrl = global.icono

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

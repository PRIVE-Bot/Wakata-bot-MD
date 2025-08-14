import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        if (!m.isGroup) return m.reply('Este comando solo funciona en grupos.')

        
        let mentionedJid = m.mentionedJid && m.mentionedJid.length > 0 ? m.mentionedJid[0] : m.sender
        let userName = await conn.getName(mentionedJid)

        
        let groupName = (await conn.groupMetadata(m.chat)).subject

        
        let welcomeText = `*👋 ¡Bienvenido(a), @${userName}!*\n\n`
        welcomeText += `Te damos la bienvenida al grupo *${groupName}*.\n`
        welcomeText += `Soy *${global.botname}*, tu bot en este grupo.\n\n`
        welcomeText += `> Información: Puedes usar los comandos para conocer más sobre el grupo y nuestras funciones.`

       
        let imageUrl = global.icono || 'https://i.imgur.com/yourdefaultimage.png'

        
        const message = {
            image: { url: imageUrl },
            caption: welcomeText,
            mentions: [mentionedJid]
        }

        
        await conn.sendMessage(m.chat, message)
    } catch (err) {
        console.error(err)
        m.reply('Ocurrió un error al enviar el mensaje de bienvenida.')
    }
}

handler.command = ['bienvenido', 'bienvenida']
handler.group = true
handler.botAdmin = false
handler.admin = false

export default handler
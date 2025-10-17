import { downloadMediaMessage } from '@whiskeysockets/baileys'
import fs from 'fs'

let handler = async (m, { conn, usedPrefix, command }) => {
  
  if (!m.quoted) return m.reply(`Responde a una imagen, video o audio de *ver una sola vez* con el comando ${usedPrefix + command}.`)

  let msg = m.quoted

 
  if (!msg.message?.viewOnceMessageV2 && !msg.message?.viewOnceMessageV2Extension)
    return m.reply('⚠️ Ese mensaje no es de tipo "ver una sola vez".')

  try {
    
    let viewOnceMsg = msg.message?.viewOnceMessageV2?.message || msg.message?.viewOnceMessageV2Extension?.message
    let type = Object.keys(viewOnceMsg)[0]
    let mediaMsg = viewOnceMsg[type]

    
    let buffer = await downloadMediaMessage(
      { message: viewOnceMsg },
      'buffer',
      {},
      { logger: conn.logger, reuploadRequest: conn.updateMediaMessage }
    )

    if (!buffer) throw new Error('No se pudo descargar el archivo.')

    
    if (type === 'imageMessage') {
      await conn.sendFile(m.chat, buffer, 'imagen.jpg', '🔓 Imagen vista una vez desbloqueada.', m)
    } else if (type === 'videoMessage') {
      await conn.sendFile(m.chat, buffer, 'video.mp4', '🔓 Video vista una vez desbloqueado.', m)
    } else if (type === 'audioMessage') {
      await conn.sendFile(m.chat, buffer, 'audio.mp3', '', m, false, { mimetype: 'audio/mp4' })
    } else {
      return m.reply('⚠️ El formato no es compatible.')
    }

    m.react('✅')
  } catch (e) {
    console.error(e)
    m.reply('❌ Error al procesar el mensaje.')
  }
}

handler.help = ['ver', 'read']
handler.tags = ['tools']
handler.command = /^(ver|read)$/i
export default handler
import fetch from 'node-fetch'
import { prepareWAMessageMedia } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
  // Enlace de la imagen
  const imageUrl = 'https://files.catbox.moe/8vxwld.jpg' 
  
  // Prepara el mensaje de imagen
  const imageMessage = await prepareWAMessageMedia({ image: { url: imageUrl } }, { upload: conn.waUploadToServer })

  // Mensaje de texto con la descripción y el enlace
  const caption = `
🚀 *¡Oferta exclusiva!* 🚀

🔥 Consigue tu propio bot de WhatsApp profesional, rápido y personalizable.

✨ Funciones avanzadas: comandos, stickers, conexión QR, reacciones, mensajes enriquecidos y más.

💼 ¡Ideal para negocios y creadores!

Visita nuestra web:
👉 https://tubotprofesional.com
  `
  
  // Objeto del mensaje final
  const finalMessage = {
    image: imageMessage.image,
    caption: caption,
    contextInfo: {
      externalAdReply: {
        showAdAttribution: true,
        title: '💻 Bot Profesional WhatsApp',
        body: 'Visita nuestra web y conoce todos los detalles',
        thumbnail: imageMessage.image,
        sourceUrl: 'https://tubotprofesional.com',
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }

  // Enviar el mensaje
  await conn.sendMessage(m.chat, finalMessage, { quoted: m })
}

handler.command = ['comprar']
export default handler

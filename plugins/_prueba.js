// plugins/estilo-anuncio.js
/*import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  const imgUrl = 'https://files.catbox.moe/8vxwld.jpg'
  const res = await fetch(imgUrl)
  const thumb = Buffer.from(await res.arrayBuffer())

  const anuncioPro = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "ANUNCIO_PRO"
    },
    message: {
      extendedTextMessage: {
        text: '🚨 *Prueba uno* - Este es un mensaje con estilo Anuncio Ultra Pro.\n\n¡Atención! Información VIP exclusiva para ti.',
        contextInfo: {
          externalAdReply: {
            title: '🔥 Noticia Exclusiva',
            body: 'Haz clic y entérate antes que todos',
            thumbnail: thumb,
            sourceUrl: 'https://tu-enlace.com',
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: true
          },
          locationMessage: {
            name: '⚡ AVISO ULTRA IMPORTANTE ⚡',
            jpegThumbnail: thumb
          }
        }
      }
    },
    participant: "0@s.whatsapp.net"
  }

  await conn.relayMessage(m.chat, anuncioPro.message, { messageId: anuncioPro.key.id })
}

handler.command = /^prueba1$/i
export default handler*/



import fetch from 'node-fetch'
import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
  const thumb = await (await fetch('https://files.catbox.moe/8vxwld.jpg')).buffer()

  const productMessage = generateWAMessageFromContent(
    m.chat,
    {
      productMessage: {
        product: {
          productImage: {
            mimetype: 'image/jpeg',
            jpegThumbnail: thumb,
          },
          productId: '334456799976443',
          title: 'Bot Profesional WhatsApp',
          description:
            `🚀 ¡Tu negocio en el siguiente nivel!\n\n🔥 Consigue un bot de WhatsApp rápido, personalizable y con funciones avanzadas para automatizar tu negocio.\n\n✨ Comandos, stickers, conexión QR, mensajes enriquecidos y más.\n\n💼 ¡Ideal para negocios y creadores!`,
          currencyCode: 'USD',
          priceAmount1000: 500000000000,
          salePriceAmount1000: 0,
          retailerId: '',
          url: 'https://tubotprofesional.com',
        },
        businessOwnerJid: '50432955554@s.whatsapp.net',
        contextInfo: {
          externalAdReply: {
            showAdAttribution: true,
            title: '💻 Bot Profesional WhatsApp',
            body: '¡Empieza a crecer hoy!',
            mediaType: 1,
            thumbnail: thumb,
            sourceUrl: 'https://tubotprofesional.com',
            renderLargerThumbnail: true,
          },
        },
      },
    },
    { quoted: m }
  )

  await conn.sendMessage(m.chat, productMessage.message, { quoted: m })
}

handler.command = ['comprar']

export default handler
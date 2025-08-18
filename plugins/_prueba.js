import fetch from 'node-fetch'
import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
  const res = await fetch('https://files.catbox.moe/oljc0e.png')
  const img = Buffer.from(await res.arrayBuffer())

  const estado = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
      productMessage: {
        product: {
          productImage: { jpegThumbnail: img },
          title: "Membresía Naruto-Bot MD",
          description: "Suscríbete y obtén beneficios exclusivos",
          currencyCode: "USD",
          priceAmount1000: "5000",
          retailerId: "BOT"
        },
        businessOwnerJid: "0@s.whatsapp.net"
      }
    }
  }

  await conn.sendMessage(
    m.chat,
    { text: '✨ Estado de ejemplo con estilo de WhatsApp ✨' },
    { quoted: estado }
  )
}
handler.command = /^estado$/i
export default handler
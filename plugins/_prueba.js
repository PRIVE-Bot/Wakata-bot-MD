import fetch from 'node-fetch'
import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'


let handler = async (m, {conn}) => {
const res = await fetch('https://files.catbox.moe/oljc0e.png'); 
const thumb3 = Buffer.from(await res.arrayBuffer());

const fkontak = {
    key: { 
        fromMe: false, 
        remoteJid: "120363368035542631@g.us", 
        participant: m.sender  // 👈 el mismo usuario que ejecuta el comando
    },
    message: {
        productMessage: {
            product: {
                productImage: { jpegThumbnail: img },
                title: "𝗠𝗘𝗡𝗨 ＝ 𝗟𝗜𝗦𝗧𝗔 𝗗𝗘 𝗙𝗨𝗡𝗖𝗜𝗢𝗡𝗘𝗦",
                description: botname,
                currencyCode: "USD",
                priceAmount1000: "5000", 
                retailerId: "BOT"
            },
            businessOwnerJid: m.sender
        }
    }
}

  await conn.sendMessage(
    m.chat,
    { text: '✨ Estado de ejemplo con estilo de WhatsApp ✨' },
    { quoted: fkontak }
  )
}
handler.command = /^estado$/i
export default handler
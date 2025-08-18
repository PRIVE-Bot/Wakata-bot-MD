import fetch from 'node-fetch'
import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'


let handler = async (m, { conn }) => {
  const res = await fetch('https://files.catbox.moe/oljc0e.png');
const thumb2 = Buffer.from(await res.arrayBuffer());

const fkontak = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
        orderMessage: {
            itemCount: 1,
            status: 1,
            surface: 1,
            message: `${botname}`,
            orderTitle: "Mejor Bot",
            thumbnail: thumb2
        }
       businessOwnerJid: conn.user.jid 
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


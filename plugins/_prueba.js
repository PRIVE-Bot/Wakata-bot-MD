import fetch from 'node-fetch'
import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

const res = await fetch('https://files.catbox.moe/d48sk2.jpg');
const thumb2 = Buffer.from(await res.arrayBuffer());

const fkontak = {
    key: { 
        fromMe: false, 
        remoteJid: "120363368035542631@g.us", 
        participant: m.sender 
    },
    message: {
        documentMessage: {
            title: "𝗠𝗘𝗡𝗨 ＝ 𝗟𝗜𝗦𝗧𝗔 𝗗𝗘 𝗙𝗨𝗡𝗖𝗜𝗢𝗡𝗘𝗦",
            fileName: "Naruto-Bot.pdf",
            jpegThumbnail: thumb2
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
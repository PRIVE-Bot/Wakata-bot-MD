import fetch from 'node-fetch'
import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

const res = await fetch('https://files.catbox.moe/oljc0e.png'); 
const thumb3 = Buffer.from(await res.arrayBuffer());

let fkontak = {
    key: { 
        fromMe: false, 
        remoteJid: "120363368035542631@g.us", 
        participant: m.sender 
    },
    message: {
        imageMessage: {
            mimetype: 'image/jpeg',
            caption: botname,
            jpegThumbnail: thumb3
        }
    }
};

  await conn.sendMessage(
    m.chat,
    { text: '✨ Estado de ejemplo con estilo de WhatsApp ✨' },
    { quoted: fkontak }
  )
}
handler.command = /^estado$/i
export default handler
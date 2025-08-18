import fetch from 'node-fetch'
import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'


let handler = async (m, { conn }) => {
  const res = await fetch('https://files.catbox.moe/oljc0e.png');
  const img = Buffer.from(await res.arrayBuffer());

  const fkontak = {
    key: { 
      fromMe: false, 
      remoteJid: "120363368035542631@g.us", 
      participant: m.sender 
    },
    message: {
      imageMessage: {
        mimetype: 'image/jpeg',
        caption: `✨ Membresía Naruto-Bot MD ✨\n${botname}`,
        jpegThumbnail: img,
        contextInfo: {
          externalAdReply: {
            title: "Membresía Naruto-Bot MD",
            body: botname,
            thumbnail: img,
            sourceUrl: "https://whatsapp.com/channel/0029VbAzn9GGU3BQw830eA0F",
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }
    }
  };
};

  await conn.sendMessage(
    m.chat,
    { text: '✨ Estado de ejemplo con estilo de WhatsApp ✨' },
    { quoted: fkontak }
  )
}
handler.command = /^estado$/i
export default handler


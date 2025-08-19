import fetch from 'node-fetch'
import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'


const res = await fetch('https://files.catbox.moe/f8qrut.png') // tu foto
const img = Buffer.from(await res.arrayBuffer())

const fakePerfil = {
  key: { fromMe: false, participant: "0@s.whatsapp.net" },
  message: {
    contactMessage: {
      displayName: "Naruto Uzumaki", // nombre que quieras mostrar
      vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Naruto Uzumaki\nTEL;type=CELL;type=VOICE;waid=521111111111:+52 1 111 111 1111\nEND:VCARD`
    },
    contextInfo: {
      externalAdReply: {
        title: "Naruto-Bot",
        body: "Audio oficial",
        thumbnail: img, // aquí va la imagen
        sourceUrl: "https://whatsapp.com/channel/0029VbB46nl2ER6dZac6Nd1o"
      }
    }
  }
}

  await conn.sendMessage(
    m.chat,
    { text: '✨ Estado de ejemplo con estilo de WhatsApp ✨' },
    { quoted: fakePerfil }
  )
}
handler.command = /^estado$/i
export default handler


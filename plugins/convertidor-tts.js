import fetch from 'node-fetch'
import fs from 'fs'

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('📌 Ingresa el texto que quieres convertir a voz.')

  const resImg = await fetch('https://files.catbox.moe/8vxwld.jpg')
  const thumb = Buffer.from(await resImg.arrayBuffer())

  const resAudio = await fetch(`https://api.tts.quest/v3/voicevox/speak?text=${encodeURIComponent(text)}&speaker=1`)
  const json = await resAudio.json()

  if (!json.audioUrl) return m.reply('❌ No se pudo generar el audio.')

  const audioBuffer = await (await fetch(json.audioUrl)).buffer()

  await conn.sendMessage(m.chat, {
    audio: audioBuffer,
    mimetype: 'audio/mpeg',
    ptt: true
  }, {
    quoted: {
      key: m.key,
      message: {
        imageMessage: {
          mimetype: 'image/jpeg',
          caption: '🎤 Audio creado con éxito.',
          jpegThumbnail: thumb
        }
      }
    }
  })
}

handler.help = ['tts <lang> <texto>'];
handler.tags = ['transformador'];
handler.command = ['tts'];
handler.group = true;
handler.register = true;

export default handler;
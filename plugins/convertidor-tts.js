import gtts from 'node-gtts'
import { readFileSync, unlinkSync } from 'fs'
import { join } from 'path'
import fetch from 'node-fetch'

const defaultLang = 'es'

const handler = async (m, { conn, args }) => {
  let lang = args[0]
  let text = args.slice(1).join(' ')
  if ((args[0] || '').length !== 2) {
    lang = defaultLang
    text = args.join(' ')
  }
  if (!text && m.quoted?.text) text = m.quoted.text

  const imgRes = await fetch('https://files.catbox.moe/nuu7tj.jpg')
  const thumb3 = Buffer.from(await imgRes.arrayBuffer())
  let allfake = {
    key: m.key,
    message: {
      imageMessage: {
        mimetype: 'image/jpeg',
        caption: '🎤 Audio creado con éxito.',
        jpegThumbnail: thumb3
      }
    }
  }

  text = text.replace(/[^\p{L}\p{N}\p{Zs}]/gu, '')
  let audioBuffer
  try {
    audioBuffer = await tts(text, lang)
  } catch (e) {
    m.reply(e + '')
    text = args.join(' ').replace(/[^\p{L}\p{N}\p{Zs}]/gu, '')
    if (!text) throw '❗ Por favor, ingresa una frase válida.'
    audioBuffer = await tts(text, defaultLang)
  }

  if (audioBuffer) {
    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: allfake })
  }
}

handler.help = ['tts <lang> <texto>']
handler.tags = ['transformador']
handler.command = ['tts']
handler.group = true
handler.register = true

export default handler

function tts(text, lang = 'es') {
  return new Promise((resolve, reject) => {
    try {
      const gttsInstance = gtts(lang)
      const filePath = join(global.__dirname(import.meta.url), '../tmp', Date.now() + '.mp3')
      gttsInstance.save(filePath, text, () => {
        const buffer = readFileSync(filePath)
        unlinkSync(filePath)
        resolve(buffer)
      })
    } catch (e) {
      reject(e)
    }
  })
}
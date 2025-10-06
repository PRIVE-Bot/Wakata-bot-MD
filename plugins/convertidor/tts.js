import gtts from 'node-gtts'
import { readFileSync, unlinkSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const defaultLang = 'es'

const handler = async (m, { conn, args, text }) => {
  if (!text) return conn.reply(m.chat, `${emoji} Por favor, ingresa el texto para convertir a audio.`, m, rcanal)

  let lang = args[0]
  let txt = args.slice(1).join(' ')

  if ((args[0] || '').length !== 2) {
    lang = defaultLang
    txt = args.join(' ')
  }

        const res = await fetch('https://i.postimg.cc/FKm75nJz/1759734148064.jpg');
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
                    caption: '𝗖𝗢𝗡𝗩𝗘𝗥𝗧𝗜𝗗𝗢𝗥 𝗧𝗧𝗦',
                    jpegThumbnail: thumb3
                }
            }
        };

  txt = txt.replace(/[^\p{L}\p{N}\p{Zs}]/gu, '')

  let res
  try {
    res = await tts(txt, lang)
  } catch (e) {
    m.reply(String(e))
    res = await tts(txt, defaultLang)
  }

  if (res) await conn.sendFile(m.chat, res, 'tts.opus', null, fkontak, fake)
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
      const __dirname = dirname(fileURLToPath(import.meta.url))
      const tts = gtts(lang)
      const filePath = join(__dirname, '../../tmp', `${Date.now()}.wav`)

      tts.save(filePath, text, () => {
        const buffer = readFileSync(filePath)
        unlinkSync(filePath)
        resolve(buffer)
      })
    } catch (e) {
      reject(e)
    }
  })
}
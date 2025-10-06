import gtts from 'node-gtts'
import { readFileSync, unlinkSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const defaultLang = 'es'

const handler = async (m, { conn, args, text }) => {
  if (!text) return conn.reply(m.chat, '❗ Por favor, ingresa una frase válida.', m)

  let lang = args[0]
  let txt = args.slice(1).join(' ')

  if ((args[0] || '').length !== 2) {
    lang = defaultLang
    txt = args.join(' ')
  }

  txt = txt.replace(/[^\p{L}\p{N}\p{Zs}]/gu, '')

  let res
  try {
    res = await tts(txt, lang)
  } catch (e) {
    m.reply(String(e))
    res = await tts(txt, defaultLang)
  }

  if (res) await conn.sendFile(m.chat, res, 'tts.opus', null, m, true)
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
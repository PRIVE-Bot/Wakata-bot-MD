import fetch from 'node-fetch'
import { format } from 'util'

let handler = async (m, { conn, text }) => {
  try {
    if (m.fromMe) return
    if (!text || !/^https?:\/\//.test(text)) {
      return m.reply(`${emoji} Por favor, ingresa una *URL* válida.`)
    }

    await m.react('🕒')
    const res = await fetch(text)
    const contentType = res.headers.get('content-type') || ''
    const contentLength = Number(res.headers.get('content-length')) || 0

    if (contentLength > 100 * 1024 * 1024) {
      return m.reply(`⚠️ El archivo es demasiado grande (${(contentLength / 1024 / 1024).toFixed(2)} MB).`)
    }

    if (!/text|json/.test(contentType)) {
      await conn.sendFile(m.chat, text, 'archivo', text, m)
      await m.react('📤')
      return
    }

    let buffer = await res.buffer()
    let txt = buffer.toString('utf-8')

    try {
      const json = JSON.parse(txt)
      txt = format(json)
    } catch {}

    const maxLength = 65536
    const output = txt.length > maxLength ? txt.slice(0, maxLength) + '\n\n[...contenido truncado...]' : txt

    await m.reply(output)
    await m.react('✔️')
  } catch (err) {
    await m.react('❌')
    await m.reply(`❗ Ocurrió un error al procesar la URL.\n\nDetalles: ${err.message || err}`)
  }
}

handler.help = ['get']
handler.tags = ['tools']
handler.command = ['fetch', 'get']
handler.rowner = true

export default handler
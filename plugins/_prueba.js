import { toPTT, toAudio } from '../lib/converter.js'

let handler = async (m, { conn }) => {
  try {
    if (!m.quoted) throw `✳️ Responde a una *nota de voz* o *música*`

    let q = m.quoted
    let mime = (q.msg || q).mimetype || ''
    if (!/audio/.test(mime)) throw `❌ Solo funciona con *audios*`

    let media = await q.download()
    if (!media) throw `⚠️ No pude descargar el audio`

    let result, filename, mimetype, type

    if (/ogg/.test(mime) && /opus/.test(mime)) {
      // 📌 Si es nota de voz -> convertir a música
      result = await toAudio(media, 'ogg')
      filename = 'audio.opus'
      mimetype = 'audio/ogg; codecs=opus'
      type = { audio: result.data, mimetype }
      await conn.sendMessage(m.chat, type, { quoted: m })
    } else {
      // 📌 Si es música -> convertir a nota de voz
      result = await toPTT(media, mime.split('/')[1])
      filename = 'ptt.ogg'
      mimetype = 'audio/ogg; codecs=opus'
      type = { audio: result.data, mimetype, ptt: true }
      await conn.sendMessage(m.chat, type, { quoted: m })
    }

    await result.delete?.()
  } catch (e) {
    console.error(e)
    m.reply('⚠️ Error al procesar el audio.')
  }
}

handler.help = ['cambiar']
handler.tags = ['audio']
handler.command = /^cambiar$/i

export default handler
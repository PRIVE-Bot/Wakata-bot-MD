import { sticker } from '../../lib/sticker.js'
import uploadFile from '../../lib/uploadFile.js'
import uploadImage from '../../lib/uploadImage.js'
import { webp2png } from '../../lib/webp2mp4.js'
import Jimp from 'jimp'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { tmpdir } from 'os'
import ffmpeg from 'fluent-ffmpeg'

const getFrame = (buffer, outPath) => new Promise((resolve, reject) => {
  const tmp = path.join(tmpdir(), `video_${Date.now()}.mp4`)
  fs.writeFileSync(tmp, buffer)
  ffmpeg(tmp)
    .on('end', () => {
      fs.unlinkSync(tmp)
      resolve(fs.readFileSync(outPath))
    })
    .on('error', reject)
    .screenshots({ count: 1, folder: path.dirname(outPath), filename: path.basename(outPath) })
})

let handler = async (m, { conn, args, command }) => {
  const res = await fetch('https://files.catbox.moe/p87uei.jpg')
  const thumb = Buffer.from(await res.arrayBuffer())
  const fkontak = {
    key: { fromMe: false, participant: m.sender },
    message: { imageMessage: { jpegThumbnail: thumb, caption: '✨ 𝗦𝗧𝗜𝗖𝗞𝗘𝗥 𝗚𝗘𝗡𝗘𝗥𝗔𝗗𝗢 𝗖𝗢𝗡 𝗘𝗫𝗜𝗧𝗢 ✨' } }
  }

  const fkontak2 = {
    key: { fromMe: false, participant: m.sender },
    message: { imageMessage: { jpegThumbnail: thumb, caption: '⚠︎      𝗘𝗥𝗥𝗢𝗥    ⚠︎ ' } }
  }

  let texto = args.filter(a => !/^(co|cc|cp)$/i.test(a)).join(' ').trim()
  let forma = (args.find(a => /^(co|cc|cp)$/i.test(a)) || '').toLowerCase()
  let stiker = false
  let q = m.quoted ? m.quoted : m
  let mime = q.mimetype || q.msg?.mimetype || ''
  let url = args[0] && /https?:\/\//.test(args[0]) ? args[0] : null
  let media

  try {
    if (url) {
      let response = await fetch(url)
      media = Buffer.from(await response.arrayBuffer())
      mime = response.headers.get('content-type') || ''
    } else if (/webp|image|video/.test(mime)) {
      media = await q.download?.()
    } else return conn.reply(m.chat, '✰ Envía, responde o adjunta una imagen, sticker o video.', m, fkontak)

    if (!media) return conn.reply(m.chat, '⚠️ No se pudo descargar el archivo.', m, fkontak2)

    if (/webp/.test(mime)) {
      media = await webp2png(media)
      mime = 'image/png'
    }

    if (/video|gif/.test(mime)) {
      const out = path.join(tmpdir(), `frame_${Date.now()}.png`)
      const frame = await getFrame(media, out)
      media = frame
      mime = 'image/png'
    }

    let jimg = await Jimp.read(media)
    jimg.resize(512, 512)
    let { width, height } = jimg.bitmap

    if (forma === 'cp') jimg.contain(500, 500)
    if (forma === 'cc') {
      const mask = new Jimp(width, height, '#00000000')
      mask.scan(0, 0, width, height, function (x, y, idx) {
        const dx = x - width / 2
        const dy = y - height / 2
        const r = Math.sqrt(dx * dx + dy * dy)
        if (r < width / 2) {
          this.bitmap.data[idx + 3] = 255
        }
      })
      jimg.mask(mask, 0, 0)
    }
    if (forma === 'co') {
      const mask = new Jimp(width, height, '#00000000')
      mask.scan(0, 0, width, height, function (x, y, idx) {
        const nx = (x - width / 2) / (width / 2)
        const ny = (height / 2 - y) / (height / 2)
        const sx = nx * 1.25
        const sy = ny * 1.4 - 0.25
        const eq = Math.pow(sx * sx + sy * sy - 1, 3) - sx * sx * sy * sy * sy
        if (eq <= 0) this.bitmap.data[idx + 3] = 255
      })
      jimg.mask(mask, 0, 0)
    }

    if (texto) {
      const brillo = jimg.bitmap.data.reduce((a, _, i) => i % 4 !== 3 ? a + jimg.bitmap.data[i] : a, 0) / (width * height * 3)
      const color = brillo > 127 ? '#000000' : '#FFFFFF'
      const fuente = await Jimp.loadFont(color === '#000000' ? Jimp.FONT_SANS_64_BLACK : Jimp.FONT_SANS_64_WHITE)
      const sombra = await Jimp.loadFont(color === '#000000' ? Jimp.FONT_SANS_64_WHITE : Jimp.FONT_SANS_64_BLACK)
      jimg.print(sombra, 3, -3, { text: texto, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM }, width, height - 20)
      jimg.print(fuente, 0, 0, { text: texto, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM }, width, height - 20)
    }

    const finalImg = await jimg.getBufferAsync(Jimp.MIME_PNG)
    stiker = await sticker(finalImg, false, global.packsticker, global.packsticker2)
  } catch (e) {
    console.error(e)
    return conn.reply(m.chat, '⚠️ Ocurrió un error al procesar el sticker.', m, fkontak2)
  }

  if (stiker) await conn.sendMessage(m.chat, { sticker: stiker, ...global.rcanal }, { quoted: fkontak })
  else conn.reply(m.chat, `✰ Envía o responde una imagen, sticker o video para convertirlo a sticker.

Formas:
/${command} => normal
/${command} co => corazón
/${command} cc => círculo
/${command} cp => normalizar`, m, fkontak)
}

handler.help = ['sticker <texto opcional>', 's <texto opcional>']
handler.tags = ['sticker']
handler.command = ['s', 'sticker', 'stiker']

export default handler
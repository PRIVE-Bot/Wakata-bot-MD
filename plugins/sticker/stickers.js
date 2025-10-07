import { sticker } from '../../lib/sticker.js'
import { webp2png, webp2mp4 } from '../../lib/webp2mp4.js'
import Jimp from 'jimp'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { tmpdir } from 'os'
import ffmpeg from 'fluent-ffmpeg'

const tmp = ext => path.join(tmpdir(), `${Date.now()}.${ext}`)

let handler = async (m, { conn, args, command }) => {
  const res = await fetch('https://files.catbox.moe/p87uei.jpg')
  const thumb = Buffer.from(await res.arrayBuffer())
  let user = m.sender
  const fkontak = { key:{fromMe:false,participant:user},message:{imageMessage:{jpegThumbnail:thumb,caption:'✨ 𝗦𝗧𝗜𝗖𝗞𝗘𝗥 𝗚𝗘𝗡𝗘𝗥𝗔𝗗𝗢 𝗖𝗢𝗡 𝗘𝗫𝗜𝗧𝗢 ✨'}}}
  const fkontak2 = { key:{fromMe:false,participant:user},message:{imageMessage:{jpegThumbnail:thumb,caption:'⚠︎ 𝗘𝗥𝗥𝗢𝗥 ⚠︎'}}}

  let forma = ''
  let texto = ''
  for (let a of args) {
    if (/^(co|cc|cp)$/i.test(a)) forma = a.toLowerCase()
    else texto += (texto ? ' ' : '') + a
  }

  let stiker = false

  try {
    let q = m.quoted ? m.quoted : m
    let mime = q.mimetype || q.msg?.mimetype || q.message?.imageMessage?.mimetype || ''
    let url = args.find(a => /^https?:\/\//.test(a))
    let media

    if (url) {
      const response = await fetch(url)
      media = Buffer.from(await response.arrayBuffer())
      mime = response.headers.get('content-type') || ''
    } else if (/image|webp|video|gif/.test(mime)) {
      media = await q.download?.()
    } else return conn.reply(m.chat, '✰ Envía o responde una imagen, video, gif o sticker para convertirlo a sticker.', m, fkontak)

    if (!media) return conn.reply(m.chat, '⚠️ No se pudo descargar el archivo.', m, fkontak2)

    if (/webp/.test(mime)) {
      const out = await webp2mp4(media)
      if (out?.url) {
        const buff = await (await fetch(out.url)).arrayBuffer()
        media = Buffer.from(buff)
        mime = 'video/mp4'
      } else {
        media = await webp2png(media)
        mime = 'image/png'
      }
    }

    if (/video|gif/.test(mime)) {
      const tempIn = tmp('mp4')
      const tempOut = tmp('webp')
      fs.writeFileSync(tempIn, media)
      await new Promise((resolve, reject) => {
        ffmpeg(tempIn)
          .inputFormat('mp4')
          .outputOptions([
            '-vcodec libwebp',
            '-vf', 'scale=512:-1:flags=lanczos, pad=512:512:(ow-iw)/2:(oh-ih)/2:color=0x00000000, fps=15',
            '-loop 0',
            '-preset default',
            '-an',
            '-vsync 0',
            '-t 6'
          ])
          .toFormat('webp')
          .save(tempOut)
          .on('end', resolve)
          .on('error', reject)
      })
      if (!fs.existsSync(tempOut)) throw new Error('No se generó el sticker')
      stiker = fs.readFileSync(tempOut)
      fs.unlinkSync(tempIn)
      fs.unlinkSync(tempOut)
    } else {
      let jimg = await Jimp.read(media)
      jimg.cover(512, 512)
      const { width, height } = jimg.bitmap
      jimg.background(0x00000000)

      if (forma === 'cp') jimg.contain(512, 512)

      if (forma === 'cc' || forma === 'co') {
        const w2 = width * 2
        const h2 = height * 2
        const mask = new Jimp(w2, h2, 0x00000000)
        const cx = w2 / 2
        const cy = h2 / 2
        const radius = Math.min(w2, h2) / 2
        const scaleX = 1.25
        const scaleY = 1.35
        const offsetY = 0.05
        for (let y = 0; y < h2; y++) {
          for (let x = 0; x < w2; x++) {
            let alpha = 0
            if (forma === 'cc') {
              const dx = x - cx
              const dy = y - cy
              if (Math.sqrt(dx * dx + dy * dy) <= radius) alpha = 255
            } else if (forma === 'co') {
              const nx = (x - cx) / cx * scaleX
              const ny = (cy - y) / cy * scaleY - offsetY
              const eq = Math.pow(nx * nx + ny * ny - 1, 3) - nx * nx * ny * ny * ny
              if (eq <= 0) alpha = 255
            }
            mask.setPixelColor(Jimp.rgbaToInt(255, 255, 255, alpha), x, y)
          }
        }
        mask.resize(width, height, Jimp.RESIZE_BILINEAR)
        jimg.mask(mask, 0, 0)
      }

      if (texto) {
        const brillo = jimg.bitmap.data.reduce((a, _, i) => i % 4 !== 3 ? a + jimg.bitmap.data[i] : a, 0) / (width * height * 3)
        const color = brillo > 127 ? Jimp.FONT_SANS_64_BLACK : Jimp.FONT_SANS_64_WHITE
        const fuente = await Jimp.loadFont(color)
        const sombra = await Jimp.loadFont(color === Jimp.FONT_SANS_64_BLACK ? Jimp.FONT_SANS_64_WHITE : Jimp.FONT_SANS_64_BLACK)
        jimg.print(sombra, 3, -3, { text: texto, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM }, width, height - 20)
        jimg.print(fuente, 0, 0, { text: texto, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM }, width, height - 20)
      }

      const finalImg = await jimg.getBufferAsync(Jimp.MIME_PNG)
      stiker = await sticker(finalImg, false, global.packsticker, global.packsticker2)
    }
  } catch (e) {
    console.error(e)
    return conn.reply(m.chat, '⚠️ Ocurrió un error al procesar el sticker.', m, fkontak2)
  }

  if (stiker) await conn.sendMessage(m.chat, { sticker: stiker, ...global.rcanal }, { quoted: fkontak })
  else conn.reply(m.chat, `✰ Envía o responde una imagen, video, gif o sticker para convertirlo a sticker.

Formas:
/${command} => normal
/${command} co => corazón
/${command} cc => círculo
/${command} cp => normalizar`, m, fkontak)
}

handler.help = ['sticker <texto opcional>','s <texto opcional>']
handler.tags = ['sticker']
handler.command = ['s','sticker','stiker']

export default handler
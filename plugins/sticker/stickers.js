import { createCanvas, loadImage } from '@napi-rs/canvas'
import { sticker } from '../../lib/sticker.js'
import { webp2png, webp2mp4 } from '../../lib/webp2mp4.js'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { tmpdir } from 'os'
import ffmpeg from 'fluent-ffmpeg'

const tmp = ext => path.join(tmpdir(), `${Date.now()}.${ext}`)

const shapes = {
  no: (ctx, img) => ctx.drawImage(img, 0, 0, 512, 512),
  cc: (ctx, img) => {
    ctx.beginPath()
    ctx.arc(256, 256, 256, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(img, 0, 0, 512, 512)
  },
  co: (ctx, img) => {
    const mask = createCanvas(512, 512).getContext2D()
    mask.beginPath()
    mask.moveTo(256, 20)
    mask.bezierCurveTo(470, 20, 470, 480, 256, 500)
    mask.bezierCurveTo(40, 480, 40, 20, 256, 20)
    mask.closePath()
    mask.fill()
    ctx.drawImage(img, 0, 0, 512, 512)
    ctx.globalCompositeOperation = 'destination-in'
    ctx.drawImage(mask.canvas, 0, 0)
  },
  di: (ctx, img) => {
    const mask = createCanvas(512, 512).getContext2D()
    mask.beginPath()
    mask.moveTo(256, 0)
    mask.lineTo(512, 256)
    mask.lineTo(256, 512)
    mask.lineTo(0, 256)
    mask.closePath()
    mask.fill()
    ctx.drawImage(img, 0, 0, 512, 512)
    ctx.globalCompositeOperation = 'destination-in'
    ctx.drawImage(mask.canvas, 0, 0)
  },
  st: (ctx, img) => {
    const mask = createCanvas(512, 512).getContext2D()
    const spikes = 5
    const outerRadius = 256
    const innerRadius = 100
    let rot = Math.PI / 2 * 3
    let x = 256
    let y = 256
    let step = Math.PI / spikes
    mask.beginPath()
    mask.moveTo(x, y - outerRadius)
    for (let i = 0; i < spikes; i++) {
      mask.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius)
      rot += step
      mask.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius)
      rot += step
    }
    mask.closePath()
    mask.fill()
    ctx.drawImage(img, 0, 0, 512, 512)
    ctx.globalCompositeOperation = 'destination-in'
    ctx.drawImage(mask.canvas, 0, 0)
  },
  he: (ctx, img) => {
    const mask = createCanvas(512, 512).getContext2D()
    mask.beginPath()
    const r = 256
    const cx = 256
    const cy = 256
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI / 3 * i - Math.PI / 6
      const x = cx + r * Math.cos(angle)
      const y = cy + r * Math.sin(angle)
      if (i === 0) mask.moveTo(x, y)
      else mask.lineTo(x, y)
    }
    mask.closePath()
    mask.fill()
    ctx.drawImage(img, 0, 0, 512, 512)
    ctx.globalCompositeOperation = 'destination-in'
    ctx.drawImage(mask.canvas, 0, 0)
  },
  ov: (ctx, img) => {
    ctx.save()
    ctx.beginPath()
    ctx.ellipse(256, 256, 256, 200, 0, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(img, 0, 0, 512, 512)
    ctx.restore()
  },
  tr: (ctx, img) => {
    const mask = createCanvas(512, 512).getContext2D()
    mask.beginPath()
    mask.moveTo(256, 0)
    mask.lineTo(512, 512)
    mask.lineTo(0, 512)
    mask.closePath()
    mask.fill()
    ctx.drawImage(img, 0, 0, 512, 512)
    ctx.globalCompositeOperation = 'destination-in'
    ctx.drawImage(mask.canvas, 0, 0)
  },
  rh: (ctx, img) => {
    const mask = createCanvas(512, 512).getContext2D()
    mask.beginPath()
    mask.moveTo(256, 0)
    mask.lineTo(512, 256)
    mask.lineTo(256, 512)
    mask.lineTo(0, 256)
    mask.closePath()
    mask.fill()
    ctx.drawImage(img, 0, 0, 512, 512)
    ctx.globalCompositeOperation = 'destination-in'
    ctx.drawImage(mask.canvas, 0, 0)
  }
}

let handler = async (m, { conn, args, command }) => {
  const res = await fetch('https://files.catbox.moe/p87uei.jpg')
  const thumb = Buffer.from(await res.arrayBuffer())
  let user = m.sender
  const fkontak = { key:{fromMe:false,participant:user},message:{imageMessage:{jpegThumbnail:thumb,caption:'✨ STICKER GENERADO ✨'}}}
  const fkontak2 = { key:{fromMe:false,participant:user},message:{imageMessage:{jpegThumbnail:thumb,caption:'⚠ ERROR ⚠'}}}

  let texto = args.filter(a=>!/^(no|co|cc|cp|di|st|he|ov|tr|rh)$/i.test(a)).join(' ').trim()
  let forma = (args.find(a=>/^(no|co|cc|cp|di|st|he|ov|tr|rh)$/i.test(a))||'no').toLowerCase()
  let stiker = false

  try {
    let q = m.quoted ? m.quoted : m
    let mime = q.mimetype || q.msg?.mimetype || q.message?.imageMessage?.mimetype || ''

    if (/video|gif/.test(mime)) {
      let vid = await q.download?.()
      if (!vid) return conn.reply(m.chat, '⚠️ No se pudo descargar el video o gif.', fkontak2)
      const tempIn = tmp('mp4')
      const tempOut = tmp('webp')
      fs.writeFileSync(tempIn, vid)
      await new Promise((resolve, reject) => {
        ffmpeg(tempIn)
          .inputFormat('mp4')
          .outputOptions([
            '-vcodec libwebp',
            '-filter:v fps=15,scale=512:-1:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=white,format=yuva420p',
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
    } else if (/webp|image/.test(mime)) {
      let img = await q.download?.()
      if (!img) return conn.reply(m.chat, `✰ Envía una imagen válida.\nFormas:\nno, co, cc, cp, di, st, he, ov, tr, rh`, m, fkontak2)
      const jimg = await loadImage(img)
      const canvas = createCanvas(512, 512)
      const ctx = canvas.getContext2D()
      (shapes[forma] || shapes.no)(ctx, jimg)
      if (texto) {
        ctx.font = 'bold 40px Sans-serif'
        ctx.fillStyle = '#00ffff'
        ctx.textAlign = 'center'
        ctx.shadowColor = '#00ffff'
        ctx.shadowBlur = 10
        ctx.fillText(texto, 256, 480)
      }
      const buffer = canvas.toBuffer('image/png')
      stiker = await sticker(buffer, false, global.packsticker, global.packsticker2)
    } else {
      return conn.reply(m.chat, `✰ Envía una imagen válida.\nFormas:\nno, co, cc, cp, di, st, he, ov, tr, rh`, m, fkontak2)
    }
  } catch (e) {
    console.error(e)
    return conn.reply(m.chat, `⚠️ Error al procesar el sticker. ${e.message}`, fkontak2)
  }

  if (stiker) await conn.sendMessage(m.chat, { sticker: stiker, ...global.rcanal }, { quoted: fkontak })
  else conn.reply(m.chat, `✰ Envía una imagen válida.\nFormas:\nno, co, cc, cp, di, st, he, ov, tr, rh`, m, fkontak2)
}

handler.help = ['sticker <texto opcional>', 's <texto opcional>']
handler.tags = ['sticker']
handler.command = ['s', 'sticker', 'stiker']

export default handler
import { createCanvas, loadImage } from '@napi-rs/canvas'
import { sticker } from '../../lib/sticker.js'
import { tmpdir } from 'os'
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
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
    ctx.beginPath()
    ctx.moveTo(256, 20)
    ctx.bezierCurveTo(470, 20, 470, 480, 256, 500)
    ctx.bezierCurveTo(40, 480, 40, 20, 256, 20)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(img, 0, 0, 512, 512)
  },
  di: (ctx, img) => {
    ctx.beginPath()
    ctx.moveTo(256, 0)
    ctx.lineTo(512, 256)
    ctx.lineTo(256, 512)
    ctx.lineTo(0, 256)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(img, 0, 0, 512, 512)
  },
  st: (ctx, img) => {
    const spikes = 5
    const outerRadius = 256
    const innerRadius = 100
    let rot = Math.PI / 2 * 3
    let x = 256
    let y = 256
    let step = Math.PI / spikes
    ctx.beginPath()
    ctx.moveTo(x, y - outerRadius)
    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius)
      rot += step
      ctx.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius)
      rot += step
    }
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(img, 0, 0, 512, 512)
  },
  he: (ctx, img) => {
    const r = 256
    const cx = 256
    const cy = 256
    ctx.beginPath()
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI / 3 * i - Math.PI / 6
      const x = cx + r * Math.cos(angle)
      const y = cy + r * Math.sin(angle)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(img, 0, 0, 512, 512)
  },
  ov: (ctx, img) => {
    ctx.beginPath()
    ctx.ellipse(256, 256, 256, 200, 0, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(img, 0, 0, 512, 512)
  },
  tr: (ctx, img) => {
    ctx.beginPath()
    ctx.moveTo(256, 0)
    ctx.lineTo(512, 512)
    ctx.lineTo(0, 512)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(img, 0, 0, 512, 512)
  },
  rh: (ctx, img) => {
    ctx.beginPath()
    ctx.moveTo(256, 0)
    ctx.lineTo(512, 256)
    ctx.lineTo(256, 512)
    ctx.lineTo(0, 256)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(img, 0, 0, 512, 512)
  }
}

let handler = async (m, { conn, args, command }) => {
  const res = await fetch('https://files.catbox.moe/p87uei.jpg')
  const thumb = Buffer.from(await res.arrayBuffer())
  const fkontak = { key:{fromMe:false,participant:m.sender},message:{imageMessage:{jpegThumbnail:thumb,caption:'✨ STICKER GENERADO ✨'}}}
  const fkontak2 = { key:{fromMe:false,participant:m.sender},message:{imageMessage:{jpegThumbnail:thumb,caption:'⚠ ERROR ⚠'}}}

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
      stiker = fs.readFileSync(tempOut)
      fs.unlinkSync(tempIn)
      fs.unlinkSync(tempOut)
    } else if (/webp|image/.test(mime)) {
      let img = await q.download?.()
      if (!img) return conn.reply(m.chat, `✰ Envía una imagen válida.\nFormas: no, co, cc, cp, di, st, he, ov, tr, rh`, m, rcanal)

      if (/webp/.test(mime)) {
        const tempPng = tmp('png')
        fs.writeFileSync(tempPng, img)
        await new Promise((resolve, reject) => {
          ffmpeg(tempPng).toFormat('png').save(tempPng + '.png').on('end', resolve).on('error', reject)
        })
        img = fs.readFileSync(tempPng + '.png')
        fs.unlinkSync(tempPng)
        fs.unlinkSync(tempPng + '.png')
      }

      const jimg = await loadImage(img)
      const canvas = createCanvas(512, 512)
      const ctx = canvas.getContext()
      (shapes[forma] || shapes.no)(ctx, jimg)

      if (texto) {
        const gradient = ctx.createLinearGradient(0, 0, 512, 512)
        gradient.addColorStop(0, '#00ffff')
        gradient.addColorStop(1, '#ff00ff')
        ctx.fillStyle = gradient
        ctx.font = 'bold 40px Sans-serif'
        ctx.textAlign = 'center'
        ctx.shadowColor = '#00ffff'
        ctx.shadowBlur = 15
        ctx.fillText(texto, 256, 480)
      }

      const buffer = canvas.toBuffer('image/png')
      stiker = await sticker(buffer, false, global.packsticker, global.packsticker2)
    } else {
      return conn.reply(m.chat, `✰ Envía una imagen válida.\nFormas: no, co, cc, cp, di, st, he, ov, tr, rh`, m, fkontak2)
    }
  } catch (e) {
    console.error(e)
    return conn.reply(m.chat, `⚠️ Error al procesar el sticker. ${e.message}`, fkontak2)
  }

  if (stiker) await conn.sendMessage(m.chat, { sticker: stiker, ...global.rcanal }, { quoted: fkontak })
  else conn.reply(m.chat, `✰ Envía una imagen válida.\nFormas: no, co, cc, cp, di, st, he, ov, tr, rh`, m, rcanal)
}

handler.help = ['sticker <texto opcional>', 's <texto opcional>']
handler.tags = ['sticker']
handler.command = ['s', 'sticker', 'stiker']

export default handler
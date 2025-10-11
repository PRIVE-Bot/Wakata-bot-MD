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

const formasValidas = ['co', 'ci', 'sq', 'no', 'rd', 'di', 'tr', 'st', 'he', 'pe', 'el', 're', 'cr', 'ar', 'pl']
let texto = args.filter(a=>!formasValidas.includes(a.toLowerCase())).join(' ').trim()
let forma = (args.find(a=>formasValidas.includes(a.toLowerCase()))||'').toLowerCase()
let stiker = false
let rcanal = global.rcanal || {}

const mensajeUso = `✰ ᴘᴏʀ ғᴀᴠᴏʀ, ʀᴇsᴘᴏɴᴅᴇ ᴏ ᴇɴᴠÍᴀ ᴜɴᴀ **ɪᴍᴀɢᴇɴ, ᴠɪᴅᴇᴏ ᴏ ɢɪғ** ᴘᴀʀᴀ ᴄᴏɴᴠᴇʀᴛɪʀ ᴀ sᴛɪᴄᴋᴇʀ.

*==> 𝙵𝚘𝚛𝚖𝚊𝚜 𝚍𝚎 𝙸𝚖𝚊𝚐𝚎𝚗 (𝙾𝚙𝚌𝚒𝚘𝚗𝚊𝚕):*
- /${command} *ci* => Círculo
- /${command} *co* => Corazón
- /${command} *sq* => Cuadrado (Recortar)
- /${command} *no* => Normalizar (Ajustar)
- /${command} *rd* => Redondeado (Esquinas)
- /${command} *di* => Rombo
- /${command} *tr* => Triángulo
- /${command} *st* => Estrella
- /${command} *he* => Hexágono
- /${command} *pe* => Pentágono
- /${command} *el* => Elipse
- /${command} *re* => Rectángulo Redondeado
- /${command} *cr* => Cruz
- /${command} *ar* => Arco Superior
- /${command} *pl* => Plus (+)

*==> 𝙿𝚞𝚎𝚍𝚎𝚜 𝚊𝚐𝚛𝚎𝚐𝚊𝚛 𝚝𝚎𝚡𝚝𝚘:*
- /${command} [forma] [texto corto]
- 𝙴𝚓: /${command} *co* ¡Hola!
- 𝙴𝚓: /${command} ¡Animado!`

try {
let q = m.quoted ? m.quoted : m
let mime = q.mimetype || q.msg?.mimetype || q.message?.imageMessage?.mimetype || ''
let media

if (!/video|gif|webp|image/.test(mime)) return conn.reply(m.chat, mensajeUso, m, rcanal)

if (/video|gif/.test(mime)) {
if (q.seconds > 10) return conn.reply(m.chat, '⚠️ El video/gif es muy largo. Máximo 10 segundos para animado.', fkontak2)
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

if (!fs.existsSync(tempOut)) throw new Error('No se generó el sticker animado.')
stiker = fs.readFileSync(tempOut)
fs.unlinkSync(tempIn)
fs.unlinkSync(tempOut)
} else if (/webp|image/.test(mime)) {
let img = await q.download?.()
if (!img) return conn.reply(m.chat, `⚠️ No se pudo descargar la imagen/sticker.`, fkontak2)
let jimg = await Jimp.read(img)
let { width, height } = jimg.bitmap
let size = 512

if (forma === 'sq') {
let min = Math.min(width, height)
jimg.crop(Math.floor((width - min) / 2), Math.floor((height - min) / 2), min, min).resize(size, size)
} else if (forma === 'no') {
jimg.contain(size, size)
} else {
jimg.resize(size, size)
}

width = jimg.bitmap.width
height = jimg.bitmap.height

if (formasValidas.includes(forma)) {
const mask = new Jimp(width, height, '#00000000')
mask.scan(0, 0, width, height, function (x, y, idx) {
const dx = x - width / 2
const dy = y - height / 2
const r = Math.sqrt(dx * dx + dy * dy)
const nx = (x - width / 2) / (width / 2)
const ny = (height / 2 - y) / (height / 2)
let pass = false

switch (forma) {
case 'ci': // Círculo
pass = r < width / 2
break
case 'el': // Elipse
const a = width / 2
const b = height / 2
pass = (dx * dx) / (a * a) + (dy * dy) / (b * b) <= 1
break
case 'co': // Corazón
const scaleX = 1.25
const scaleY = 1.35
const offsetY = 0.05
const nxx = (x - width / 2) / (width / 2) * scaleX
const nyy = (height / 2 - y) / (height / 2) * scaleY - offsetY
const eq = Math.pow(nxx * nxx + nyy * nyy - 1, 3) - nxx * nxx * nyy * nyy * nyy
pass = eq <= 0
break
case 'di': // Rombo
pass = Math.abs(nx) + Math.abs(ny) < 1.0
break
case 'tr': // Triángulo (Corregido)
pass = y > height - height * (1 - Math.abs(x - width / 2) / (width / 2))
break
case 'st': // Estrella (Simple 5 Puntas)
const angle = Math.atan2(dy, dx)
const distance = r / (width / 2)
const numPoints = 5
const innerRadius = 0.4
const outerRadius = 1.0
const rot = -Math.PI / 2 
const starAngle = (angle - rot + Math.PI * 2) % (Math.PI * 2)
const sector = Math.floor(starAngle * numPoints / (Math.PI * 2))
const pointAngle = (sector * Math.PI * 2 / numPoints) + rot
const nextPointAngle = ((sector + 1) * Math.PI * 2 / numPoints) + rot
const midAngle = (pointAngle + nextPointAngle) / 2
const radiusAtAngle = innerRadius + (outerRadius - innerRadius) * (1 - Math.cos((starAngle - midAngle) * numPoints)) / 2
pass = distance <= radiusAtAngle
break
case 'he': // Hexágono
const h = Math.abs(dy)
const w = Math.abs(dx)
const a_hex = height / 2 
const b_hex = a_hex * Math.sqrt(3) / 2
pass = h <= a_hex && w <= b_hex && a_hex * w + b_hex * h <= a_hex * b_hex
break
case 'pe': // Pentágono
const sides = 5
const radius_pe = width / 2
const rot_pe = -Math.PI / 2
const a_pe = Math.atan2(dy, dx) + rot_pe
const dist_pe = r
const k = 2 * Math.PI / sides
const angle_pe = Math.min(Math.abs(a_pe % k), Math.abs((a_pe % k) - k))
pass = dist_pe * Math.cos(angle_pe) <= radius_pe * Math.cos(Math.PI / sides)
break
case 're': // Rectángulo Redondeado (2/3 de alto)
const rectWidth = width
const rectHeight = height * 0.66
const rectY = (height - rectHeight) / 2
const rectX = 0
const radius_re = 50
const isInsideRect = x >= rectX && x <= rectX + rectWidth && y >= rectY && y <= rectY + rectHeight

const checkCorner = (cx, cy) => {
if (Math.hypot(x - cx, y - cy) <= radius_re) return true
return false
}

if (isInsideRect) {
if (x < rectX + radius_re && y < rectY + radius_re) pass = checkCorner(rectX + radius_re, rectY + radius_re)
else if (x > rectX + rectWidth - radius_re && y < rectY + radius_re) pass = checkCorner(rectX + rectWidth - radius_re, rectY + radius_re)
else if (x < rectX + radius_re && y > rectY + rectHeight - radius_re) pass = checkCorner(rectX + radius_re, rectY + rectHeight - radius_re)
else if (x > rectX + rectWidth - radius_re && y > rectY + rectHeight - radius_re) pass = checkCorner(rectX + rectWidth - radius_re, rectY + rectHeight - radius_re)
else pass = true
}
break
case 'cr': // Cruz
const barWidth = width * 0.25
pass = (Math.abs(dx) <= barWidth && Math.abs(dy) <= width / 2) || (Math.abs(dy) <= barWidth && Math.abs(dx) <= width / 2)
break
case 'pl': // Plus / Signo Más
const plusWidth = width * 0.2
pass = (Math.abs(dx) <= plusWidth && Math.abs(dy) <= width / 2) || (Math.abs(dy) <= plusWidth && Math.abs(dx) <= width / 2)
break
case 'ar': // Arco Superior (Medio Círculo)
pass = r < width / 2 && dy > 0
break
case 'rd': // Esquinas Redondeadas
const radius = 60
const d = Math.min(radius, width / 2, height / 2)
const x1 = d
const x2 = width - d
const y1 = d
const y2 = height - d

if (x < x1 && y < y1) pass = Math.hypot(x - x1, y - y1) <= d
else if (x > x2 && y < y1) pass = Math.hypot(x - x2, y - y1) <= d
else if (x < x1 && y > y2) pass = Math.hypot(x - x1, y - y2) <= d
else if (x > x2 && y > y2) pass = Math.hypot(x - x2, y - y2) <= d
else if (x >= x1 && x <= x2 && y >= 0 && y <= height) pass = true
else if (y >= y1 && y <= y2 && x >= 0 && x <= width) pass = true
break
default:
pass = true
}

if (pass) {
this.bitmap.data[idx + 0] = 255
this.bitmap.data[idx + 1] = 255
this.bitmap.data[idx + 2] = 255
this.bitmap.data[idx + 3] = 255
}
})
if (forma !== 'no' && forma !== 'sq') jimg.mask(mask, 0, 0)
}

if (texto) {
const brillo = jimg.bitmap.data.reduce((a, _, i) => i % 4 !== 3 ? a + jimg.bitmap.data[i] : a, 0) / (width * height * 3)
const color = brillo > 127 ? '#000000' : '#FFFFFF'
const fuente = await Jimp.loadFont(color === '#000000' ? Jimp.FONT_SANS_64_BLACK : Jimp.FONT_SANS_64_WHITE)
const sombra = await Jimp.loadFont(color === '#000000' ? Jimp.FONT_SANS_64_WHITE : Jimp.FONT_SANS_64_BLACK)
jimg.print(sombra, 3, -3, { text: texto, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM }, width, height - 20)
jimg.print(fuente, 0, 0, { text: texto, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER, alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM }, width, height - 20)
}

img = await jimg.getBufferAsync(Jimp.MIME_PNG)
stiker = await sticker(img, false, global.packsticker, global.packsticker2)
}

if (stiker) await conn.sendMessage(m.chat, { sticker: stiker, ...rcanal }, { quoted: fkontak })
else conn.reply(m.chat, mensajeUso, m, rcanal)
} catch (e) {
console.error(e)
return conn.reply(m.chat, `⚠️ Ocurrió un error al procesar el sticker: ${e.message || 'Desconocido'}`, fkontak2)
}
}

handler.help = ['sticker <texto opcional>', 's <texto opcional>']
handler.tags = ['sticker']
handler.command = ['s', 'sticker', 'stiker']

export default handler

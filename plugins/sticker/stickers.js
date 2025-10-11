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

const formasValidas = ['co', 'cc', 'cp', 'ce', 'ca', 'cr', 'ct']
let texto = args.filter(a=>!formasValidas.includes(a.toLowerCase())).join(' ').trim()
let forma = (args.find(a=>formasValidas.includes(a.toLowerCase()))||'').toLowerCase()
let stiker = false
let rcanal = global.rcanal || {}

const mensajeUso = `✰ ᴘᴏʀ ғᴀᴠᴏʀ, ʀᴇsᴘᴏɴᴅᴇ ᴏ ᴇɴᴠÍᴀ ᴜɴᴀ **ɪᴍᴀɢᴇɴ, ᴠɪᴅᴇᴏ ᴏ ɢɪғ** ᴘᴀʀᴀ ᴄᴏɴᴠᴇʀᴛɪʀ ᴀ sᴛɪᴄᴋᴇʀ.

**==> 𝙵𝚘𝚛𝚖𝚊𝚜 𝚍𝚎 𝙸𝚖𝚊𝚐𝚎𝚗 (𝙾𝚙𝚌𝚒𝚘𝚗𝚊𝚕):**
- /${command} **co** => Corazón
- /${command} **cc** => Círculo
- /${command} **cp** => Normalizar (Ajustar al cuadrado)
- /${command} **ce** => Esquinas Redondeadas
- /${command} **ca** => Cuadrado (Recortar)
- /${command} **cr** => Rombo
- /${command} **ct** => Triángulo

**==> 𝙿𝚞𝚎𝚍𝚎𝚜 𝚊𝚐𝚛𝚎𝚐𝚊𝚛 𝚝𝚎𝚡𝚝𝚘:**
- /${command} [forma] [texto corto]
- 𝙴𝚓: /${command} **co** ¡Hola!
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

if (forma === 'ca') {
let min = Math.min(width, height)
jimg.crop(Math.floor((width - min) / 2), Math.floor((height - min) / 2), min, min).resize(size, size)
} else if (forma === 'cp') {
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
case 'cc': // Círculo
pass = r < width / 2
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
case 'cr': // Rombo
pass = Math.abs(nx) + Math.abs(ny) < 1.0
break
case 'ct': // Triángulo
pass = y > height / 2 - (height / 2) * (1 - 2 * Math.abs(x - width / 2) / width)
break
case 'ce': // Esquinas Redondeadas (solo en Jimp - requiere más lógica de pixel)
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
else if (x >= x1 && x <= x2 && y >= 0 && y <= height) pass = true // Centro
else if (y >= y1 && y <= y2 && x >= 0 && x <= width) pass = true // Centro
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
if (forma !== 'cp') jimg.mask(mask, 0, 0)
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

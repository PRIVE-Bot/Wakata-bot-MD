import { sticker } from '../../lib/sticker.js'
import uploadFile from '../../lib/uploadFile.js'
import uploadImage from '../../lib/uploadImage.js'
import { webp2png } from '../../lib/webp2mp4.js'
import Jimp from 'jimp'

let handler = async (m, { conn, args, command }) => {
  const res = await fetch('https://files.catbox.moe/p87uei.jpg')
  const thumb = Buffer.from(await res.arrayBuffer())
  let user = m.sender

  const fkontak = {
    key: { fromMe: false, participant: user },
    message: {
      imageMessage: {
        jpegThumbnail: thumb,
        caption: '𝗦𝗧𝗜𝗖𝗞𝗘𝗥 𝗚𝗘𝗡𝗘𝗥𝗔𝗗𝗢 𝗖𝗢𝗡 𝗘𝗫𝗜𝗧𝗢 ✨'
      }
    }
  }

  let texto = args.filter(a => !/^(co|cc|cp)$/i.test(a)).join(' ').trim()
  let forma = (args.find(a => /^(co|cc|cp)$/i.test(a)) || '').toLowerCase()
  let stiker = false

  try {
    let q = m.quoted ? m.quoted : m
    let mime = q.mimetype || q.msg?.mimetype || q.message?.imageMessage?.mimetype || ''
    if (/video/.test(mime)) return m.reply('⚠️ No se permiten stickers animados o en movimiento.')
    if (/webp|image/.test(mime)) {
      let img = await q.download?.()
      if (!img) return conn.reply(m.chat, '✰ ᴘᴏʀ ғᴀᴠᴏʀ, ᴇɴᴠÍᴀ ᴜɴᴀ ɪᴍᴀɢᴇɴ ᴘᴀʀᴀ ᴄᴏɴᴠᴇʀᴛɪʀ ᴀ sᴛɪᴄᴋᴇʀ.', m, rcanal)
      let jimg = await Jimp.read(img)
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
            this.bitmap.data[idx + 0] = 255
            this.bitmap.data[idx + 1] = 255
            this.bitmap.data[idx + 2] = 255
            this.bitmap.data[idx + 3] = 255
          }
        })
        jimg.mask(mask, 0, 0)
      }

      if (forma === 'co') {
        const mask = new Jimp(width, height, '#00000000')
        mask.scan(0, 0, width, height, function (x, y, idx) {
          const scaleX = 1.25
          const scaleY = 1.35
          const offsetY = 0.05
          const nx = (x - width / 2) / (width / 2) * scaleX
          const ny = (height / 2 - y) / (height / 2) * scaleY - offsetY
          const eq = Math.pow(nx * nx + ny * ny - 1, 3) - nx * nx * ny * ny * ny
          if (eq <= 0) {
            this.bitmap.data[idx + 0] = 255
            this.bitmap.data[idx + 1] = 255
            this.bitmap.data[idx + 2] = 255
            this.bitmap.data[idx + 3] = 255
          }
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

      img = await jimg.getBufferAsync(Jimp.MIME_PNG)
      stiker = await sticker(img, false, global.packsticker, global.packsticker2)
    }
  } catch (e) {
    console.error(e)
  } finally {
    if (stiker) await conn.sendMessage(m.chat, { sticker: stiker, ...global.rcanal }, { quoted: fkontak })
    else conn.reply(m.chat, `✰ ᴘᴏʀ ғᴀᴠᴏʀ, ᴇɴᴠÍᴀ ᴜɴᴀ ɪᴍᴀɢᴇɴ ᴠÁʟɪᴅᴀ ᴘᴀʀᴀ ᴄᴏɴᴠᴇʀᴛɪʀ ᴀ sᴛɪᴄᴋᴇʀ.

ғᴏʀᴍᴀs:
/${command} => ɴᴏʀᴍᴀʟ
/${command} ᴄᴏ => ᴄᴏʀᴀᴢᴏɴ
/${command} ᴄᴄ => ᴄɪʀᴄᴜʟᴏ
/${command} ᴄᴘ => ɴᴏʀᴍᴀʟɪᴢᴀʀ

==> ᴘᴜᴇᴅᴇs ᴜsᴀʀ /${command} ғᴏʀᴍᴀ ʏ ᴛᴇxᴛᴏ ᴘᴀʀᴀ ᴘᴏɴᴇʀ ᴜɴ ᴛᴇxᴛᴏ ᴄᴏʀᴛᴏ ᴀ ᴛᴜ sᴛɪᴋᴇʀ.`, m, rcanal)
  }
}

handler.help = ['sticker <texto opcional>', 's <texto opcional>']
handler.tags = ['sticker']
handler.command = ['s', 'sticker', 'stiker']

export default handler
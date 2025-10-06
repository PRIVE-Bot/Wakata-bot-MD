import { sticker } from '../../lib/sticker.js'
import uploadFile from '../../lib/uploadFile.js'
import uploadImage from '../../lib/uploadImage.js'
import { webp2png } from '../../lib/webp2mp4.js'
import Jimp from 'jimp'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const res1 = await fetch('https://files.catbox.moe/p87uei.jpg')
  const thumb5 = Buffer.from(await res1.arrayBuffer())
  let userjid = m.sender

  const fkontak = {
    key: { fromMe: false, participant: userjid },
    message: {
      imageMessage: {
        jpegThumbnail: thumb5,
        caption: '𝗦𝗧𝗜𝗖𝗞𝗘𝗥 𝗚𝗘𝗡𝗘𝗥𝗔𝗗𝗢 𝗖𝗢𝗡 𝗘𝗫𝗜𝗧𝗢 ✨',
      }
    }
  }

  let textoSticker = args.join(' ').trim()
  let stiker = false

  try {
    let q = m.quoted ? m.quoted : m
    let mime =
      q.mimetype ||
      q.msg?.mimetype ||
      q.message?.imageMessage?.mimetype ||
      q.message?.videoMessage?.mimetype ||
      q.message?.stickerMessage?.mimetype ||
      ''

    if (/webp|image|video/.test(mime)) {
      if (/video/.test(mime) && (q.msg || q).seconds > 15) {
        return m.reply(`⚠️ El video no puede durar más de 15 segundos.`)
      }

      let img = await q.download?.()
      if (!img)
        return conn.reply(
          m.chat,
          `✰✰ ᴘᴏʀ ғᴀᴠᴏʀ, ᴇɴᴠÍᴀ ᴜɴ ᴠɪᴅᴇᴏ, ɢɪғ ᴏ ɪᴍᴀɢᴇɴ ᴘᴀʀᴀ ᴄᴏɴᴠᴇʀᴛɪʀ ᴀ sᴛɪᴄᴋᴇʀ.`,
          m,
          rcanal
        )

      if (textoSticker) {
        const jimg = await Jimp.read(img)
        const { width, height } = jimg.bitmap

        let brilloPromedio = 0
        jimg.scan(0, 0, width, height, function (x, y, idx) {
          const r = this.bitmap.data[idx + 0]
          const g = this.bitmap.data[idx + 1]
          const b = this.bitmap.data[idx + 2]
          brilloPromedio += (r + g + b) / 3
        })
        brilloPromedio /= width * height

        const colorTexto = brilloPromedio > 127 ? '#000000' : '#FFFFFF'

        const fuente = await Jimp.loadFont(
          colorTexto === '#000000'
            ? Jimp.FONT_SANS_64_BLACK
            : Jimp.FONT_SANS_64_WHITE
        )

        const sombraColor = colorTexto === '#000000' ? '#FFFFFF' : '#000000'
        const sombra = await Jimp.loadFont(
          sombraColor === '#000000'
            ? Jimp.FONT_SANS_64_BLACK
            : Jimp.FONT_SANS_64_WHITE
        )

        jimg.print(
          sombra,
          3,
          -3,
          {
            text: textoSticker,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM
          },
          width,
          height - 20
        )

        jimg.print(
          fuente,
          0,
          0,
          {
            text: textoSticker,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM
          },
          width,
          height - 20
        )

        img = await jimg.getBufferAsync(Jimp.MIME_PNG)
      }

      let out
      try {
        stiker = await sticker(img, false, global.packsticker, global.packsticker2)
      } catch (e) {
        console.error(e)
      } finally {
        if (!stiker) {
          if (/webp/.test(mime)) out = await webp2png(img)
          else if (/image/.test(mime)) out = await uploadImage(img)
          else if (/video/.test(mime)) out = await uploadFile(img)
          if (typeof out !== 'string') out = await uploadImage(img)
          stiker = await sticker(false, out, global.packsticker, global.packsticker2)
        }
      }
    } else if (args[0]) {
      if (isUrl(args[0])) {
        stiker = await sticker(false, args[0], global.packsticker, global.packsticker2)
      } else {
        return m.reply(`❌ La URL es incorrecta.`)
      }
    }
  } catch (e) {
    console.error(e)
    if (!stiker) stiker = e
  } finally {
    if (stiker) {
      await conn.sendMessage(m.chat, { sticker: stiker, ...global.rcanal }, { quoted: fkontak })
    } else {
      return conn.reply(
        m.chat,
        `✰ ᴘᴏʀ ғᴀᴠᴏʀ, ᴇɴᴠÍᴀ ᴜɴ ᴠɪᴅᴇᴏ, ɢɪғ ᴏ ɪᴍᴀɢᴇɴ ᴘᴀʀᴀ ᴄᴏɴᴠᴇʀᴛɪʀ ᴀ sᴛɪᴄᴋᴇʀ.`,
        m,
        fake
      )
    }
  }
}

handler.help = ['sticker <texto opcional>', 's <texto opcional>', 'stiker <texto opcional>']
handler.tags = ['sticker']
handler.command = ['s', 'sticker', 'stiker']

export default handler

const isUrl = (text) => {
  return text.match(
    new RegExp(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/,
      'gi'
    )
  )
}
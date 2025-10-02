import { sticker } from '../../lib/sticker.js'
import uploadFile from '../../lib/uploadFile.js'
import uploadImage from '../../lib/uploadImage.js'
import { webp2png } from '../../lib/webp2mp4.js'

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

  let stiker = false
  try {
    let q = m.quoted ? m.quoted : m

    let mime = q.mimetype || q.msg?.mimetype || 
               q.message?.imageMessage?.mimetype ||
               q.message?.videoMessage?.mimetype ||
               q.message?.stickerMessage?.mimetype || ''

    if (/webp|image|video/.test(mime)) {
      if (/video/.test(mime) && (q.msg || q).seconds > 15) {
        return m.reply(`⚠️ El video no puede durar más de 15 segundos.`)
      }

      let img = await q.download?.()
      if (!img) return conn.reply(m.chat, `✰✰ ᴘᴏʀ ғᴀᴠᴏʀ, ᴇɴᴠÍᴀ ᴜɴ ᴠɪᴅᴇᴏ, ɢɪғ ᴏ ɪᴍᴀɢᴇɴ ᴘᴀʀᴀ ᴄᴏɴᴠᴇʀᴛɪʀ ᴀ sᴛɪᴄᴋᴇʀ.`, m, rcanal)

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
      await conn.sendFile(m.chat, stiker, 'sticker.webp', '', fkontak, rcanal)
    } else {
      return conn.reply(m.chat, `✰ ᴘᴏʀ ғᴀᴠᴏʀ, ᴇɴᴠÍᴀ ᴜɴ ᴠɪᴅᴇᴏ, ɢɪғ ᴏ ɪᴍᴀɢᴇɴ ᴘᴀʀᴀ ᴄᴏɴᴠᴇʀᴛɪʀ ᴀ sᴛɪᴄᴋᴇʀ.`, m, fake)
    }
  }
}

handler.help = ['sticker', 's', 'stiker']
handler.tags = ['sticker']
handler.command = ['s', 'sticker', 'stiker']

export default handler

const isUrl = (text) => {
  return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'))
}
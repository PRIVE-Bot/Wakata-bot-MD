import { sticker } from '../../lib/sticker.js'
import uploadFile from '../../lib/uploadFile.js'
import uploadImage from '../../lib/uploadImage.js'
import { webp2png } from '../../lib/webp2mp4.js'

let handler = async (m, { conn, args }) => {
  
  const res1 = await fetch('https://files.catbox.moe/p87uei.jpg')
  const thumb5 = Buffer.from(await res1.arrayBuffer())

  
  const fkontak = {
    key: { participant: "0@s.whatsapp.net" },
    message: {
      contactMessage: {
        displayName: '𝗦𝗧𝗜𝗖𝗞𝗘𝗥 𝗚𝗘𝗡𝗘𝗥𝗔𝗗𝗢',
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;Sticker;;;\nFN:Sticker Generado\nitem1.TEL;waid=0:0\nEND:VCARD`,
        jpegThumbnail: thumb5
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
      if (!img) return conn.reply(m.chat, `✰✰ ᴘᴏʀ ғᴀᴠᴏʀ, ᴇɴᴠíᴀ ᴜɴ ᴠɪᴅᴇᴏ, ɢɪғ ᴏ ɪᴍᴀɢᴇɴ ᴘᴀʀᴀ ᴄᴏɴᴠᴇʀᴛɪʀ ᴀ sᴛɪᴄᴋᴇʀ.`, m)

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
      await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: fkontak })
    } else {
      return conn.reply(m.chat, `✰ ᴘᴏʀ ғᴀᴠᴏʀ, ᴇɴᴠíᴀ ᴜɴ ᴠɪᴅᴇᴏ, ɢɪғ ᴏ ɪᴍᴀɢᴇɴ ᴘᴀʀᴀ ᴄᴏɴᴠᴇʀᴛɪʀ ᴀ sᴛɪᴄᴋᴇʀ.`, m)
    }
  }
}

handler.help = ['sticker2', 's2']
handler.tags = ['sticker']
handler.command = ['s2', 'sticker2', 'stiker2']

export default handler


const isUrl = (text) => {
  return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'))
}
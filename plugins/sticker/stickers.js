import { sticker } from '../../lib/sticker.js'
import uploadFile from '../../lib/uploadFile.js'
import uploadImage from '../../lib/uploadImage.js'
import { webp2png } from '../../lib/webp2mp4.js'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const res1 = await fetch('https://files.catbox.moe/p87uei.jpg')
  const thumb5 = Buffer.from(await res1.arrayBuffer())

  const fkontak = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
      documentMessage: {
        title: '𝗦𝗧𝗜𝗞𝗘𝗥',
        fileName: `𝗦𝗧𝗜𝗞𝗘𝗥 𝗚𝗘𝗡𝗘𝗥𝗔𝗗𝗢 𝗖𝗢𝗡 𝗘𝗫𝗜𝗧𝗢`,
        jpegThumbnail: thumb5
      }
    }
  }

let stiker = false
try {
let q = m.quoted ? m.quoted : m
let mime = (q.msg || q).mimetype || q.mediaType || ''
if (/webp|image|video/g.test(mime)) {
if (/video/g.test(mime)) if ((q.msg || q).seconds > 15) return m.reply(`${emoji} ᴇʟ ᴠɪᴅᴇᴏ ɴᴏ ᴘᴜᴇᴅᴇ ᴅᴜʀᴀʀ ᴍᴀs ᴅᴇ (10) sᴇɢᴜɴᴅᴏs.`)
let img = await q.download?.()

if (!img) return conn.reply(m.chat, `${emoji} ᴘᴏʀ ғᴀᴠᴏʀ, ᴇɴᴠÍᴀ ᴜɴ ᴠɪᴅᴇᴏ, ɢɪғ ᴏ ɪᴍᴀɢᴇɴ ᴘᴀʀᴀ ᴄᴏɴᴠᴇʀᴛɪʀ ᴀ sᴛɪᴄᴋᴇʀ.`, m, fake)

let out
try {
stiker = await sticker(img, false, global.packsticker, global.packsticker2)
} catch (e) {
console.error(e)
} finally {
if (!stiker) {
if (/webp/g.test(mime)) out = await webp2png(img)
else if (/image/g.test(mime)) out = await uploadImage(img)
else if (/video/g.test(mime)) out = await uploadFile(img)
if (typeof out !== 'string') out = await uploadImage(img)
stiker = await sticker(false, out, global.packsticker, global.packsticker2)
}}
} else if (args[0]) {
if (isUrl(args[0])) stiker = await sticker(false, args[0], global.packsticker, global.packsticker2)

else return m.reply(`${emoji2} El url es incorrecto...`)

}
} catch (e) {
console.error(e)
if (!stiker) stiker = e
} finally {
if (stiker) conn.sendFile(m.chat, stiker, 'sticker.webp', '', fkontak, true)

else return conn.reply(m.chat, `${emoji} ᴘᴏʀ ғᴀᴠᴏʀ, ᴇɴᴠÍᴀ ᴜɴ ᴠɪᴅᴇᴏ, ɢɪғ ᴏ ɪᴍᴀɢᴇɴ ᴘᴀʀᴀ ᴄᴏɴᴠᴇʀᴛɪʀ ᴀ sᴛɪᴄᴋᴇʀ.`, m, fake)

}}
handler.help = ['stiker <img>', 'sticker <url>']
handler.tags = ['sticker']
//handler.group = true;
handler.register = true
handler.command = ['s', 'sticker', 'stiker']

export default handler

const isUrl = (text) => {
return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'))}

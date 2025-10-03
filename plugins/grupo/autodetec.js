import WAMessageStubType from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

const makeFkontak = (img, title, botname) => ({
  key: { fromMe: false, participant: "0@s.whatsapp.net" },
  message: {
    productMessage: {
      product: {
        productImage: { jpegThumbnail: img },
        title: title,
        description: botname,
        currencyCode: "USD",
        priceAmount1000: "5000",
        retailerId: "BOT"
      },
      businessOwnerJid: "0@s.whatsapp.net"
    }
  }
})

export async function before(m, { conn, participants, groupMetadata }) {
  let botSettings = global.db.data.settings[conn.user.jid] || {}
  if (botSettings.soloParaJid) return
  if (!m.messageStubType || !m.isGroup) return

  const botname = "Mejor Bot"

  const thumb2 = Buffer.from(await (await fetch('https://i.postimg.cc/y8yzWzjW/1756498087639.jpg')).arrayBuffer())
  const thumb3 = Buffer.from(await (await fetch('https://i.postimg.cc/y8yzWzjW/1756498087639.jpg')).arrayBuffer())
  const thumb4 = Buffer.from(await (await fetch('https://i.postimg.cc/y8yzWzjW/1756498087639.jpg')).arrayBuffer())
  const thumb5 = Buffer.from(await (await fetch('https://i.postimg.cc/y8yzWzjW/1756498087639.jpg')).arrayBuffer())
  const thumb6 = Buffer.from(await (await fetch('https://i.postimg.cc/y8yzWzjW/1756498087639.jpg')).arrayBuffer())
  const thumb7 = Buffer.from(await (await fetch('https://i.postimg.cc/y8yzWzjW/1756498087639.jpg')).arrayBuffer())
  const thumb8 = Buffer.from(await (await fetch('https://i.postimg.cc/y8yzWzjW/1756498087639.jpg')).arrayBuffer())

  const fkontak  = makeFkontak(thumb2, `𝗘𝗡𝗟𝗔𝗖𝗘 𝗔𝗖𝗧𝗨𝗔𝗟𝗜𝗭𝗔𝗗𝗢`, botname)
  const fkontak2 = makeFkontak(thumb3, `𝗜𝗠𝗔𝗚𝗘𝗡 𝗔𝗖𝗧𝗨𝗔𝗟𝗜𝗭𝗔𝗗𝗔`, botname)
  const fkontak3 = makeFkontak(thumb4, `𝗡𝗢𝗠𝗕𝗥𝗘 𝗔𝗖𝗧𝗨𝗔𝗟𝗜𝗭𝗔𝗗𝗢`, botname)
  const fkontak4 = makeFkontak(thumb5, `𝗘𝗗𝗜𝗧 𝗔𝗖𝗧𝗨𝗔𝗟𝗜𝗭𝗔𝗗𝗢`, botname)
  const fkontak5 = makeFkontak(thumb6, `𝗘𝗦𝗧𝗔𝗗𝗢 𝗗𝗘𝗟 𝗚𝗥𝗨𝗣𝗢`, botname)
  const fkontak6 = makeFkontak(thumb7, `𝗡𝗨𝗘𝗩𝗢 𝗔𝗗𝗠𝗜𝗡`, botname)
  const fkontak7 = makeFkontak(thumb8, `𝗨𝗡 𝗔𝗗𝗠𝗜𝗡 𝗠𝗘𝗡𝗢𝗦`, botname)

  let chat = global.db.data.chats[m.chat]
  let usuario = `@${m.sender.split`@`[0]}`
  let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://files.catbox.moe/xr2m6u.jpg'

  let nombre   = `📛 El nombre del grupo fue cambiado a: *${m.messageStubParameters[0]}*\n👤 Por: ${usuario}`
  let foto     = `🖼️ La foto del grupo ha sido actualizada.\n👤 Por: ${usuario}`
  let edit     = `🔧 La configuración del grupo ha sido modificada.\n👤 Por: ${usuario}\n📋 Permisos: ${m.messageStubParameters[0] == 'on' ? 'Solo administradores' : 'Todos los miembros'}`
  let newlink  = `🔗 El enlace del grupo ha sido restablecido.\n👤 Por: ${usuario}`
  let status   = `🔒 El grupo ahora está ${m.messageStubParameters[0] == 'on' ? '*cerrado*' : '*abierto*'}.\n👤 Por: ${usuario}`
  let admingp  = `🆙 *@${m.messageStubParameters[0].split`@`[0]}* ha sido ascendido a administrador.\n👤 Acción realizada por: ${usuario}`
  let noadmingp= `⬇️ *@${m.messageStubParameters[0].split`@`[0]}* ha sido removido como administrador.\n👤 Acción realizada por: ${usuario}`

  if (chat.detect && m.messageStubType == 21) {
    await conn.sendMessage(m.chat, { text: nombre, mentions: [m.sender] }, { quoted: fkontak3 })
  } else if (chat.detect && m.messageStubType == 22) {
    await conn.sendMessage(m.chat, { image: { url: pp }, caption: foto, mentions: [m.sender] }, { quoted: fkontak2 })
  } else if (chat.detect && m.messageStubType == 23) {
    await conn.sendMessage(m.chat, { text: newlink, mentions: [m.sender] }, { quoted: fkontak })
  } else if (chat.detect && m.messageStubType == 25) {
    await conn.sendMessage(m.chat, { text: edit, mentions: [m.sender] }, { quoted: fkontak4 })
  } else if (chat.detect && m.messageStubType == 26) {
    await conn.sendMessage(m.chat, { text: status, mentions: [m.sender] }, { quoted: fkontak5 })
  } else if (chat.detect && m.messageStubType == 29) {
    await conn.sendMessage(m.chat, { text: admingp, mentions: [`${m.sender}`, `${m.messageStubParameters[0]}`] }, { quoted: fkontak6 })
  } else if (chat.detect && m.messageStubType == 30) {
    await conn.sendMessage(m.chat, { text: noadmingp, mentions: [`${m.sender}`, `${m.messageStubParameters[0]}`] }, { quoted: fkontak7 })
  }
}
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
  const urlapi = 'https://i.postimg.cc/y8yzWzjW/1756498087639.jpg'
  const thumb = Buffer.from(await (await fetch(urlapi)).arrayBuffer())
  const fkontak = makeFkontak(thumb, `𝗔𝗖𝗖𝗜𝗢́𝗡 𝗘𝗡 𝗘𝗟 𝗚𝗥𝗨𝗣𝗢`, botname)
  let chat = global.db.data.chats[m.chat]
  let usuario = `@${m.sender.split`@`[0]}`
  let id = m.sender
  let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || urlapi
  let tipo, mensaje
  if (m.messageStubType == 21) tipo = 'Nombre actualizado', mensaje = `📛 El nombre del grupo fue cambiado a: *${m.messageStubParameters[0]}*\n👤 Por: ${usuario}`
  else if (m.messageStubType == 22) tipo = 'Imagen actualizada', mensaje = `🖼️ La foto del grupo ha sido actualizada.\n👤 Por: ${usuario}`
  else if (m.messageStubType == 23) tipo = 'Enlace actualizado', mensaje = `🔗 El enlace del grupo ha sido restablecido.\n👤 Por: ${usuario}`
  else if (m.messageStubType == 25) tipo = 'Configuración editada', mensaje = `🔧 La configuración del grupo ha sido modificada.\n👤 Por: ${usuario}\n📋 Permisos: ${m.messageStubParameters[0] == 'on' ? 'Solo administradores' : 'Todos los miembros'}`
  else if (m.messageStubType == 26) tipo = 'Estado del grupo', mensaje = `🔒 El grupo ahora está ${m.messageStubParameters[0] == 'on' ? '*cerrado*' : '*abierto*'}.\n👤 Por: ${usuario}`
  else if (m.messageStubType == 29) tipo = 'Nuevo admin', mensaje = `🆙 *@${m.messageStubParameters[0].split`@`[0]}* ha sido ascendido a administrador.\n👤 Acción realizada por: ${usuario}`
  else if (m.messageStubType == 30) tipo = 'Admin removido', mensaje = `⬇️ *@${m.messageStubParameters[0].split`@`[0]}* ha sido removido como administrador.\n👤 Acción realizada por: ${usuario}`
  else return
  if (!chat.detect) return
  const taguser = usuario
  const groupSubject = groupMetadata.subject
  const totalMembers = participants.length
  const date = new Date().toLocaleString('es-ES', { timeZone: 'America/Mexico_City' })
  const productMessage = {
    product: {
      productImage: { url: urlapi },
      productId: '2452968910',
      title: `${tipo}, ahora somos ${totalMembers}`,
      description: '',
      currencyCode: 'USD',
      priceAmount1000: '0',
      retailerId: 1677,
      url: `https://deylin.xyz/#sitio_web_del_creador`,
      productImageCount: 1
    },
    businessOwnerJid: id,
    caption: `${mensaje}`.trim(),
    title: 'Acción de grupo',
    footer: `${mensaje}`,
    mentions: [m.sender, ...(m.messageStubParameters || [])]
  }
  await conn.sendMessage(m.chat, productMessage, { quoted: fkontak, contextInfo: { mentionedJid: [m.sender, ...(m.messageStubParameters || [])] } })
}
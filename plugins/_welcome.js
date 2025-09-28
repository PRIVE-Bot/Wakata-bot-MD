import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  let botSettings = global.db.data.settings[conn.user.jid] || {}
  if (botSettings.soloParaJid) return
  if (!m.messageStubType || !m.isGroup) return true

  const totalMembers = participants.length
  const date = new Date().toLocaleString('es-ES', { timeZone: 'America/Mexico_City' })
  const who = m.messageStubParameters[0]
  const taguser = `@${who.split('@')[0]}`
  const chat = global.db.data.chats[m.chat]
  const botname = global.botname || "Bot"

  if (!chat.welcome) return

  let userName = m.pushName || 'Anónimo'
  let tipo = ''
  let tipo1 = ''
  let tipo2 = ''

  if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    tipo = 'Bienvenido'
    tipo1 = userName
    tipo2 = global.img
  }

  if (
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE ||
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE
  ) {
    tipo = 'Adiós'
    tipo1 = userName
    tipo2 = global.img
  }

  if (!tipo) return

  let avatar = await conn.profilePictureUrl(who).catch(() => tipo2)
  let urlapi = `https://canvas-8zhi.onrender.com/api/welcome2?title=${encodeURIComponent(tipo)}&desc=${encodeURIComponent(tipo1)}&profile=${encodeURIComponent(avatar)}&background=${encodeURIComponent(tipo2)}`

  let fkontak
  try {
    const res2 = await fetch('https://i.postimg.cc/c4t9wwCw/1756162596829.jpg')
    const img3 = Buffer.from(await res2.arrayBuffer())

    fkontak = {
      key: { fromMe: false, participant: "0@s.whatsapp.net" },
      message: {
        productMessage: {
          product: {
            productImage: { jpegThumbnail: img3 },
            title: `${tipo} ${tipo1}`,
            description: `${botname} da la bienvenida a ${userName}`,
            currencyCode: "USD",
            priceAmount1000: 5000,
            retailerId: "BOT"
          },
          businessOwnerJid: "0@s.whatsapp.net"
        }
      }
    }
  } catch (e) {
    console.error("Error al generar fkontak:", e)
  }

  const productMessage = {
    product: {
      productImage: { url: urlapi },
      title: `${tipo}, ahora somos ${totalMembers}`,
      description: `
✎ Usuario: ${taguser}
✎ Nombre: ${userName}
✎ Grupo: ${groupMetadata.subject}
✎ Miembros: ${totalMembers}
✎ Fecha: ${date}
      `,
      currencyCode: "USD",
      priceAmount1000: 5000,
      retailerId: "1677",
      productId: "24526030470358430",
      productImageCount: 1,
    },
    businessOwnerJid: "50432955554@s.whatsapp.net"
  }

  await conn.sendMessage(m.chat, productMessage, {
    quoted: fkontak,
    contextInfo: { mentionedJid: [who] }
  })
}
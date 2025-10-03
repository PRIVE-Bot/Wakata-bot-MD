import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  let botSettings = global.db.data.settings[conn.user.jid] || {}
  if (botSettings.soloParaJid) return
  if (!m.messageStubType || !m.isGroup) return true

  const totalMembers = participants.length
  const date = new Date().toLocaleString('es-ES', { timeZone: 'America/Mexico_City' })
  const who = m.messageStubParameters?.[0]
  if (!who) return

  const user = participants.find(p => p.jid === who)
  const userName = user?.notify || ''
  const taguser = `@${who.split('@')[0]}`
  const chat = global.db.data.chats[m.chat]
  if (!chat?.welcome) return

  let tipo = ''
  if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) tipo = 'Bienvenido'
  if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE || m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE) tipo = 'Adiós'
  if (!tipo) return

  const tipo2 = global.img || ''

  let avatar
  try {
    avatar = await conn.profilePictureUrl(who, 'image')
  } catch {
    avatar = tipo2
  }

  const urlapi = `https://canvas-8zhi.onrender.com/api/welcome3?title=${encodeURIComponent(tipo)}&desc=${encodeURIComponent(userName)}&profile=${encodeURIComponent(avatar)}&background=${encodeURIComponent(tipo2)}`

  let fkontak
  try {
    const res2 = await fetch('https://i.postimg.cc/c4t9wwCw/1756162596829.jpg')
    const img3 = Buffer.from(await res2.arrayBuffer())
    fkontak = {
      key: { fromMe: false, participant: "0@s.whatsapp.net" },
      message: { locationMessage: { name: `${tipo} ${userName}`, jpegThumbnail: img3 } }
    }
  } catch (e) {
    console.error(e)
  }

  // 📌 Definimos valores que faltaban
  const groupSubject = groupMetadata.subject
  const jid = m.chat
  const number = who.split('@')[0]

  const productMessage = {
    product: {
      productImage: { url: urlapi },
      productId: '2452968910',
      title: `${tipo}, ahora somos ${totalMembers}`,
      description: '',
      currencyCode: 'USD',
      priceAmount1000: '0',
      retailerId: 1677,
      url: `https://wa.me/${number}`,
      productImageCount: 1
    },
    businessOwnerJid: who || '0@s.whatsapp.net',
    caption: `👤𝙐𝙨𝙚𝙧: ${taguser}\n📚𝙂𝙧𝙪𝙥𝙤: ${groupSubject}\n👥𝙈𝙞𝙚𝙢𝙗𝙧𝙤: ${totalMembers}\n📆 𝙁𝙚𝙘𝙝𝙖: ${date}`.trim(),
    title: '',
    subtitle: '',
    footer: groupSubject || '',
    interactiveButtons: [
      {
        name: 'quick_reply',
        buttonParamsJson: JSON.stringify({
          display_text: '🌟 ʀᴇɢɪsᴛʀᴀʀᴍᴇ ᴀ ɪᴛsᴜᴋɪ-ɪᴀ 🌟',
          id: '.reg'
        })
      }
    ],
    mentions: who ? [who] : []
  }

  const mentionId = who ? [who] : []
  await conn.sendMessage(jid, productMessage, {
    quoted: fkontak || undefined,
    contextInfo: { mentionedJid: mentionId }
  })
}
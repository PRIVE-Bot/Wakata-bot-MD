import { WAMessageStubType, generateWAMessageFromContent } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  let botSettings = global.db.data.settings[conn.user.jid] || {}
  if (botSettings.soloParaJid) return
  if (!m.messageStubType || !m.isGroup) return true

  const totalMembers = participants.length
  const date = new Date().toLocaleString('es-ES', { timeZone: 'America/Mexico_City' })
  const who = m.messageStubParameters?.[0]
  if (!who) return

  const taguser = `@${who.split('@')[0]}`
  const chat = global.db.data.chats[m.chat]
  if (!chat?.welcome) return

  let userName = await conn.getName(who) || 'Anónimo'

  let tipo = ''
  if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) tipo = 'Bienvenido'
  if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE || m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE) tipo = 'Adiós'
  if (!tipo) return

  const tipo2 = global.img || ''

  let avatar
  try {
    avatar = await conn.profilePictureUrl(who)
  } catch {
    avatar = tipo2
  }

  const urlapi = `https://canvas-8zhi.onrender.com/api/welcome2?title=${encodeURIComponent(tipo)}&desc=${encodeURIComponent(userName)}&profile=${encodeURIComponent(avatar)}&background=${encodeURIComponent(tipo2)}`

  let fkontak
  try {
    const res2 = await fetch('https://i.postimg.cc/c4t9wwCw/1756162596829.jpg')
    const img3 = Buffer.from(await res2.arrayBuffer())
    fkontak = {
      key: { fromMe: false, participant: "0@s.whatsapp.net" },
      message: { locationMessage: { name: `Grupo: ${groupMetadata.subject}`, jpegThumbnail: img3 } }
    }
  } catch (e) {
    console.error(e)
  }

  const texto = `
✎ Usuario: ${taguser}
✎ Nombre: ${userName}
✎ Grupo: ${groupMetadata.subject}
✎ Miembros: ${totalMembers}
✎ Fecha: ${date}
  `

  const content = {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          body: { text: texto },
          footer: { text: global.botname },
          header: { title: tipo, hasMediaAttachment: true },
          nativeFlowMessage: {
            buttons: [
              {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                  display_text: "📢 Ver Canal Oficial",
                  url: "https://whatsapp.com/channel/0029VbAzn9GGU3BQw830eA0F",
                  merchant_url: "https://wa.me"
                })
              },
              {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                  display_text: "🌟 Unirse al Grupo",
                  url: "https://goo.su/iaZ6fO",
                  merchant_url: "https://wa.me"
                })
              }
            ]
          }
        }
      }
    }
  }

  const msg = generateWAMessageFromContent(m.chat, content, { quoted: fkontak, mentions: [who] })
  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}
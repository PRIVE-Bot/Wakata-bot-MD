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

  const taguser = `@${who.split('@')[0]}`
  const chat = global.db.data.chats[m.chat]
  if (!chat?.welcome) return

  // Obtener nombre confiable
  let userName = 'Anónimo'
  try {
    const addedParticipant = participants.find(p => p.jid === who)
    if (addedParticipant?.name) {
      userName = addedParticipant.name
    } else {
      const contact = await conn.getContact(who).catch(() => null)
      userName = contact?.notify || contact?.name || 'Anónimo'
    }
  } catch (e) {
    userName = 'Anónimo'
  }

  // Tipo de mensaje
  let tipo = ''
  if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) tipo = 'Bienvenido'
  if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE || m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE) tipo = 'Adiós'
  if (!tipo) return

  const tipo2 = global.img || ''

  // Avatar del usuario
  let avatar
  try {
    avatar = await conn.profilePictureUrl(who)
  } catch {
    avatar = tipo2
  }

  const urlapi = `https://canvas-8zhi.onrender.com/api/welcome2?title=${encodeURIComponent(tipo)}&desc=${encodeURIComponent(userName)}&profile=${encodeURIComponent(avatar)}&background=${encodeURIComponent(tipo2)}`

  // Mensaje citado con miniatura
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

  const texto = `
✎ Usuario: ${taguser}
✎ Grupo: ${groupMetadata.subject}
✎ Miembros: ${totalMembers}
✎ Fecha: ${date}
  `

  await conn.sendMessage(
    m.chat,
    { image: { url: urlapi }, caption: texto, mentions: [who] },
    { quoted: fkontak }
  )
}
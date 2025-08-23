import { randomBytes } from 'crypto'

const handler = async (m, { conn, command, usedPrefix, text }) => {
  if (!text) return conn.reply(m.chat, '⚠️ Te faltó el texto que quieres transmitir a todos los chats.', m, fake)

  
  await conn.reply(m.chat, '*✅ El texto se está enviando a todos los chats...*', m, fake)

  const start2 = new Date().getTime()

  const groups = Object.values(await conn.groupFetchAllParticipating())
  const chatsPrivados = Object.keys(global.db.data.users).filter((u) => u.endsWith('@s.whatsapp.net'))

  let totalPrivados = 0

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i]
    const metadata = await conn.groupMetadata(group.id) // obtener info de cada grupo
    const participantes = metadata.participants.map((u) => u.id) 
    const delay = i * 4000 

    setTimeout(async () => {
      try {
        await conn.sendMessage(group.id, {
          text,
          mentions: participantes
        }, { quoted: m })
      } catch (e) {
        console.error(`❌ Error al enviar en grupo ${group.subject}:`, e)
      }
    }, delay)
  }

  for (const user of chatsPrivados) {
    await new Promise((resolve) => setTimeout(resolve, 2000)) 
    try {
      await conn.sendMessage(user, { text }, { quoted: m })
      totalPrivados++
      if (totalPrivados >= 500000) break
    } catch (e) {
      console.error(`❌ Error al enviar a ${user}:`, e)
    }
  }

  const end2 = new Date().getTime()
  const totalGrupos = groups.length
  const totalPriv = chatsPrivados.length
  const total = totalGrupos + totalPriv

  let time2 = Math.floor((end2 - start2) / 1000)
  if (time2 >= 60) {
    const minutes = Math.floor(time2 / 60)
    const seconds = time2 % 60
    time2 = `${minutes} minutos y ${seconds} segundos`
  } else {
    time2 = `${time2} segundos`
  }

  await m.reply(`⭐️ *Broadcast finalizado*\n\n🔥 Chats Privados: ${totalPriv}\n👑 Grupos: ${totalGrupos}\n⚡ Total: ${total}\n\n⏱️ Tiempo total: ${time2}`)
}

handler.help = ['broadcast', 'bc']
handler.tags = ['owner']
handler.command = ['bc', 'comunicado']
handler.owner = true

export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const randomID = (length) => randomBytes(Math.ceil(length * 0.5)).toString('hex').slice(0, length)
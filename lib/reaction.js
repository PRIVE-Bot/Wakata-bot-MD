import fs from 'fs'
import path from 'path'

const messageReactions = {}
const filePath = path.join('./database/reacciones')

if (!fs.existsSync(filePath)) {
  fs.mkdirSync(filePath, { recursive: true })
}

export const createMessageWithReactions = async (conn, m, template, actions) => {
  const id = new Date().getTime().toString()

  const msg = await conn.sendMessage(m.chat, { text: template }, { quoted: m })

  messageReactions[msg.key.id] = {
    chat: m.chat,
    id,
    actions
  }

  const dataPath = path.join(filePath, `${id}.json`)
  fs.writeFileSync(dataPath, JSON.stringify(messageReactions[msg.key.id], null, 2))
}

export const handleReaction = async (reaction, sender, conn) => {
  const key = reaction.key
  const emoji = reaction.text

  let data = messageReactions[key.id]
  if (!data) {
    const files = fs.readdirSync(filePath)
    const file = files.find(f => JSON.parse(fs.readFileSync(path.join(filePath, f), 'utf-8')).chat === key.remoteJid && JSON.parse(fs.readFileSync(path.join(filePath, f), 'utf-8')).id === key.id)
    if (file) {
      data = JSON.parse(fs.readFileSync(path.join(filePath, file), 'utf-8'))
    }
    if (!data) return
  }

  const action = data.actions[emoji]
  if (!action) return

  try {
    const chat = data.chat || key.remoteJid
    if (action.command) {
      await conn.sendMessage(chat, { text: `Se ejecutó el comando para el emoji ${emoji}. Acción: ${action.command}` })
    }
  } catch (error) {
    console.error(`Error al ejecutar la acción del emoji: ${error}`)
  }
}

global.conn.ev.on('messages.upsert', async ({ messages }) => {
  const m = messages[0]
  if (!m?.message?.reactionMessage) return

  const reaction = m.message.reactionMessage
  const sender = m.key.participant || m.key.remoteJid

  handleReaction(reaction, sender, global.conn)
})

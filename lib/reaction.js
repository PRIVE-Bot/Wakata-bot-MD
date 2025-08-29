/*import fs from 'fs'
import path from 'path'

const filePath = path.join('./database/reacciones')

if (!fs.existsSync(filePath)) {
  fs.mkdirSync(filePath, { recursive: true })
}

export const createMessageWithReactions = async (conn, msg, actions) => {
  const id = msg.key.id

  const serializableActions = {}
  for (const emoji in actions) {
    serializableActions[emoji] = { type: actions[emoji].type, data: actions[emoji].data }
  }

  const messageData = {
    chat: msg.key.remoteJid,
    id: id,
    actions: serializableActions,
  }

  const dataPath = path.join(filePath, `${id}.json`)
  fs.writeFileSync(dataPath, JSON.stringify(messageData, null, 2))
}

export const handleReaction = async (reaction, sender, conn) => {
  const key = reaction.key
  const emoji = reaction.text

  const dataPath = path.join(filePath, `${key.id}.json`)
  if (!fs.existsSync(dataPath)) return

  const fileData = fs.readFileSync(dataPath, 'utf-8')
  const messageData = JSON.parse(fileData)

  const action = messageData.actions[emoji]
  if (!action) return

  try {
    const callback = getCallbackForAction(action.type);
    if (callback) {
      await callback(conn, reaction.key.remoteJid, action.data);
    }
  } catch (error) {
    console.error(`Error al ejecutar la acción del emoji: ${error}`)
  }
}

const actionCallbacks = {}
export const setActionCallback = (type, callback) => {
  actionCallbacks[type] = callback
}
const getCallbackForAction = (type) => {
  return actionCallbacks[type]
}

global.conn.ev.on('messages.upsert', async ({ messages }) => {
  const m = messages[0]
  if (!m?.message?.reactionMessage) return

  const reaction = m.message.reactionMessage
  const sender = m.key.participant || m.key.remoteJid

  handleReaction(reaction, sender, global.conn)
})*/

import fs from "fs"
import path from "path"

const filePath = path.join("./database/reacciones")
if (!fs.existsSync(filePath)) fs.mkdirSync(filePath, { recursive: true })

/**
 * Guardar un mensaje con sus reacciones
 * @param {object} msg - mensaje enviado
 * @param {object} actions - { "👍": fn | ".menu", "🔥": fn }
 */
export const createMessageWithReactions = (msg, actions) => {
  const id = msg.key.id

  // Guardamos directamente las acciones (funciones o comandos)
  const dataPath = path.join(filePath, `${id}.json`)
  fs.writeFileSync(dataPath, JSON.stringify({ actions: Object.keys(actions) }, null, 2))

  // Guardamos en memoria para uso inmediato
  memoryStore.set(id, actions)
}

const memoryStore = new Map()

/**
 * Manejar reacciones recibidas
 */
export const handleReaction = async (reaction, conn, m) => {
  const id = reaction.key.id
  const emoji = reaction.text
  const chat = reaction.key.remoteJid

  let actions = memoryStore.get(id)
  if (!actions) {
    // Cargar desde archivo si no está en memoria
    const dataPath = path.join(filePath, `${id}.json`)
    if (!fs.existsSync(dataPath)) return
    const fileData = JSON.parse(fs.readFileSync(dataPath, "utf-8"))
    actions = fileData.actions
    memoryStore.set(id, actions)
  }

  const action = actions[emoji]
  if (!action) return

  try {
    if (typeof action === "function") {
      // Ejecuta la función que definió el plugin
      await action(conn, chat, m)
    } else if (typeof action === "string") {
      // Ejecuta un comando como si lo escribió el usuario
      m.message = { conversation: action }
      conn.ev.emit("messages.upsert", { messages: [m], type: "append" })
    }
  } catch (err) {
    console.error(`❌ Error en reacción ${emoji}:`, err)
  }
}

/**
 * Escucha global de reacciones
 */
global.conn.ev.on("messages.upsert", async ({ messages }) => {
  const m = messages[0]
  if (!m?.message?.reactionMessage) return
  const reaction = m.message.reactionMessage
  await handleReaction(reaction, global.conn, m)
})
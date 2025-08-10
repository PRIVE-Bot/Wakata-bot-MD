
import fs from 'fs'
import path from 'path'

/**  
 * Estructura interna:  
 *  { [msgId]: { chatId, emojiActions: { emoji: callback }, originalMsgKey } }  
 */
const reactionsMap = {}

/**  
 * Carpeta para persistir datos (opcional)  
 */
const storageFolder = './reaction_storage'
if (!fs.existsSync(storageFolder)) fs.mkdirSync(storageFolder)

/**  
 * Registra un mensaje para escuchar reacciones  
 * @param {import('@whiskeysockets/baileys').proto.IMessageKey} messageKey - La key del mensaje  
 * @param {string} chatId - Jid del chat  
 * @param {Object<string, function>} emojiActions - Mapa emoji -> callback({conn, chatId, sender, key})  
 */
export function registerMessageReaction(messageKey, chatId, emojiActions) {
  reactionsMap[messageKey.id] = {
    chatId,
    emojiActions,
    originalMsgKey: messageKey
  }
  // Guarda también en archivo para persistencia (opcional)
  const filePath = path.join(storageFolder, `${messageKey.id}.json`)
  fs.writeFileSync(filePath, JSON.stringify({
    chatId,
    emojis: Object.keys(emojiActions),
    originalMsgKey: messageKey
  }, null, 2))
}

/**  
 * Elimina un mensaje registrado  
 * @param {string} messageId  
 */
export function unregisterMessageReaction(messageId) {
  delete reactionsMap[messageId]
  const filePath = path.join(storageFolder, `${messageId}.json`)
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
}

/**  
 * Inicializa el listener global en la conexión  
 * @param {import('@whiskeysockets/baileys').MakeWASocket} conn  
 */
export function initReactions(conn) {
  conn.ev.on('messages.upsert', async ({ messages }) => {
    try {
      const m = messages[0]
      if (!m?.message?.reactionMessage) return

      const emoji = m.message.reactionMessage.text
      const msgKey = m.message.reactionMessage.key
      const sender = m.key.participant || m.key.remoteJid
      const chatId = msgKey.remoteJid

      const reactionData = reactionsMap[msgKey.id]
      if (!reactionData) return // No está registrado

      if (reactionData.emojiActions[emoji]) {
        // Ejecutar callback con datos
        await reactionData.emojiActions[emoji]({
          conn,
          chatId,
          sender,
          key: msgKey
        })
      }
    } catch (e) {
      console.error('Error en reacción:', e)
    }
  })
}
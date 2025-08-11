// lib/reactions.js
const mensajesReaccion = {}

/**
 * Registra un mensaje para escuchar reacciones.
 * @param {string} idMensaje ID del mensaje a escuchar
 * @param {string} chatId ID del chat donde se envió
 * @param {string} emojiEsperado Emoji que activa la acción
 * @param {(m, conn) => Promise<void>} callback Función que se ejecuta cuando se detecta la reacción
 */
function registrarMensaje(idMensaje, chatId, emojiEsperado, callback) {
  mensajesReaccion[idMensaje] = { chat: chatId, textoEsperado: emojiEsperado, callback }
}

/**
 * Procesa un mensaje recibido para detectar reacciones.
 * Debes llamar esta función en cada evento 'messages.upsert' que recibas.
 * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} m Mensaje recibido
 * @param {import('@adiwajshing/baileys').WASocket} conn Instancia de conexión
 */
async function procesarReaccion(m, conn) {
  if (!m.message?.reactionMessage) return

  const reaction = m.message.reactionMessage
  const keyOriginal = reaction.key
  const emoji = reaction.text
  const chatOrigen = keyOriginal.remoteJid
  const idReaccionado = keyOriginal.id

  if (!idReaccionado) return

  const datos = mensajesReaccion[idReaccionado]
  if (!datos) return
  if (datos.chat !== chatOrigen) return
  if (emoji !== datos.textoEsperado) return

  try {
    await datos.callback(m, conn)
    delete mensajesReaccion[idReaccionado]
  } catch (e) {
    console.error('Error ejecutando callback de reacción:', e)
  }
}

export { registrarMensaje, procesarReaccion }
let mensajesReaccion = {}

export async function handler(m, { conn, command }) {
  if (command === 'testreact') {
    const mensajeParaReaccionar = 'Reacciona con ❤️ para activar la acción'
    const mensajeEnviado = await conn.sendMessage(m.chat, { text: mensajeParaReaccionar })
    console.log('Mensaje enviado con id:', mensajeEnviado.key.id)

    if (mensajeEnviado?.key?.id) {
      mensajesReaccion[mensajeEnviado.key.id] = {
        chat: m.chat,
        remitenteOriginal: m.sender,
        textoEsperado: '❤️'
      }
      console.log('Registrado mensaje para reacción:', mensajesReaccion)
    }
  }
}

handler.command = /^testreact$/i

export async function before(m, { conn }) {
  try {
    if (m.message?.reactionMessage) {
      const reaction = m.message.reactionMessage
      const keyOriginal = reaction.key
      const emoji = reaction.text
      console.log('Detectada reacción:', emoji, 'a mensaje id:', keyOriginal.id)

      if (!keyOriginal?.id) {
        console.log('No hay keyOriginal.id en la reacción')
        return
      }

      const datosMensaje = mensajesReaccion[keyOriginal.id]

      if (datosMensaje && emoji === datosMensaje.textoEsperado) {
        console.log('Emoji esperado detectado, enviando respuesta...')
        await conn.sendMessage(datosMensaje.chat, {
          text: `✅ ¡Acción ejecutada! El usuario @${m.sender.split('@')[0]} ha reaccionado con ${emoji}`,
          mentions: [m.sender]
        })
        delete mensajesReaccion[keyOriginal.id]
      } else {
        console.log('Emoji no esperado o mensaje no registrado')
      }
    }
  } catch (e) {
    console.error('Error en before:', e)
  }
}
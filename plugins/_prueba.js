let mensajesReaccion = {}

export async function handler(m, { conn, command }) {
    if (command === 'testreact') {
        const mensajeParaReaccionar = 'Reacciona con ❤️ para activar la acción'
        const mensajeEnviado = await conn.sendMessage(m.chat, {
            text: mensajeParaReaccionar
        })

        if (mensajeEnviado?.key?.id) {
            mensajesReaccion[mensajeEnviado.key.id] = {
                chat: m.chat,
                remitenteOriginal: m.sender,
                textoEsperado: '❤️'
            }
        }
    }
}

handler.command = /^testreact$/i

export async function before(m, { conn }) {
    if (m.message?.reactionMessage) {
        const { key, text: emoji } = m.message.reactionMessage
        const idReaccionado = key?.id
        const chatOrigen = key?.remoteJid

        // Validar que la reacción corresponde a un mensaje registrado
        if (mensajesReaccion[idReaccionado] && mensajesReaccion[idReaccionado].chat === chatOrigen) {
            const datosMensaje = mensajesReaccion[idReaccionado]

            if (emoji === datosMensaje.textoEsperado) {
                await conn.sendMessage(chatOrigen, {
                    text: `✅ ¡Acción ejecutada! El usuario @${m.sender.split('@')[0]} ha reaccionado con ${emoji}`,
                    mentions: [m.sender]
                })

                delete mensajesReaccion[idReaccionado]
            }
        }
    }
}
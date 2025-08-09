// plugins/reaccion.js
let mensajesReaccion = {} // Almacena mensajes que esperan reacción

export default async function handler(m, { conn, command }) {
    if (command === 'testreact') {
        let msg = await conn.sendMessage(m.chat, { text: 'Reacciona con ❤️ para activar la acción' })
        mensajesReaccion[msg.key.id] = {
            chat: m.chat,
            from: m.sender
        }
    }
}

// Evento para escuchar reacciones
handler.before = async function (m, { conn }) {
    if (m.messageStubType === 28) { // 28 = Mensaje de reacción en Baileys
        let reaccion = m.messageStubParameters?.[0] // Emoji de la reacción
        let msgID = m.key.id // ID del mensaje reaccionado
        let datos = mensajesReaccion[msgID]

        if (!datos) return // No está registrado
        if (reaccion === '❤️') {
            await conn.sendMessage(datos.chat, { text: `✅ Acción ejecutada por ${m.sender}` })
        }
    }
}

handler.command = /^testreact$/i
export default handler
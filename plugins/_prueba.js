// En tu handler principal o index.js
let reactionTargets = {} // Guardará mensajes que esperan reacciones

conn.ev.on('messages.reaction', async (reaction) => {
    const { key, text, sender } = reaction[0] // Información de la reacción
    const reactedEmoji = reaction[0].reaction.text
    const msgId = key.id

    if (reactionTargets[msgId] && reactedEmoji === '👍') {
        await conn.sendMessage(sender, { text: '¡Recibí tu reacción con 👍!' })
    }
})

// En tu plugin
let handler = async (m, { conn }) => {
    let sentMsg = await conn.sendMessage(m.chat, { text: 'Reacciona con 👍 a este mensaje' })
    reactionTargets[sentMsg.key.id] = true // Guardamos el ID del mensaje para escucharlo después
}

handler.command = /^testreact$/i
export default handler
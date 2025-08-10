import makeWASocket from '@whiskeysockets/baileys'

let msgIdToListen = null

async function startBot() {
  const conn = makeWASocket()

  // Listener de mensajes para comandos
  conn.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]
    if (!m.message || m.key.fromMe) return

    const text = m.message.conversation || m.message.extendedTextMessage?.text || ''

    if (text.trim().toLowerCase() === '.prueba1') {
      // Enviar mensaje para reaccionar
      const sentMsg = await conn.sendMessage(
        m.key.remoteJid,
        { text: '¡Mensaje para reaccionar! Reacciona con ❤️ para que te responda.' },
        { quoted: m }
      )

      msgIdToListen = sentMsg.key.id

      // Confirmación opcional
      await conn.sendMessage(m.key.remoteJid, { text: 'Mensaje enviado. Esperando reacciones...' }, { quoted: sentMsg })
    }
  })

  // Listener de reacciones
  conn.ev.on('messages.reaction', async (reactionEvents) => {
    for (const reaction of reactionEvents) {
      try {
        // Solo si tenemos mensaje para escuchar
        if (!msgIdToListen) return

        if (reaction.key.id !== msgIdToListen) return // no es el mensaje correcto

        if (reaction.text !== '❤️') return // emoji esperado

        // Responder en el chat con mención
        await conn.sendMessage(
          reaction.key.remoteJid,
          {
            text: `@${reaction.sender.split('@')[0]} ha reaccionado correctamente ❤️`,
            mentions: [reaction.sender]
          }
        )
      } catch (e) {
        console.error('Error manejando reacción:', e)
      }
    }
  })

  // Conectar y mantener vivo
  conn.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== 401
      console.log('Conexión cerrada. Reintentando:', shouldReconnect)
      if (shouldReconnect) startBot()
    } else if (connection === 'open') {
      console.log('Conectado al WhatsApp!')
    }
  })
}

startBot()
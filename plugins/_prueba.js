import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
  // Solo responder en chats privados (no grupos)
  if (m.isGroup) return

  const texto = `🤖 Hola, este usuario cuenta con un asistente automático basado en IA.

Para consultarle algo, usa el comando:

.ia <tu pregunta>

Gracias por comprender.`

  const messageContent = {
    "interactiveMessage": {
      "header": {
        "type": 1, // HEADER_TYPE_TEXT
        "text": "Asistente IA - Naruto Bot"
      },
      "body": {
        "text": texto
      },
      "footer": {
        "text": "Naruto Bot by Deylin"
      },
      "action": {
        "buttons": [
          {
            "buttonId": ".IA Hola",
            "buttonText": {
              "displayText": "¿Cómo usar?"
            },
            "type": 1
          },
          {
            "buttonId": ".owner",
            "buttonText": {
              "displayText": "Soporte / Creador"
            },
            "type": 1
          }
        ]
      }
    }
  }

  const msg = generateWAMessageFromContent(m.chat, messageContent, { userJid: m.sender })

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

handler.command = ['']
handler.register = true
export default handler
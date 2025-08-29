/*// plugins/admin-canal.js
import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
  const msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: {
          body: { text: "Invitación para ser admin. del canal" },
          footer: { text: "SPARK-BOT ↱ UPDATE" },
          header: {
            title: "🔥 SPARK- BOT 🔥",
            subtitle: "Invitación oficial",
            hasMediaAttachment: false
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                  display_text: "Ver invitación",
                  url: `https://wa.me/${global.ofcbot}`, 
                  merchant_url: "https://whatsapp.com"
                })
              }
            ]
          }
        }
      }
    }
  }, { userJid: m.chat, quoted: m })

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

handler.command = /^invitacioncanal$/i
export default handler
*/

import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
  const content = {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          body: { text: "¿Te gusta Spark-Bot? 🚀\n¡Compártelo con tus amigos!" },
          footer: { text: "SPARK-BOT Official ©" },
          header: {
            title: "🔥 SPARK-BOT 🔥",
            hasMediaAttachment: false
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                  display_text: "📢 Compartir Spark-Bot",
                  url: "https://wa.me/5555555555+https://chat.whatsapp.com/HuMh41LJftl4DH7G5MWcHP",
                  merchant_url: "https://wa.me/50455555555"
                })
              }
            ]
          }
        }
      }
    }
  }

  const msg = generateWAMessageFromContent(m.chat, content, { quoted: m })
  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

handler.command = /^1$/i
export default handler
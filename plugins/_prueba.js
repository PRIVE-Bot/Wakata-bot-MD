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

/*import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

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
                   url: `https://wa.me/?text=🔥+Prueba+SPARK-BOT+ahora!+Entra+al+grupo:+https://chat.whatsapp.com/HuMh41LJftl4DH7G5MWcHP`, 
                  merchant_url: "https://wa.me"
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
export default handler*/


import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

// Registro de usuarios que ya recibieron el mensaje
const welcomeSent = {}

export async function before(m, { conn }) {
    // Ignorar mensajes propios
    if (m.isBaileys && m.fromMe) return true
    // Solo privados
    if (m.isGroup) return false
    // Solo si hay mensaje de texto
    if (!m.message) return true

    const user = m.sender

    // Ya recibió el mensaje
    if (welcomeSent[user]) return true

    // Construcción del mensaje interactivo
    const content = {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    body: { text: `👋 Hola @${user.split('@')[0]}!\n\n¿Te gusta Spark-Bot? 🚀\n¡Compártelo con tus amigos!` },
                    footer: { text: "SPARK-BOT Official ©" },
                    header: { title: "🔥 SPARK-BOT 🔥", hasMediaAttachment: false },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: "cta_url",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "📢 Compartir Spark-Bot",
                                    url: `https://wa.me/?text=🔥+Prueba+SPARK-BOT+ahora!+Entra+al+grupo:+https://chat.whatsapp.com/HuMh41LJftl4DH7G5MWcHP`,
                                    merchant_url: "https://wa.me"
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

    // Marca al usuario como que ya recibió el mensaje
    welcomeSent[user] = true

    return true
}
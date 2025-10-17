import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
    const contactNumber = '1234567890' // Número del contacto con código internacional
    const contactUrl = `https://wa.me/${contactNumber}`

    // Mensaje tipo "tarjeta profesional" sin imágenes
    const template = {
        templateMessage: {
            hydratedTemplate: {
                hydratedContentText: `

║ ✦ WhatsApp: +${contactNumber}
`,
                hydratedFooterText: '📌 Presiona esta tarjeta para abrir el contacto en WhatsApp',
                hydratedButtons: [],
                contextInfo: {
                    externalAdReply: {
                        showAdAttribution: true,
                        mediaType: 1, // tipo texto/link sin imagen
                        title: 'Mode - Servicios Digitales',
                        body: 'Creador / Contacto Oficial',
                        sourceUrl: contactUrl // abre directamente el chat de WhatsApp
                    }
                }
            }
        }
    }

    // Enviamos el mensaje
    const waMessage = generateWAMessageFromContent(m.chat, template, { quoted: m })
    await conn.relayMessage(m.chat, waMessage.message, { messageId: waMessage.key.id })
}

handler.help = ['creador']
handler.tags = ['info']
handler.command = /^creador$/i

export default handler
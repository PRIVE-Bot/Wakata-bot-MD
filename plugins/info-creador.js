import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn, usedPrefix, command }) => {
    // Solo se ejecuta si el comando es 'creador'
    if (command !== 'creador') return

    const contactName = "Mode - Servicios Digitales"
    const contactNumber = "50432955554" // sin '+' ni espacios
    const contactEmail = "contacto@mode.com"
    const website = "https://mode.com"

    // vCard del contacto
    const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${contactName}
ORG:${contactName};
TEL;type=CELL;type=VOICE;waid=${contactNumber}:${contactNumber}
EMAIL;type=INTERNET:${contactEmail}
URL:${website}
END:VCARD
`

    // Creamos el mensaje interactivo tipo “buttonsMessage”
    const message = {
        contactsArray: [{ displayName: contactName, vcard }],
        contentText: `📌 Información de contacto:\n\nNombre: ${contactName}\nWhatsApp: +${contactNumber}\nCorreo: ${contactEmail}\nWeb: ${website}`,
        footerText: '¡Guarda nuestro contacto para mantenerte en conexión!',
        buttons: [
            { buttonId: 'save_contact', buttonText: { displayText: 'Guardar contacto' }, type: 1 },
            { buttonId: 'visit_web', buttonText: { displayText: 'Visitar web' }, type: 1 }
        ],
        headerType: 6 // Indica que es un mensaje con contacto
    }

    // Enviamos el mensaje
    const waMessage = generateWAMessageFromContent(m.chat, { 
        buttonsMessage: message 
    }, { quoted: m })

    await conn.relayMessage(m.chat, waMessage.message, { messageId: waMessage.key.id })
}

handler.help = ['creador']
handler.tags = ['info']
handler.command = /^creador$/i // Regex para activar con "creador"

export default handler
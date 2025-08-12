// plugins/enriched-messages.js
// Envía ejemplos de todos los mensajes enriquecidos de WhatsApp con Baileys

import { generateWAMessageFromContent } from '@adiwajshing/baileys'
import fs from 'fs'
import fetch from 'node-fetch'

let handler = async (m, { conn, args }) => {
  const jid = args[0] || m.chat

  // 1) Texto simple
  await conn.sendMessage(jid, { text: '📌 Ejemplo de texto simple' })

  // 2) Botones
  await conn.sendMessage(jid, {
    text: 'Ejemplo de botones',
    buttons: [
      { buttonId: 'btn1', buttonText: { displayText: 'Botón 1' }, type: 1 },
      { buttonId: 'btn2', buttonText: { displayText: 'Botón 2' }, type: 1 }
    ],
    headerType: 1
  })

  // 3) List message
  await conn.sendMessage(jid, {
    text: 'Selecciona una opción:',
    footer: 'Pie de página',
    title: 'Menú de opciones',
    buttonText: 'Abrir lista',
    sections: [
      {
        title: 'Sección 1',
        rows: [
          { title: 'Opción 1', rowId: 'opt1', description: 'Descripción 1' },
          { title: 'Opción 2', rowId: 'opt2', description: 'Descripción 2' }
        ]
      }
    ]
  })

  // 4) Imagen con externalAdReply
  await conn.sendMessage(jid, {
    image: await fetchBuffer('https://via.placeholder.com/400'),
    caption: 'Imagen con enlace enriquecido',
    contextInfo: {
      externalAdReply: {
        title: 'Título del enlace',
        body: 'Descripción breve',
        thumbnail: await fetchBuffer('https://via.placeholder.com/300'),
        mediaType: 1,
        mediaUrl: 'https://example.com',
        sourceUrl: 'https://example.com'
      }
    }
  })

  // 5) Documento PDF
  fs.writeFileSync('ejemplo.pdf', 'Contenido de ejemplo en PDF')
  await conn.sendMessage(jid, {
    document: fs.readFileSync('ejemplo.pdf'),
    mimetype: 'application/pdf',
    fileName: 'ejemplo.pdf'
  })

  // 6) Contacto
  await conn.sendMessage(jid, {
    contacts: {
      displayName: 'Contacto de prueba',
      contacts: [
        {
          vcard: `BEGIN:VCARD
VERSION:3.0
FN:Prueba Baileys
TEL;type=CELL;waid=521123456789:+52 1 123 456 789
END:VCARD`
        }
      ]
    }
  })

  // 7) Template / Hydrated Buttons
  const template = {
    hydratedTemplate: {
      hydratedContentText: 'Texto del template',
      hydratedFooterText: 'Pie del template',
      hydratedButtons: [
        { quickReplyButton: { displayText: 'Respuesta rápida', id: 'quick1' } },
        { urlButton: { displayText: 'Visitar web', url: 'https://example.com' } },
        { callButton: { displayText: 'Llamar ahora', phoneNumber: '+521123456789' } }
      ]
    }
  }
  const templateMsg = generateWAMessageFromContent(jid, { templateMessage: template }, { userJid: conn.user.id })
  await conn.relayMessage(jid, templateMsg.message, { messageId: templateMsg.key.id })

  m.reply('✅ Todos los mensajes enriquecidos fueron enviados')
}

handler.help = ['enriched']
handler.tags = ['tools']
handler.command = ['enriched']

export default handler

async function fetchBuffer(url) {
  const res = await fetch(url)
  return Buffer.from(await res.arrayBuffer())
}
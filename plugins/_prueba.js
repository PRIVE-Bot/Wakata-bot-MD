import {
  generateWAMessageFromContent
} from '@adiwajshing/baileys';
import fs from 'fs/promises'; // Usa fs/promises para operaciones asíncronas
import fetch from 'node-fetch';

let handler = async (m, {
  conn,
  args
}) => {
  const jid = args[0] || m.chat;

  try {
    // 1) Texto simple
    await conn.sendMessage(jid, {
      text: '📌 Ejemplo de texto simple'
    });

    // 2) Botones de respuesta rápida (Quick Reply)
    await conn.sendMessage(jid, {
      text: 'Ejemplo de botones',
      buttons: [{
        buttonId: 'btn1',
        buttonText: {
          displayText: 'Botón 1'
        },
        type: 1
      }, {
        buttonId: 'btn2',
        buttonText: {
          displayText: 'Botón 2'
        },
        type: 1
      }, {
        buttonId: 'btn3',
        buttonText: {
          displayText: 'Botón 3'
        },
        type: 1
      }],
      headerType: 1
    });

    // 3) Mensaje de lista (List message)
    await conn.sendMessage(jid, {
      text: 'Selecciona una opción:',
      footer: 'Pie de página',
      title: 'Menú de opciones',
      buttonText: 'Abrir lista',
      sections: [{
        title: 'Sección 1',
        rows: [{
          title: 'Opción 1',
          rowId: 'opt1',
          description: 'Descripción 1'
        }, {
          title: 'Opción 2',
          rowId: 'opt2',
          description: 'Descripción 2'
        }]
      }]
    });

    // 4) Imagen con vista previa de enlace enriquecida
    const imageUrl = 'https://via.placeholder.com/400';
    const thumbnailBuffer = await fetchBuffer('https://via.placeholder.com/300');
    const imageBuffer = await fetchBuffer(imageUrl);

    await conn.sendMessage(jid, {
      image: imageBuffer,
      caption: 'Imagen con enlace enriquecido',
      contextInfo: {
        externalAdReply: {
          title: 'Título del enlace',
          body: 'Descripción breve del enlace',
          thumbnail: thumbnailBuffer,
          mediaType: 1, // 1 para imagen, 2 para video
          sourceUrl: 'https://example.com'
        }
      }
    });

    // 5) Documento PDF
    const pdfPath = './ejemplo.pdf';
    await fs.writeFile(pdfPath, 'Contenido de ejemplo en PDF'); // Creación del archivo de forma asíncrona
    await conn.sendMessage(jid, {
      document: await fs.readFile(pdfPath),
      mimetype: 'application/pdf',
      fileName: 'ejemplo.pdf'
    });
    await fs.unlink(pdfPath); // Elimina el archivo después de enviarlo

    // 6) Contacto (vCard)
    await conn.sendMessage(jid, {
      contacts: {
        displayName: 'Contacto de prueba',
        contacts: [{
          vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Prueba Baileys\nTEL;type=CELL;waid=521123456789:+52 1 123 456 789\nEND:VCARD`
        }]
      }
    });

    // 7) Mensaje de plantilla (Template / Hydrated Buttons)
    const template = {
      hydratedTemplate: {
        hydratedContentText: 'Texto del template',
        hydratedFooterText: 'Pie del template',
        hydratedButtons: [{
          quickReplyButton: {
            displayText: 'Respuesta rápida',
            id: 'quick1'
          }
        }, {
          urlButton: {
            displayText: 'Visitar web',
            url: 'https://example.com'
          }
        }, {
          callButton: {
            displayText: 'Llamar ahora',
            phoneNumber: '+521123456789'
          }
        }]
      }
    };

    const templateMsg = generateWAMessageFromContent(jid, {
      templateMessage: template
    }, {
      userJid: conn.user.id
    });
    await conn.relayMessage(jid, templateMsg.message, {
      messageId: templateMsg.key.id
    });


    m.reply('✅ Todos los mensajes enriquecidos fueron enviados');

  } catch (error) {
    console.error('Error al enviar los mensajes enriquecidos:', error);
    m.reply('❌ Ocurrió un error al intentar enviar los mensajes.');
  }
};

handler.help = ['enriched'];
handler.tags = ['tools'];
handler.command = ['enriched'];

export default handler;

// Función auxiliar para obtener un buffer desde una URL
async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Falló la descarga de la URL: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

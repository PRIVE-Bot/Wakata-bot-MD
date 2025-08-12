// plugins/estilos-unicos.js
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  const imgUrl = 'https://files.catbox.moe/8vxwld.jpg'
  let thumb

  try {
    const res = await fetch(imgUrl)
    if (!res.ok) {
      throw new Error(`Error al obtener la imagen: ${res.statusText}`)
    }
    thumb = Buffer.from(await res.arrayBuffer())
  } catch (e) {
    console.error('Error al descargar la imagen. No se podrán enviar los mensajes estilizados:', e)
    return await conn.reply(m.chat, 'Lo siento, no pude obtener la imagen para los mensajes. Intenta de nuevo más tarde.', m)
  }

  // --- ESTILO 1: Anuncio Ultra Pro ---
  const anuncioPro = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "ANUNCIO_PRO"
    },
    message: {
      locationMessage: {
        name: '⚡ AVISO ULTRA IMPORTANTE ⚡',
        jpegThumbnail: thumb
      },
      extendedTextMessage: {
        text: 'Este mensaje contiene información clasificada para miembros VIP 🦊',
        contextInfo: {
          externalAdReply: {
            title: '🔥 Noticia Exclusiva',
            body: 'Haz clic y entérate antes que todos',
            thumbnail: thumb,
            sourceUrl: 'https://tu-enlace.com',
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: true
          }
        }
      }
    },
    participant: "0@s.whatsapp.net"
  }

  // --- ESTILO 2: Documento Misterioso ---
  const docMisterioso = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "DOC_SECRET"
    },
    message: {
      documentMessage: {
        title: '📂 Archivo Confidencial',
        fileName: 'informe_ultra_secreto.pdf',
        mimetype: 'application/pdf',
        jpegThumbnail: thumb,
        pageCount: 1
      }
    },
    participant: "0@s.whatsapp.net"
  }

  // --- ESTILO 3: Mensaje Fantasma ---
  const mensajeFantasma = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "VIEW_ONCE_TRICK"
    },
    message: {
      viewOnceMessage: {
        message: {
          imageMessage: {
            jpegThumbnail: thumb,
            caption: '👁 Contenido Único - Solo para ti'
          }
        }
      }
    },
    participant: "0@s.whatsapp.net"
  }

  // --- Lista de estilos a enviar ---
  const estilos = [anuncioPro, docMisterioso, mensajeFantasma]
  
  // Enviamos cada mensaje en un bucle con su propio manejo de errores
  for (const elegido of estilos) {
    try {
      await conn.relayMessage(m.chat, elegido.message, { messageId: elegido.key.id })
      console.log(`Mensaje con id ${elegido.key.id} enviado con éxito.`)
    } catch (e) {
      // Si un mensaje falla, registramos el error y continuamos con el siguiente
      console.error(`Error al enviar el mensaje con id ${elegido.key.id}:`, e)
      await conn.reply(m.chat, `Error al enviar uno de los mensajes especiales: ${e.message}`, m)
    }
  }

}

handler.command = /^rosa$/i
export default handler

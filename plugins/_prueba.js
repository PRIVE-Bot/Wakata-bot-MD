// plugins/estilos-unicos.js
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  const imgUrl = 'https://files.catbox.moe/8vxwld.jpg'
  const res = await fetch(imgUrl)
  const thumb = Buffer.from(await res.arrayBuffer())

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

  // --- Lista de estilos ---
  const estilos = [anuncioPro, docMisterioso, mensajeFantasma]
  const elegido = estilos[Math.floor(Math.random() * estilos.length)]

  // Enviar el estilo elegido
  await conn.relayMessage(m.chat, elegido.message, { messageId: elegido.key.id })
}

handler.command = /^estilounico$/i
export default handler
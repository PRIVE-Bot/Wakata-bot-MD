// plugins/estilo-anuncio.js
/*import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  const imgUrl = 'https://files.catbox.moe/8vxwld.jpg'
  const res = await fetch(imgUrl)
  const thumb = Buffer.from(await res.arrayBuffer())

  const anuncioPro = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "ANUNCIO_PRO"
    },
    message: {
      extendedTextMessage: {
        text: '🚨 *Prueba uno* - Este es un mensaje con estilo Anuncio Ultra Pro.\n\n¡Atención! Información VIP exclusiva para ti.',
        contextInfo: {
          externalAdReply: {
            title: '🔥 Noticia Exclusiva',
            body: 'Haz clic y entérate antes que todos',
            thumbnail: thumb,
            sourceUrl: 'https://tu-enlace.com',
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: true
          },
          locationMessage: {
            name: '⚡ AVISO ULTRA IMPORTANTE ⚡',
            jpegThumbnail: thumb
          }
        }
      }
    },
    participant: "0@s.whatsapp.net"
  }

  await conn.relayMessage(m.chat, anuncioPro.message, { messageId: anuncioPro.key.id })
}

handler.command = /^prueba1$/i
export default handler*/



import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  const thumb = await (await fetch('https://files.catbox.moe/8vxwld.jpg')).buffer()

  const sections = [
    {
      title: 'Nuestros Planes',
      rows: [
        { title: 'Plan Básico', rowId: 'plan_basico', description: 'Ideal para emprendedores, incluye 10 comandos y soporte estándar.' },
        { title: 'Plan Pro', rowId: 'plan_pro', description: 'Para negocios en crecimiento, con comandos ilimitados y soporte prioritario.' },
        { title: 'Plan Empresa', rowId: 'plan_empresa', description: 'Solución completa para grandes empresas, con integración y personalización total.' }
      ]
    }
  ]

  const listMessage = {
    text: `🚀 *¡Conoce nuestros planes!* 🚀\n\nSelecciona el plan que mejor se adapte a tus necesidades.`,
    footer: 'Elige tu plan y lleva tu negocio al siguiente nivel',
    title: '💻 Bot Profesional WhatsApp',
    buttonText: 'Ver Planes',
    sections,
    contextInfo: {
      externalAdReply: {
        showAdAttribution: true,
        title: '💻 Bot Profesional WhatsApp',
        body: 'Visita nuestra web y conoce todos los detalles',
        thumbnail: thumb,
        sourceUrl: 'https://tubotprofesional.com',
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }

  conn.sendMessage(m.chat, listMessage)
}

handler.command = ['comprar']
export default handler

import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  // Imagen profesional para la tarjeta de vista previa
  const imgUrl = 'https://files.catbox.moe/8vxwld.jpg' 
  const res = await fetch(imgUrl)
  const thumb = Buffer.from(await res.arrayBuffer())

  // Mensaje de texto con vista previa enriquecida
  const professionalMessage = {
    text: `🚀 *¡Oferta exclusiva!* 🚀\n\n🔥 Consigue tu propio bot de WhatsApp profesional, rápido y personalizable.\n\n✨ Funciones avanzadas: comandos, stickers, conexión QR, reacciones, mensajes enriquecidos y más.\n\n💼 ¡Ideal para negocios y creadores!`,
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

  // Enviar el mensaje de texto enriquecido.
  // Este método es el más básico y robusto para enviar mensajes.
  await conn.sendMessage(m.chat, professionalMessage, { quoted: m })
}

handler.command = ['comprar']
export default handler

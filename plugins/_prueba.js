import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  const thumb = await (await fetch('https://files.catbox.moe/8vxwld.jpg')).buffer()

  // Define la información del producto
  const product = {
    productImage: {
      mimetype: 'image/jpeg',
      jpegThumbnail: thumb,
    },
    productId: '334456799976443',
    title: 'Bot Profesional WhatsApp',
    description: `🚀 ¡Tu negocio en el siguiente nivel!\n\n🔥 Consigue un bot de WhatsApp rápido, personalizable y con funciones avanzadas para automatizar tu negocio.\n\n✨ Comandos, stickers, conexión QR, mensajes enriquecidos y más.\n\n💼 ¡Ideal para negocios y creadores!`,
    currencyCode: 'USD',
    priceAmount1000: 50000, // 50 USD
    retailerId: '',
    url: 'https://tubotprofesional.com',
  };

  // Crea el mensaje completo con el formato de producto
  const productMessage = {
    productMessage: {
      product: product,
      businessOwnerJid: '50432955554@s.whatsapp.net',
      contextInfo: {
        externalAdReply: {
          showAdAttribution: true,
          title: '💻 Bot Profesional WhatsApp',
          body: '¡Empieza a crecer hoy!',
          mediaType: 1,
          thumbnail: thumb,
          sourceUrl: 'https://tubotprofesional.com',
          renderLargerThumbnail: true,
        },
      },
    },
  };
  
  // Envía el mensaje con el formato de producto de forma directa
  conn.sendMessage(m.chat, productMessage, { quoted: m });
};

handler.command = ['comprar'];
export default handler;

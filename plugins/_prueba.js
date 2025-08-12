// plugins/fake-product.js
import fetch from 'node-fetch'

let handler = async (m, { conn, text, command }) => {
  if (!text) throw `📌 Usa: *${command}* <texto>`

  // URL de la imagen que quieres que aparezca
  const imageUrl = 'https://i.postimg.cc/jqWqwd8Z/IMG-20250803-WA0146.jpg' // <-- Reemplaza con tu imagen

  try {
    const res = await fetch(imageUrl)
    if (!res.ok) throw new Error('No se pudo obtener la imagen.')
    const thumbnailBuffer = Buffer.from(await res.arrayBuffer())

    const fakeProduct = {
      key: {
        fromMe: false,
        participant: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast',
        id: 'product-message-id',
      },
      message: {
        productMessage: {
          product: {
            productImage: {
              mimetype: 'image/jpeg',
              jpegThumbnail: thumbnailBuffer,
            },
            productId: '9999999', // Debe ser un número
            title: '⭐ Mensaje Destacado', // Título que se muestra
            description: text, // El texto que pasas en el comando
            currencyCode: 'USD',
            priceAmount1000: 1000, // Precio en centavos (aquí $1.00 USD)
            salePriceAmount1000: 1000,
            retailerId: 'ID-de-tu-bot',
          },
          businessOwnerJid: '0@s.whatsapp.net',
        },
      },
      participant: '0@s.whatsapp.net',
    };

    await conn.sendMessage(m.chat, { text: 'Este es el mensaje principal.', quoted: fakeProduct });

  } catch (error) {
    console.error('Error al crear el mensaje de producto:', error);
    m.reply('❌ Ocurrió un error al intentar enviar el mensaje.');
  }
}

handler.help = ['fakeproduct <texto>']
handler.tags = ['unique']
handler.command = ['fakeproduct']

export default handler

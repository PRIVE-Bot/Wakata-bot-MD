/*import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  const jid = m.chat;

  
  const res = await fetch('https://files.catbox.moe/usl0ms.jpg');
  const thumb2 = Buffer.from(await res.arrayBuffer());


const fkontak = {
  key: {
    fromMe: false,
    participant: '0@s.whatsapp.net',
    remoteJid: 'status@broadcast',
    id: 'fake-product-message-id'
  },
  message: {
    productMessage: {
      product: {
        productImage: {
          jpegThumbnail: thumb2 // Buffer con imagen pequeña
        },
        title: '🔥 Producto Destacado 🔥',
        description: 'Alquila o compra este producto para tus grupos.',
        currencyCode: 'USD',
        priceAmount1000: 5000, // 5 USD
        retailerId: '1466',
        productId: '24103084136052981',
        productImageCount: 1
      },
      businessOwnerJid: '50432955554@s.whatsapp.net'
    }
  },
  participant: '0@s.whatsapp.net'
};
 

  try {
    const productMessage = {
      product: {
        productImage: {
          url: icono 
        },
        title: global.textbot,
        description: `Alquila o compra *${global.botname}* para tus grupos.`,
        currencyCode: "USD",
        priceAmount1000: 5000,
        retailerId: "1466",
        productId: "24103084136052981",
        productImageCount: 1,
      },
      businessOwnerJid: "50432955554@s.whatsapp.net"
    };

    
    await conn.sendMessage(jid, productMessage, { messageType: 'product', quoted: fkontak });
  } catch (error) {
    console.error('Error enviando catálogo:', error);
    conn.reply(jid, '❌ No se pudo enviar el catálogo. Verifica que el productId y el número Business sean correctos.', m);
  }
};

handler.help = ['producto', 'compra'];
handler.command = ['producto', 'compra', 'buy'];
handler.tags = ['ventas'];
handler.register = true;

export default handler;*/



import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  const jid = m.chat;

  // Imagen para thumbnail (puede ser logo o banner de producto)
  const imageUrl = 'https://files.catbox.moe/usl0ms.jpg';
  const res = await fetch(imageUrl);
  const thumbnail = Buffer.from(await res.arrayBuffer());

  // Datos del producto / mensaje
  const productTitle = global.textbot || 'Producto Destacado';
  const productDescription = `Alquila o compra *${global.botname}* para potenciar tus grupos.\n\n¡Contáctanos y aprovecha esta oferta exclusiva!`;
  const priceUSD = 5.00;

  // Fake contacto para citar (simula mensaje tipo catálogo de empresa)
  const fkontak = {
    key: {
      fromMe: false,
      participant: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
      id: 'fake-product-msg-id'
    },
    message: {
      productMessage: {
        product: {
          productImage: {
            jpegThumbnail: thumbnail
          },
          title: `🔥 ${productTitle.toUpperCase()} 🔥`,
          description: productDescription,
          currencyCode: 'USD',
          priceAmount1000: priceUSD * 1000, // Ejemplo 5000 = 5 USD
          retailerId: '1466',
          productId: '24103084136052981',
          productImageCount: 1,
        },
        businessOwnerJid: '50432955554@s.whatsapp.net'
      }
    },
    participant: '0@s.whatsapp.net'
  };

  // Botones para acción (comprar, más info)
  const buttons = [
    { buttonId: 'buy_now', buttonText: { displayText: '🛒 Comprar ahora' }, type: 1 },
    { buttonId: 'contact', buttonText: { displayText: '📞 Contactar' }, type: 1 }
  ];

  // Mensaje con botones y texto
  const buttonMessage = {
    caption: productDescription + `\n💰 Precio: $${priceUSD.toFixed(2)} USD`,
    footer: 'Mode - Tu tienda virtual',
    buttons,
    headerType: 1,
    image: thumbnail
  };

  try {
    // Primero envía el mensaje producto con cita profesional
    await conn.sendMessage(jid, {
      product: {
        productImage: { url: imageUrl },
        title: productTitle,
        description: productDescription,
        currencyCode: 'USD',
        priceAmount1000: priceUSD * 1000,
        retailerId: '1466',
        productId: '24103084136052981',
        productImageCount: 1,
      },
      businessOwnerJid: '50432955554@s.whatsapp.net'
    }, { messageType: 'product', quoted: fkontak });

    // Luego envía el mensaje con botones para incentivar interacción
    await conn.sendMessage(jid, buttonMessage, { quoted: m });

  } catch (error) {
    console.error('Error enviando mensaje:', error);
    conn.reply(jid, '❌ No se pudo enviar el mensaje de promoción.', m);
  }
};

handler.help = ['producto', 'compra', 'marketing'];
handler.command = ['producto', 'compra', 'marketing'];
handler.tags = ['ventas'];
handler.register = true;

export default handler;
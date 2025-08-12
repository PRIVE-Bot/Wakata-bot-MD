import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  const jid = m.chat;

  
  const text = `Catálogo de ${global.botname}`;

  
  const imageUrl = icono,
  let imageBuffer;
  try {
    const response = await fetch(imageUrl);
    imageBuffer = await response.buffer();
  } catch {
    imageBuffer = Buffer.alloc(0); 
  }

  
  const fakeQuote = {
    key: {
      fromMe: false,
      participant: '0@s.whatsapp.net',
      remoteJid: 'status@broadcast',
    },
    message: {
      imageMessage: {
        mimetype: 'image/jpeg',
        caption: text,
        jpegThumbnail: imageBuffer,
      },
    },
  };

  try {
    const productMessage = {
      product: {
        productImage: {
          url: icono,
        },
        title: global.textbot,
        description: `Alquila o compra ${global.botname} para tus grupos.`,
        currencyCode: 'USD',
        priceAmount1000: 5000,
        retailerId: '1466',
        productId: '24103084136052981',
        productImageCount: 1,
      },
      businessOwnerJid: '50432955554@s.whatsapp.net',
    };

    
    await conn.sendMessage(jid, productMessage, { messageType: 'product', quoted: fakeQuote });
  } catch (error) {
    console.error('Error enviando catálogo:', error);
    conn.reply(jid, '❌ No se pudo enviar el catálogo. Verifica que el productId y el número Business sean correctos.', m);
  }
};

handler.help = ['producto', 'compra'];
handler.command = ['producto', 'compra', 'buy'];
handler.tags = ['ventas'];
handler.register = true;

export default handler;
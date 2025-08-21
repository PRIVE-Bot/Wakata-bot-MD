let handler = async (m, { conn }) => {
  const jid = m.chat;

  try {
    const productMessage = {
      product: {
        productImage: {
          url: icono
        },
        title: global.textbot,
        description: "software",
        currencyCode: "USD",
        priceAmount1000: 5000, 
        retailerId: "1466", 
        productId: "24502048122733040", 
        productImageCount: 1,
      },
      businessOwnerJid: "50432955554@s.whatsapp.net" 
    };

    await conn.sendMessage(jid, productMessage, { messageType: 'product' });
  } catch (error) {
    console.error('Error enviando catálogo:', error);
    conn.reply(jid, '❌ No se pudo enviar el catálogo...', m);
  }
};

handler.help = ['producto', 'compra'];
handler.command = ['producto', 'compra', 'buy'];
handler.tags = ['ventas'];
handler.register = true;

export default handler;
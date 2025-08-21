let handler = async (m, { conn }) => {
  const jid = m.chat;

let fkontak = {
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
        }
      }
    }

    
return conn.reply(m.chat, `Hola`, fkontak);
};


handler.command = ['producto', 'compra', '1'];


export default handler;




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
      };

    
retunt


handler.command = ['producto', 'compra', '1'];


export default handler;



const res = await fetch('https://files.catbox.moe/oljc0e.png'); 
const thumb3 = Buffer.from(await res.arrayBuffer());

let fkontak = {
    key: { 
        fromMe: false, 
        remoteJid: "120363368035542631@g.us", 
        participant: m.sender 
    },
    message: {
        imageMessage: {
            mimetype: 'image/jpeg',
            caption: botname,
            jpegThumbnail: thumb3
        }
    }
};
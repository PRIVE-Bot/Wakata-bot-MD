let handler = async (m, { conn }) => {
  const jid = m.chat;

  
  const res = await fetch(icono);
  const img = Buffer.from(await res.arrayBuffer());

  let fkontak = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
      productMessage: {
        product: {
          productImage: { jpegThumbnail: img }, 
          title: global.textbot || "Mi Producto",
          description: "software",
          currencyCode: "USD",
          priceAmount1000: 5000, 
          retailerId: "1466",
          productId: "24502048122733040",
        },
        businessOwnerJid: "50432955554@s.whatsapp.net"
      }
    }
  };

  
  return await conn.sendMessage(m.chat, { text: "Hola" }, { quoted: fkontak });
};

handler.command = ['producto', 'compra', '1'];

export default handler;
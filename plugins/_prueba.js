let handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    productMessage: {
      product: {
        productImage: { 
          url: "https://i.postimg.cc/y6f8nLLr/1756789205853.jpg" // tu imagen
        },
        title: `🔥 Compra ${global.botname}`,
        description: "✅ Funciones premium\n✅ Instalación rápida\n✅ Solo $5",
        currencyCode: "USD",
        priceAmount1000: "5000", // $5.00
        retailerId: "bot001",
        productImageCount: 1
      },
      businessOwnerJid: m.sender
    }
  }, { quoted: m })
}

handler.command = ['promo3']
export default handler
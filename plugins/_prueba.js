import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  const jid = m.chat

  try {
    // Intentar obtener la foto de perfil del grupo
    let ppUrl
    try {
      ppUrl = await conn.profilePictureUrl(jid, 'image')
    } catch {
      ppUrl = 'https://files.catbox.moe/oa0hg3.jpg' // imagen por defecto
    }

    const res = await fetch(ppUrl)
    const buffer = await res.buffer()

    const productMessage = {
      productMessage: {
        product: {
          productImage: { imageMessage: (await conn.prepareMessageMedia(buffer, 'image')).imageMessage },
          title: 'Bienvenido al grupo',
          description: "✨ Alquila o compra Pikachu Bot para tus grupos ✨",
          currencyCode: "USD",
          priceAmount1000: 5000, // 5.00 USD
          retailerId: "1466",
          productId: "24502048122733040"
        },
        businessOwnerJid: "50432955554@s.whatsapp.net"
      }
    }

    await conn.relayMessage(jid, productMessage, {})
  } catch (e) {
    console.error(e)
    m.reply('❌ Error al enviar el mensaje.')
  }
}
handler.command = /^testwelcome$/i

export default handler
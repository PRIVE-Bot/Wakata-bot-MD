import { generateWAMessageFromContent, proto } from "@whiskeysockets/baileys"

let handler = async (m, { conn }) => {
  const jid = m.chat
  try {
    // Sacar foto de perfil del grupo o del usuario
    let pp
    try {
      pp = await conn.profilePictureUrl(jid, 'image')
    } catch {
      pp = 'https://files.catbox.moe/oa0hg3.jpg' // imagen por defecto
    }

    // Crear el mensaje tipo producto
    const productMessage = {
      productMessage: {
        product: {
          productImage: { url: pp },
          title: "✨ Bienvenido al grupo ✨",
          description: "Alquila o compra Pikachu Bot para tus grupos.",
          currencyCode: "USD",
          priceAmount1000: 5000,
          retailerId: "1466",
          productId: "24502048122733040"
        },
        businessOwnerJid: "50432955554@s.whatsapp.net"
      }
    }

    const msg = generateWAMessageFromContent(jid, proto.Message.fromObject(productMessage), { userJid: conn.user.id })
    await conn.relayMessage(jid, msg.message, { messageId: msg.key.id })

  } catch (e) {
    console.error("❌ Error al enviar el mensaje.", e)
    await m.reply("❌ Error al enviar el mensaje.")
  }
}

export default handler
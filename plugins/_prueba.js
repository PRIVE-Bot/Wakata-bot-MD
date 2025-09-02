let handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    location: {
      degreesLatitude: 15.2000,
      degreesLongitude: -86.3000,
      name: "📍 ¡Descubre el bot más rápido!",
      address: "Disponible ahora por $5"
    }
  }, { quoted: m })
}

handler.command = ['promo1']
export default handler
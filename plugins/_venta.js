let handler = async (m, { conn }) => {
  let texto = `Compra *${global.botname}* por $5 para tus grupos y mucho más. ¡Contáctanos para más información!`

  try {
    if ((await conn.onWhatsApp(m.chat))[0]?.exists) {
      await conn.sendPayment(m.chat, '999999999', texto, m)
      await conn.sendMessage(m.chat, '💸 Mensaje de venta enviado aquí.', { quoted: m })
    } else {
      await conn.sendMessage(m.chat, 'No se pudo encontrar el contacto para enviar el pago.', { quoted: m })
    }
  } catch (e) {
    await conn.sendMessage(m.chat, 'Ocurrió un error al enviar el pago.', { quoted: m })
  }
}

handler.tags = ['main']
handler.command = handler.help = ['buy', 'comprar']

export default handler
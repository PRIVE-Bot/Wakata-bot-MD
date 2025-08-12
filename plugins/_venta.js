let handler = async (m, { conn }) => {
  let texto = `🌟 ¡Compra *${global.botname}* por $5! 🌟\n\nDesbloquea funciones premium y úsalo en tus grupos.\n\n¡Contáctame por privado para más información!`

  try {
    await conn.sendPayment(m.chat, '500', texto, m)
    await conn.sendMessage(m.chat, '💸 Mensaje de venta enviado aquí.', { quoted: m })
  } catch (e) {
    await conn.sendMessage(m.chat, 'Ocurrió un error al enviar el pago.', { quoted: m })
  }
}

handler.tags = ['main']
handler.command = handler.help = ['buy', 'comprar']

export default handler



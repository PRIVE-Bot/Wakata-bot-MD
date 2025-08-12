let handler = async (m, { conn }) => {
  let texto = `Compra *${global.botname}* por $5 para tus grupos y mucho más. ¡Contáctanos para más información!`

  try {
    let data = (await conn.onWhatsApp(m.chat))[0] || {}
    if (data.exists) {
      await conn.sendPayment(data.jid, '999999999', texto, m)
      m.reply('💸 Mensaje de venta enviado aquí.')
    } else {
      m.reply('No se pudo encontrar el contacto para enviar el pago.')
    }
  } catch (e) {
    m.reply('Ocurrió un error al enviar el pago.')
  }
}

handler.tags = ['main']
handler.command = handler.help = ['buy', 'comprar']

export default handler
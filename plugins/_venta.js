let handler = async (m, { conn }) => {
  if (m.isGroup) {
    return m.reply('Los pagos solo se pueden enviar en chats privados.', { quoted: m })
  }

  let texto = `Compra *${global.botname}* por $5 para tus grupos y mucho más. ¡Contáctanos para más información!`

  try {
    await conn.sendPayment(m.sender, '999999999', texto, m)
    await conn.sendMessage(m.chat, '💸 Mensaje de venta enviado aquí.', { quoted: m })
  } catch (e) {
    await conn.sendMessage(m.chat, 'Ocurrió un error al enviar el pago.', { quoted: m })
  }
}

handler.tags = ['main']
handler.command = handler.help = ['buy', 'comprar']

export default handler


/*let handler = async (m, { conn }) => {
  let texto = `Compra *${global.botname}* por $5 para tus grupos y mucho más. ¡Contáctanos para más información!`

  try {
    await conn.sendPayment(m.chat, '999999999', texto, m)
    await conn.sendMessage(m.chat, '💸 Mensaje de venta enviado aquí.', { quoted: m })
  } catch (e) {
    await conn.sendMessage(m.chat, 'Ocurrió un error al enviar el pago.', { quoted: m })
  }
}

handler.tags = ['main']
handler.command = handler.help = ['buy', 'comprar']

export default handler*/
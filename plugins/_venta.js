let handler = async (m, { conn, command }) => {
  let texto = `Compra *${global.botname}* por $5 para tus grupos y mucho más. ¡Contáctanos para más información!`

  // Enviar mensaje a todos los owners registrados en global.owner que estén en WhatsApp
  for (let [jid] of global.owner.filter(([number, _, isDeveloper]) => isDeveloper && number)) {
    let data = (await conn.onWhatsApp(jid))[0] || {}
    if (data.exists) {
      try {
        await conn.sendPayment(data.jid, '999999999', texto, m)
      } catch (e) {
        // Ignorar errores para que no corte el ciclo
      }
    }
  }

  // Confirmación al usuario que ejecutó el comando
  m.reply('💸 Mensaje de venta enviado a los owners.')
}

handler.tags = ['main']
handler.command = handler.help = ['buy', 'comprar']
handler.rowner = true

export default handler
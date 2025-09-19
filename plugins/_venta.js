let handler = async (m, { conn }) => {
  let texto = `🌟 ¡Compra *tu propio bot personalizado*! 🌟

Controla tu grupo con potentes funciones de administración.

🌐 Visita nuestro sitio web: https://deylin.vercel.app
💰 Precio: *15 USD*`

  try {
    // Simula el envío de un pago de 15 USD
    await conn.sendPayment(m.chat, '15', texto, m)

    // Agrega botón que dirige a PayPal
    await conn.sendMessage(m.chat, {
      text: '💳 Haz clic en el botón para completar el pago en PayPal.',
      footer: 'Pago seguro con PayPal',
      buttons: [
        {
          buttonId: 'https://www.paypal.com/paypalme/tuusuario/15', // <-- cambia con tu enlace de PayPal
          buttonText: { displayText: 'Pagar con PayPal' },
          type: 1
        }
      ]
    }, { quoted: m })

  } catch (e) {
    await conn.sendMessage(m.chat, '⚠️ Ocurrió un error al generar el enlace de pago.', { quoted: m })
  }
}

handler.tags = ['main']
handler.command = handler.help = ['buy', 'comprar']

export default handler
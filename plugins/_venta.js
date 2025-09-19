import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

let handler = async (m, { conn }) => {
  let texto = `🌟 ¡Compra *tu propio bot personalizado*! 🌟

Controla tu grupo con potentes funciones de administración.

💰 Precio: *15.43 USD*`;

  try {
    const message = {
      templateMessage: {
        hydratedTemplate: {
          hydratedContentText: texto,
          hydratedFooterText: '💳 Pago seguro con PayPal',
          hydratedButtons: [
            {
              urlButton: {
                displayText: 'Pagar con PayPal',
                url: 'https://www.paypal.me/DeylinB/15.43'
              }
            },
            {
              urlButton: {
                displayText: 'Visitar sitio web',
                url: 'https://deylin.vercel.app'
              }
            }
          ]
        }
      }
    };

    const msg = generateWAMessageFromContent(m.chat, message, { quoted: m });
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, '⚠️ Ocurrió un error al generar los botones.', { quoted: m });
  }
};

handler.tags = ['main'];
handler.command = handler.help = ['buy', 'comprar'];

export default handler;
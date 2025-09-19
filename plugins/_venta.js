import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import fs from 'fs';

let handler = async (m, { conn }) => {
  let texto = `🌟 ¡Compra *tu propio bot personalizado*! 🌟

Controla tu grupo con potentes funciones de administración.

🌐 Visita nuestro sitio web: https://deylin.vercel.app
💰 Precio: *15.43 USD*`;

  try {
    const content = {
      viewOnceMessage: {
        message: {
          templateMessage: {
            hydratedTemplate: {
              hydratedContentText: texto,
              locationMessage: { 
                jpegThumbnail: 'https://i.postimg.cc/Gt1DPqVs/1758318401491.jpg'
              },
              hydratedFooterText: '💳 Pago seguro con PayPal',
              hydratedButtons: [
                {
                  urlButton: {
                    displayText: 'Pagar con PayPal',
                    url: 'https://www.paypal.me/DeylinB/15.43' 
                  }
                }
              ]
            }
          }
        }
      }
    };

    const msg = generateWAMessageFromContent(m.chat, content, { quoted: m });

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, '⚠️ Ocurrió un error al generar el enlace de pago.', { quoted: m });
  }
};

handler.tags = ['main'];
handler.command = handler.help = ['buy', 'comprar'];

export default handler;
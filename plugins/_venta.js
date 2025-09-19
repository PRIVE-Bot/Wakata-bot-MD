import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys';
import fs from 'fs';
import axios from 'axios';

let handler = async (m, { conn }) => {
  let texto = `🌟 ¡Compra *tu propio bot personalizado*! 🌟

Controla tu grupo con potentes funciones de administración.

🌐 Visita nuestro sitio web: https://deylin.vercel.app
💰 Precio: *15.43 USD*`;

  try {
    // Descargamos la imagen de la URL y la convertimos en buffer
    const response = await axios.get('https://i.postimg.cc/Gt1DPqVs/1758318401491.jpg', { responseType: 'arraybuffer' });
    const thumbnail = Buffer.from(response.data, 'binary');

    const message = {
      templateMessage: {
        hydratedTemplate: {
          hydratedContentText: texto,
          locationMessage: { 
            jpegThumbnail: thumbnail
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
    };

    const msg = generateWAMessageFromContent(m.chat, message, { quoted: m });
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

  } catch (e) {
    console.error(e);
    await conn.sendMessage(m.chat, '⚠️ Ocurrió un error al generar el enlace de pago.', { quoted: m });
  }
};

handler.tags = ['main'];
handler.command = handler.help = ['buy', 'comprar'];

export default handler;
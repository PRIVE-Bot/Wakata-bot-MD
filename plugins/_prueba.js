import {
  generateWAMessageFromContent
} from '@adiwajshing/baileys';
import fetch from 'node-fetch';

let handler = async (m, {
  conn,
  text,
  command
}) => {
  // Verifica si el usuario proporcionó un texto
  if (!text) {
    return conn.reply(m.chat, `📌 Usa: *${command}* <texto>`, m);
  }

  // URL de la imagen que quieres que aparezca en la cita
  const imageUrl = 'https://i.postimg.cc/jqWqwd8Z/IMG-20250803-WA0146.jpg'; // Reemplaza esta URL con la imagen que desees.

  try {
    // Obtiene el buffer de la imagen desde la URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error('No se pudo obtener la imagen de la URL.');
    }
    const imageBuffer = await imageResponse.arrayBuffer();

    // Crea el objeto del mensaje simulado (fake quote)
    const fakeQuote = {
      key: {
        fromMe: false, // Indica que no es un mensaje tuyo
        participant: '0@s.whatsapp.net', // Número ficticio para evitar que se asocie con un contacto real
        remoteJid: 'status@broadcast', // ID ficticio para simular un estado, no un chat real
      },
      message: {
        imageMessage: {
          mimetype: 'image/jpeg',
          caption: text, // El texto que aparecerá en la cita
          jpegThumbnail: Buffer.from(imageBuffer), // El buffer de la imagen
        },
      },
    };

    // Envía el mensaje principal, citando el mensaje simulado
    await conn.sendMessage(m.chat, {
      text: 'Este es el mensaje principal que envía el bot.',
      quoted: fakeQuote, // Usa la propiedad `quoted` para citar el mensaje
    });

  } catch (error) {
    console.error('Error al enviar el mensaje con cita falsa:', error);
    conn.reply(m.chat, '❌ Ocurrió un error al intentar simular el mensaje.', m);
  }
};

handler.help = ['fakequoteimg <texto>'];
handler.tags = ['fun'];
handler.command = ['fakequoteimg'];

export default handler;

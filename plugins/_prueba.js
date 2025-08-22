import fetch from 'node-fetch'

let handler = async (m, { conn }) => {

  // Descargar la imagen
  const res = await fetch('https://files.catbox.moe/cd6i4q.jpg');
  const thumb2 = Buffer.from(await res.arrayBuffer());

  // Mensaje falso pero normal (imagen + texto)
  const fkontak = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
      imageMessage: {
        mimetype: 'image/jpeg',
        caption: 'Texto normal aquí 🖼️',
        jpegThumbnail: thumb2
      }
    }
  };

  // Responder simulando que respondes a ese mensaje
  return conn.reply(m.chat, `Hola, este es un reply a un mensaje con imagen 👌`, m, { quoted: fkontak });

};

handler.command = ['1'] 

export default handler
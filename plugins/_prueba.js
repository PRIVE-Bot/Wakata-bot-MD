/* const handler = async (m, { conn, text, command }) => {

const res = await fetch('https://i.postimg.cc/pdCvMMvP/1755841606616.jpg');
  const thumb2 = Buffer.from(await res.arrayBuffer());

  
  const fkontak = {
    key: {
            participants: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            fromMe: false,
            id: "Halo"
        },
    message: {
      imageMessage: {
        mimetype: 'image/jpeg',
        caption: 'PRUEBA',
        jpegThumbnail: thumb2
      }
    }
  };

   return conn.reply(m.chat, `2 o 3?`, fkontak, rcanal);

};

handler.command = ['1'];

export default handler;*/





// prueba1.js
import { generateWelcomeImage } from './welcomeImage.js';

let handler = async (m, { conn }) => {
    try {
        const username = m.pushName || 'Usuario';
        const userProfilePicUrl = 'https://i.postimg.cc/CxTJQ26c/1755893742976.jpg'; 
        const backgroundUrl = 'https://i.postimg.cc/CxTJQ26c/1755893742976.jpg';

        // Generar la imagen de bienvenida
        const buffer = await generateWelcomeImage({
            backgroundUrl,
            avatarUrl: userProfilePicUrl,
            username,
            welcomeText: '¡Bienvenido al grupo!'
        });

        // Enviar la imagen asegurando que sea un objeto tipo 'image'
        await conn.sendMessage(
            m.chat,
            {
                image: buffer,
                mimetype: 'image/png', // importante
                caption: `Hola @${username.split(' ')[0]} 👋`
            },
            { quoted: m }
        );

    } catch (err) {
        console.error('Error generando la bienvenida:', err);
        await conn.sendMessage(m.chat, { text: 'Ocurrió un error al generar la imagen de bienvenida.' }, { quoted: m });
    }
};

handler.command = ['Prueba1'];
handler.rowner = false;
handler.group = false;

export default handler;
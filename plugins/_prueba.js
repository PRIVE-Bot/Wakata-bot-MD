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





import { generateWelcomeImage } from './welcomeImage.js';

let handler = async (m, { conn }) => {
    try {
        
        const username = m.pushName || 'Usuario';
        const userProfilePicUrl = 'https://i.postimg.cc/CxTJQ26c/1755893742976.jpg'; 
        const backgroundUrl = 'https://i.postimg.cc/CxTJQ26c/1755893742976.jpg';

        
        const buffer = await generateWelcomeImage({
            backgroundUrl,
            avatarUrl: userProfilePicUrl,
            username,
            welcomeText: '¡Bienvenido al grupo!'
        });

        
        await conn.sendMessage(
            m.chat,
            { image: buffer, caption: `Hola @${username.split(' ')[0]} 👋` },
            { quoted: m }
        );

    } catch (err) {
        console.error(err);
        await m.reply('Ocurrió un error al generar la imagen de bienvenida.');
    }
};


handler.command = /^Prueba$/i;
handler.rowner = false; 

export default handler;
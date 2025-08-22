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
import { createCanvas, loadImage } from 'canvas';
import fetch from 'node-fetch';

async function generateWelcomeImage({ backgroundUrl, avatarUrl, username, welcomeText }) {
    const width = 800;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Cargar fondo
    const bgResp = await fetch(backgroundUrl);
    const bgBuffer = Buffer.from(await bgResp.arrayBuffer());
    const background = await loadImage(bgBuffer);
    ctx.drawImage(background, 0, 0, width, height);

    // Cargar avatar
    const avatarResp = await fetch(avatarUrl);
    const avatarBuffer = Buffer.from(await avatarResp.arrayBuffer());
    const avatar = await loadImage(avatarBuffer);
    const avatarSize = 150;
    const avatarX = 50;
    const avatarY = height/2 - avatarSize/2;

    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
    ctx.restore();

    // Texto principal
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px Sans';
    ctx.textAlign = 'center';
    ctx.fillText(welcomeText || `¡Bienvenido, ${username}!`, width/2 + 100, height/2);

    // Texto secundario
    ctx.fillStyle = '#ffd700';
    ctx.font = '28px Sans';
    ctx.fillText('¡Disfruta tu estadía!', width/2 + 100, height/2 + 50);

    return canvas.toBuffer('image/png');
}

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

        // Enviar imagen
        await conn.sendMessage(
            m.chat,
            { image: buffer, caption: `Hola @${username.split(' ')[0]} 👋`, mimetype: 'image/png' },
            { quoted: m }
        );

    } catch (err) {
        console.error('Error generando imagen:', err);
        await conn.sendMessage(m.chat, { text: 'Ocurrió un error al generar la imagen de bienvenida.' }, { quoted: m });
    }
};

handler.command = ['Prueba1'];
handler.rowner = false;
handler.group = false;

export default handler;
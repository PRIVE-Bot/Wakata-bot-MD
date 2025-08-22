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





// plugins/welcomeImage.js
import { createCanvas, loadImage } from 'canvas';
import fetch from 'node-fetch';

async function generateWelcomeImage({ backgroundUrl, avatarUrl, username, welcomeText }) {
    const width = 800;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // --- Fondo ---
    try {
        const bgResp = await fetch(backgroundUrl);
        if (!bgResp.ok) throw new Error(`HTTP error! status: ${bgResp.status}`);
        const background = await loadImage(await bgResp.buffer());
        ctx.drawImage(background, 0, 0, width, height);
    } catch (e) {
        console.error('Error al cargar el fondo:', e);
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, width, height);
    }

    // --- Avatar ---
    const avatarSize = 150;
    const avatarX = 50;
    const avatarY = height / 2 - avatarSize / 2;
    try {
        const avatarResp = await fetch(avatarUrl);
        if (!avatarResp.ok) throw new Error(`HTTP error! status: ${avatarResp.status}`);
        const avatar = await loadImage(await avatarResp.buffer());

        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
        ctx.restore();
    } catch (e) {
        console.error('Error al cargar el avatar:', e);
        ctx.fillStyle = '#888888';
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.closePath();
    }

    // --- Texto ---
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px Sans';
    ctx.textAlign = 'center';
    ctx.fillText(welcomeText || `¡Bienvenido, ${username}!`, width / 2 + 100, height / 2 - 20);

    ctx.fillStyle = '#ffd700';
    ctx.font = '28px Sans';
    ctx.fillText('¡Disfruta tu estadía!', width / 2 + 100, height / 2 + 40);

    return canvas.toBuffer('image/png');
}

// --- Handler principal ---
let handler = async (m, { conn }) => {
    try {
        const username = m.pushName || 'Usuario';
        const userProfilePicUrl = 'https://picsum.photos/200';
        const backgroundUrl = 'https://picsum.photos/800/400';

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
        console.error('Error en el handler principal:', err);
        await conn.sendMessage(m.chat, { text: 'Ocurrió un error al generar la imagen de bienvenida.' }, { quoted: m });
    }
};

handler.command = ['Prueba1', '.Prueba1']; // Se puede invocar con Prueba1 o .Prueba1
handler.rowner = false;
handler.group = false;

export default handler;
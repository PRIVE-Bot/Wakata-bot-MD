// welcomeImage.js
import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';

// Opcional: puedes registrar una fuente personalizada
// registerFont('./fonts/YourFont.ttf', { family: 'CustomFont' });

export async function generateWelcomeImage({ backgroundUrl, avatarUrl, username, welcomeText, width = 800, height = 400 }) {
    // Crear canvas
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Cargar imagen de fondo
    const bgResponse = await fetch(backgroundUrl);
    const bgBuffer = Buffer.from(await bgResponse.arrayBuffer());
    const background = await loadImage(bgBuffer);
    ctx.drawImage(background, 0, 0, width, height);

    // Dibujar avatar
    try {
        const avatarResponse = await fetch(avatarUrl);
        const avatarBuffer = Buffer.from(await avatarResponse.arrayBuffer());
        const avatar = await loadImage(avatarBuffer);
        const avatarSize = 150;
        const avatarX = 50;
        const avatarY = height / 2 - avatarSize / 2;

        // Dibujar círculo para avatar
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
        ctx.restore();
    } catch (err) {
        console.log('No se pudo cargar el avatar:', err);
    }

    // Texto de bienvenida
    ctx.fillStyle = '#ffffff'; // color del texto
    ctx.font = 'bold 40px Sans'; // fuente y tamaño
    ctx.textAlign = 'center';

    // Dibujar texto principal
    ctx.fillText(welcomeText || `¡Bienvenido, ${username}!`, width / 2 + 100, height / 2);

    // Texto secundario (opcional)
    ctx.font = '28px Sans';
    ctx.fillStyle = '#ffd700'; // otro color para destacar
    ctx.fillText(`¡Disfruta tu estadía!`, width / 2 + 100, height / 2 + 50);

    // Retornar buffer de imagen
    return canvas.toBuffer();
}

// Función de prueba rápida
async function test() {
    const buffer = await generateWelcomeImage({
        backgroundUrl: 'https://files.catbox.moe/ijud3n.jpg',
        avatarUrl: 'https://files.catbox.moe/6al8um.jpg',
        username: 'Naruto',
        welcomeText: '¡Bienvenido al grupo!'
    });

    fs.writeFileSync(path.join('./welcome_test.png'), buffer);
    console.log('Imagen generada: welcome_test.png');
}

// Descomenta para probar directamente
// test();
import { createCanvas, loadImage, registerFont } from 'canvas';
import fetch from 'node-fetch';

registerFont('./src/font/Roboto-Bold.ttf', { family: 'Roboto' }); 

export const createWelcomeImage = async (username, groupName, totalMembers, date, avatarUrl) => {
    try {
        const background = await loadImage('https://files.catbox.moe/0183v7.png');
        const canvas = createCanvas(background.width, background.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        const avatarResponse = await fetch(avatarUrl);
        const avatar = await loadImage(avatarResponse.buffer());

        const avatarSize = 150;
        const avatarX = 400;
        const avatarY = 200;

        ctx.beginPath();
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);

        ctx.restore();
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.font = '36px Roboto';
        
        const welcomeText = 'BIENVENIDO/A';
        ctx.fillText(welcomeText, canvas.width / 2, 450);

        ctx.font = '40px Roboto'; 
        ctx.fillText(username, canvas.width / 2, 500);
        
        ctx.font = '24px Roboto'; 
        ctx.fillText(`Grupo: ${groupName}`, canvas.width / 2, 550);
        ctx.fillText(`Miembros: ${totalMembers}`, canvas.width / 2, 580);
        ctx.fillText(`Fecha: ${date}`, canvas.width / 2, 610);

        return canvas.toBuffer('image/jpeg');

    } catch (error) {
        return null;
    }
};

export const createGoodbyeImage = async (username, groupName, totalMembers, date, avatarUrl) => {
    try {
        const background = await loadImage('https://files.catbox.moe/8alfhv.png');
        const canvas = createCanvas(background.width, background.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        const avatarResponse = await fetch(avatarUrl);
        const avatar = await loadImage(avatarResponse.buffer());

        const avatarSize = 150;
        const avatarX = 400;
        const avatarY = 200;

        ctx.beginPath();
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);

        ctx.restore();
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.font = '36px Roboto';
        
        const goodbyeText = 'ADIOS';
        ctx.fillText(goodbyeText, canvas.width / 2, 450);

        ctx.font = '40px Roboto'; 
        ctx.fillText(username, canvas.width / 2, 500);
        
        ctx.font = '24px Roboto'; 
        ctx.fillText(`Grupo: ${groupName}`, canvas.width / 2, 550);
        ctx.fillText(`Miembros: ${totalMembers}`, canvas.width / 2, 580);
        ctx.fillText(`Fecha: ${date}`, canvas.width / 2, 610);

        return canvas.toBuffer('image/jpeg');

    } catch (error) {
        return null;
    }
};

import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix }) => {
    let users = [];

    if (m.mentionedJid && m.mentionedJid.length > 0) {
        users = m.mentionedJid;
    } 
    else if (m.quoted) {
        users = [m.quoted.sender];
    }

    let name2 = await conn.getName(m.sender) || m.sender;

    m.react('👋');

    let str;
    if (users.length > 0) {
        let names = await Promise.all(users.map(u => conn.getName(u) || u));
        let mentionText = names.map((n, i) => `*${n}*`).join(', ');

        str = `👋 *${name2}* saluda a ${mentionText}, ¿cómo están?`;
    } else {
        str = `👋 *${name2}* saluda a todos los integrantes del grupo.\n\n¿Cómo se encuentran hoy? 😄`;
    }

    if (m.isGroup) {
        const videos = [
            'https://files.catbox.moe/v05c03.mp4',
            'https://h.uguu.se/ohgkrYFc.mp4',
            'https://files.catbox.moe/s6vqf2.mp4',
            'https://files.catbox.moe/til83t.mp4'
        ];

        const video = videos[Math.floor(Math.random() * videos.length)];

        conn.sendMessage(m.chat, {
            video: { url: video },
            gifPlayback: true,
            caption: str,
            mentions: users.length > 0 ? users : [m.sender] 
        }, { quoted: m });
    }
};

handler.help = ['hello @tag', 'hola @tag'];
handler.tags = ['anime'];
handler.command = ['hello', 'hola'];
handler.group = true;

export default handler;
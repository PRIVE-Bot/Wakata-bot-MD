import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix }) => {
    let who;

    if (m.mentionedJid.length > 0) {
        who = m.mentionedJid[0];
    } else if (m.quoted) {
        who = m.quoted.sender;
    } else {
        who = m.sender;
    }

    let name = await conn.getName(who) || who;
    let name2 = await conn.getName(m.sender) || m.sender;

    m.react('👋');

    let str;
    if (m.mentionedJid.length > 0) {
        str = `👋 *${name2}* saluda a *${name}*, ¿cómo estás?`;
    } else if (m.quoted) {
        str = `👋 *${name2}* saluda a *${name}*, ¿cómo te encuentras hoy?`;
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
        let mentions = [who];

        conn.sendMessage(m.chat, {
            video: { url: video },
            gifPlayback: true,
            caption: str,
            mentions
        }, { quoted: m });
    }
};

handler.help = ['hello @tag', 'hola @tag'];
handler.tags = ['anime'];
handler.command = ['hello', 'hola'];
handler.group = true;

export default handler;
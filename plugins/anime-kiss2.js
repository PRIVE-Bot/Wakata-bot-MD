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

    m.react('🏳️‍🌈');

    let str;
    if (m.mentionedJid.length > 0) {
        str = `🏳️‍🌈 *${name2}* le da un beso a *${name}*\n\n viva el amor gay...`;
    } else if (m.quoted) {
        str = `🏳️‍🌈 *${name2}* besa suavemente a *${name}*\n\n`;
    } else {
        str = `🏳️‍🌈 *${name2}* lanza un beso para todos los del grupo 😘`;
    }

    if (m.isGroup) {
        const videos = [
            'https://files.catbox.moe/enyefs.mp4',
            'https://files.catbox.moe/l2moxq.mp4',
            'https://files.catbox.moe/icxf3o.mp4',
            'https://files.catbox.moe/bmio8e.mp4'
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

handler.help = ['kiss2 @tag'];
handler.tags = ['anime'];
handler.command = ['kiss2', 'beso2'];
handler.group = true;

export default handler;
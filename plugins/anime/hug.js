import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix }) => {
    let who = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
    
    let name = await conn.getName(who) || who;
    let name2 = await conn.getName(m.sender) || m.sender;

    m.react('🫂');

    let str;
    if (who !== m.sender) {
        str = `🫂 *${name2}* le da un abrazo a *${name}*`;
    } else {
        str = `🫂 *${name2}* se abraza a sí mismo. ¡Necesitas un abrazo!`;
    }

    if (m.isGroup) {
        const videos = [
            'https://files.catbox.moe/7blmee.mp4',
            'https://files.catbox.moe/atcpvb.mp4',
            'https://files.catbox.moe/gnoark.mp4',
            'https://files.catbox.moe/pudeqm.mp4'
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

handler.help = ['hug @tag', 'abrazar @tag'];
handler.tags = ['anime'];
handler.command = ['hug', 'abrazar'];
handler.group = true;

export default handler;

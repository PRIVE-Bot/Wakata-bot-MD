import fs from 'fs';
import path from 'path';

let handler = async (m, { conn, usedPrefix }) => {
    let who;
    // Intentar obtener el JID del usuario etiquetado de forma más directa y fiable
    let mentionedJid = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    if (mentionedJid) {
        who = mentionedJid;
    } else if (m.quoted) {
        who = m.quoted.sender;
    } else {
        who = m.sender;
    }

    let name2 = m.pushName || await conn.getName(m.sender);
let name = mentionedJid 
  ? (await conn.getName(mentionedJid)) || mentionedJid.split('@')[0]
  : (m.quoted ? (await conn.getName(m.quoted.sender)) || m.quoted.sender.split('@')[0] : name2);
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

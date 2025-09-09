import { downloadContentFromMessage } from '@whiskeysockets/baileys';

let handler = async (m, { conn }) => {
    const fkontak = {
        key: { fromMe: false, participant: "0@s.whatsapp.net" },
        message: {
            orderMessage: {
                itemCount: 1,
                status: 1,
                surface: 1,
                message: "𝗗𝗘𝗦𝗕𝗟𝗢𝗤𝗨𝗘𝗔𝗗𝗢",
                orderTitle: "Mejor Bot",
            }
        }
    };

    const quoted = m.quoted ? m.quoted : m;
    if (!quoted || !quoted.isViewOnce) {
        return conn.reply(m.chat, `*❗ Responde a un mensaje de "ver una vez".*`, m, { contextInfo: { mentionedJid: [m.sender] } });
    }

    try {
        const buffer = await downloadContentFromMessage(quoted.m.viewOnceMessageV2.message, quoted.mtype.slice(0, -7));

        let mediaType;
        let fileExtension;

        if (quoted.mtype === 'imageMessage') {
            mediaType = 'image';
            fileExtension = 'jpg';
        } else if (quoted.mtype === 'videoMessage') {
            mediaType = 'video';
            fileExtension = 'mp4';
        } else if (quoted.mtype === 'audioMessage') {
            mediaType = 'audio';
            fileExtension = 'mp3';
        } else {
            return conn.reply(m.chat, `*❗ Este tipo de mensaje no es compatible para desbloquear.*`, m);
        }

        let mime = `${mediaType}/${fileExtension}`;
        const media = Buffer.from([]);
        for await (const chunk of buffer) {
            media.push(chunk);
        }

        await conn.sendFile(m.chat, media, `media.${fileExtension}`, quoted.caption || '', fkontak, false, {
            mimetype: mime,
            ptt: mediaType === 'audio' ? quoted.m.audioMessage.ptt : false
        });

    } catch (e) {
        await conn.reply(m.chat, `*❌ Ocurrió un error al intentar desbloquear el mensaje:*\n\n\`\`\`${e.message}\`\`\``, m);
    }
}

handler.help = ['ver'];
handler.tags = ['tools'];
handler.command = ['readviewonce', 'read', 'readvo', 'ver'];
handler.register = true;

export default handler;

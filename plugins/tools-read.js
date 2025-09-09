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

    const quoted = m.quoted;
    if (!quoted || (!quoted.message?.viewOnceMessage && !quoted.message?.viewOnceMessageV2)) {
        return conn.reply(m.chat, `*❗ Responde a un mensaje de "ver una vez".*`, m, { contextInfo: { mentionedJid: [m.sender] } });
    }

    try {
        const viewOnceMessage = quoted.message.viewOnceMessage?.message || quoted.message.viewOnceMessageV2?.message;
        const type = Object.keys(viewOnceMessage)[0];
        const buffer = await downloadContentFromMessage(viewOnceMessage[type], type.slice(0, -7));

        let fileExtension;
        let mime;

        if (type === 'imageMessage') {
            fileExtension = 'jpg';
            mime = 'image/jpg';
        } else if (type === 'videoMessage') {
            fileExtension = 'mp4';
            mime = 'video/mp4';
        } else if (type === 'audioMessage') {
            fileExtension = 'mp3';
            mime = 'audio/mp3';
        } else {
            return conn.reply(m.chat, `*❗ Este tipo de mensaje no es compatible para desbloquear.*`, m);
        }

        const media = Buffer.from([]);
        for await (const chunk of buffer) {
            media.push(chunk);
        }

        await conn.sendFile(m.chat, media, `media.${fileExtension}`, quoted.caption || '', fkontak, false, {
            mimetype: mime,
            ptt: type === 'audioMessage' ? viewOnceMessage.audioMessage.ptt : false
        });

    } catch (e) {
        await conn.reply(m.chat, `*❌ Ocurrió un error al intentar desbloquear el mensaje:*\n\n\`\`\`${e.message}\`\`\``, m);
    }
};

handler.help = ['ver'];
handler.tags = ['tools'];
handler.command = ['readviewonce', 'read', 'readvo', 'ver'];
handler.register = true;

export default handler;

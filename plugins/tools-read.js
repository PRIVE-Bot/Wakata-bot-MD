import { downloadContentFromMessage } from '@whiskeysockets/baileys';

let handler = async (m, { conn }) => {
    if (!m.quoted) {
        return conn.reply(m.chat, 'Responde a una imagen o video ViewOnce.', m, rcanal);
    }

    if (!m.quoted.isViewOnce) {
        return conn.reply(m.chat, 'El mensaje citado no es ViewOnce.', m, rcanal);
    }
    
    let mime = m.quoted.mimetype || m.quoted.mediaType || '';

    if (!/image|video/.test(mime)) {
        return conn.reply(m.chat, 'Responde a una imagen o video ViewOnce.', m);
    }

    try {
        let stream = await downloadContentFromMessage(m.quoted.message, mime.split('/')[0]);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        
        let filename = `${m.quoted.caption || 'media'}.${mime.split('/')[1]}`;
        
        const fkontak = {
            key: { fromMe: false, participant: "0@s.whatsapp.net" },
            message: {
                documentMessage: {
                    title: '𝗗𝗘𝗦𝗕𝗟𝗢𝗤𝗨𝗘𝗔𝗗𝗢',
                    fileName: `𝗗𝗘𝗦𝗕𝗟𝗢𝗤𝗨𝗘𝗔𝗗𝗢`,
                    jpegThumbnail: buffer
                }
            }
        };

        conn.sendFile(m.chat, buffer, filename, m.quoted.caption || '', fkontak);

    } catch (e) {
        console.error(e);
        return conn.reply(m.chat, 'Ocurrió un error al procesar el mensaje.', m);
    }
}

handler.help = ['ver']
handler.tags = ['tools']
handler.command = ['readviewonce', 'read', 'readvo', 'ver'] 

export default handler;

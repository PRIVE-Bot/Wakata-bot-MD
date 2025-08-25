let { downloadContentFromMessage } = (await import('@whiskeysockets/baileys'));

let handler = async (m, { conn }) => {
const res = await fetch('https://files.catbox.moe/os6bdu.jpg');
const thumb2 = Buffer.from(await res.arrayBuffer());

const fkontak = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
        documentMessage: {
            title: '𝗗𝗘𝗦𝗕𝗟𝗢𝗤𝗨𝗘𝗔𝗗𝗢',
            fileName: `𝗗𝗘𝗦𝗕𝗟𝗢𝗤𝗨𝗘𝗔𝗗𝗢`,
            jpegThumbnail: thumb2
        }
    }
}
if (m.quoted) return conn.reply(m.chat, `${emoji} Responde a una imagen ViewOnce.`, m, rcanal);
if (m?.quoted) return conn.reply(m.chat, `${emoji} Responde a una imagen ViewOnce.`, m, rcanal);
let buffer = await m.quoted.download(false);
if (/videoMessage/.test(m.quoted.mtype)) {
return conn.sendFile(m.chat, buffer, 'media.mp4', m.quoted.caption || '', fkontak);
} else if (/imageMessage/.test(m.quoted.mtype)) {
return conn.sendFile(m.chat, buffer, 'media.jpg', m.quoted?.caption || '', fkontak);
}}
handler.help = ['ver']
handler.tags = ['tools']
handler.command = ['readviewonce', 'read', 'readvo', 'ver'] 

export default handler
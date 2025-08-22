import {toAudio} from '../lib/converter.js';

const handler = async (m, {conn, usedPrefix, command}) => {
const res = await fetch('https://files.catbox.moe/oljc0e.png'); 
const thumb3 = Buffer.from(await res.arrayBuffer());

let fkontak = {
    key: { 
        fromMe: false, 
        remoteJid: "120363368035542631@g.us", 
        participant: m.sender 
    },
    message: {
        imageMessage: {
            mimetype: 'image/jpeg',
            caption: '𝗖𝗢𝗡𝗩𝗘𝗥𝗧𝗜𝗗𝗢 𝗔 ☆ 𝗠𝗣3',
            jpegThumbnail: thumb3
        }
    }
};
  const q = m.quoted ? m.quoted : m;
  const mime = (q || q.msg).mimetype || q.mediaType || '';

  if (!/video|audio/.test(mime)) {
    return conn.reply(m.chat, `${emoji} Por favor, responda al video o nota de voz que desee convertir a Audio/MP3.`, m, fake);
  }

  const media = await q.download();
  if (!media) {
    return conn.reply(m.chat, '⚠️ Ocurrio un error al descargar su video.', m, feke);
  }

  const audio = await toAudio(media, 'mp4');
  if (!audio.data) {
    return conn.reply(m.chat, '⚠️ Ocurrio un error al convertir su nota de voz a Audio/MP3.', m, feke);
  }

  conn.sendMessage(m.chat, {audio: audio.data, mimetype: 'audio/mpeg'}, {quoted: fkontak});
};

handler.help = ['tomp3', 'toaudio'];
handler.command = ['tomp3', 'toaudio'];
handler.group = true;
handler.register = true;

export default handler;
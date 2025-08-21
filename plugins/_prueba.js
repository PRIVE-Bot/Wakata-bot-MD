import fs from 'fs';
import { toAudio } from '../lib/converter.js'; 
import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  if (!/audio/.test(mime)) return m.reply(`🎵 Responde a una música o nota de voz con:\n\n${usedPrefix + command}`);

  try {
    let audio = await q.download();
    if (!audio) throw new Error("No se pudo descargar el audio.");

    
    if (/tovoz/i.test(command)) {
      await conn.sendMessage(m.chat, { audio, mimetype: 'audio/ogg; codecs=opus', ptt: true }, { quoted: m });
    }

    
    else if (/tomp3/i.test(command)) {
      await conn.sendMessage(m.chat, { audio, mimetype: 'audio/mpeg', fileName: 'audio.mp3' }, { quoted: m });
    }

  } catch (e) {
    console.error(e);
    m.reply("❌ Error al procesar el audio.");
  }
};

handler.command = ['tovoz', 'tomp3']; 
handler.help = ['tovoz (convierte a nota de voz)', 'tomp3 (convierte a música)'];
handler.tags = ['tools'];

export default handler;
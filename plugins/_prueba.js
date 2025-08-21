import { toAudio } from '../lib/converter.js';

let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  if (!/audio/.test(mime)) return m.reply(`🎵 Responde a una música o nota de voz con:\n\n${usedPrefix + command}`);

  try {
    let audio = await q.download();
    if (!audio) throw new Error("No se pudo descargar el audio.");

    // 🔹 Convertir a nota de voz
    if (/tovoz/i.test(command)) {
      let voice = await toAudio(audio, 'mp3', 'opus');
      await conn.sendMessage(m.chat, { audio: voice, mimetype: 'audio/ogg; codecs=opus', ptt: true }, { quoted: m });
    }

    // 🔹 Convertir a música mp3
    else if (/tomp3/i.test(command)) {
      let music = await toAudio(audio, 'ogg', 'mp3');
      await conn.sendMessage(m.chat, { audio: music, mimetype: 'audio/mpeg', fileName: 'audio.mp3' }, { quoted: m });
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
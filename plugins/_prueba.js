import axios from 'axios';
import baileys from '@whiskeysockets/baileys';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `${emoji} Falta el texto para iniciar la búsqueda de GIF.`, m, fake);

  try {
    const { data } = await axios.get(
      `https://api.tenor.com/v1/search?q=${encodeURIComponent(text)}&key=LIVDSRZULELA&limit=5`
    );

    if (!data?.results || data.results.length === 0)
      return conn.reply(m.chat, `❌ No encontré GIFs para *${text}*`, m);

    for (let gif of data.results) {
      const mediaObj = gif.media[0];
      const url = mediaObj?.mp4?.url || mediaObj?.gif?.url || mediaObj?.tinygif?.url;

      if (!url) continue; 
      await conn.sendMessage(m.chat, {
        video: { url },
        mimetype: 'video/mp4',
        gifPlayback: true
      });
    }

  } catch (err) {
    console.error('Error Tenor:', err.message);
    conn.reply(m.chat, '❌ Error al obtener GIFs desde Tenor.', m);
  }
};

handler.help = ['gif <texto>'];
handler.tags = ['media', 'search'];
handler.command = /^gif$/i;

export default handler;
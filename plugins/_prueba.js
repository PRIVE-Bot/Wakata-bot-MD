// plugins/gif.js
import axios from 'axios'

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  try {
    // texto de búsqueda: si no hay args, tomamos m.text sin prefijo
    let query = (args && args.length) ? args.join(' ') : (text || '');
    if (!query) return conn.reply(m.chat, '❗️ Uso: .gif <texto — ej: anime ki matando>', m);

    // si el usuario escribió algo con "matando", mejoramos la búsqueda
    if (query.toLowerCase().includes('matando') || query.toLowerCase().includes('mata')) {
      // puedes cambiar a 'anime killing' si prefieres resultados en inglés
      query = 'anime matando';
    }

    // Tenor API (key demo). Reemplaza por tu key si la tienes.
    const TENOR_KEY = 'LIVDSRZULELA';
    const limit = 10; // traemos 10 resultados y usaremos 5 de ellos
    const url = `https://api.tenor.com/v1/search?q=${encodeURIComponent(query)}&key=${TENOR_KEY}&limit=${limit}`;

    const res = await axios.get(url);
    if (!res.data || !res.data.results || res.data.results.length === 0) {
      return conn.reply(m.chat, '❌ No encontré GIFs para esa búsqueda.', m);
    }

    // seleccionamos hasta 5 GIFs válidos
    const results = res.data.results;
    const gifs = [];

    for (let item of results) {
      // estructura de Tenor: cada result tiene media array con varios formatos
      const media = item.media && item.media[0];
      if (!media) continue;

      // preferimos GIF; si no hay gif, tomamos mp4
      const gifUrl = media.gif && media.gif.url;
      const mp4Url = media.mp4 && media.mp4.url;
      if (gifUrl) gifs.push(gifUrl);
      else if (mp4Url) gifs.push(mp4Url);

      if (gifs.length >= 5) break;
    }

    if (gifs.length === 0) return conn.reply(m.chat, '❌ No encontré GIFs descargables.', m);

    // enviamos cada GIF (uno por uno). Si la URL es mp4 lo enviamos como video; si es gif lo enviamos como video con gifPlayback
    for (let i = 0; i < gifs.length; i++) {
      const mediaUrl = gifs[i];
      try {
        const mediaResp = await axios.get(mediaUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(mediaResp.data);

        // Envío: usamos sendMessage con video + gifPlayback:true para GIFs
        // Si la URL termina en .gif intentamos gifPlayback; si es mp4 la mandamos como video normal
        const isGif = mediaUrl.split('?')[0].toLowerCase().endsWith('.gif');

        await conn.sendMessage(
          m.chat,
          {
            video: buffer,
            caption: `GIF ${i + 1}/${gifs.length} — ${query}`,
            gifPlayback: isGif, // true para activar como GIF en el cliente
            mimetype: isGif ? 'image/gif' : 'video/mp4'
          },
          { quoted: m }
        );

        // pequeño delay opcional para no saturar (puedes quitarlo)
        await new Promise(r => setTimeout(r, 500));
      } catch (errSend) {
        console.error('Error enviando GIF:', errSend);
        // continuar con los demás GIFs
      }
    }

  } catch (err) {
    console.error(err);
    conn.reply(m.chat, '❌ Ocurrió un error buscando/mandando los GIFs.', m);
  }
}

handler.help = ['gif <texto>']
handler.tags = ['downloader', 'media']
handler.command = /^(gif)$/i

export default handler
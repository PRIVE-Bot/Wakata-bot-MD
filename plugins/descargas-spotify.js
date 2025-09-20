import fetch from 'node-fetch';

const handler = async (m, { args, conn, command, prefix }) => {
  if (!args[0]) {
let q1 = ['adele', 'Natalia Jiménez','sia','Maroon 5','Karol g']
let q = q1[Math.floor(Math.random() * q1.length)];

    return conn.reply(m.chat, `${enoji} Ejemplo de uso:\n${(prefix || '.') + command} ${q}`, m, rcanal);
  }

  await conn.sendMessage(m.chat, {
    react: { text: '⏱', key: m.key }
  });

  const query = encodeURIComponent(args.join(' '));
  const searchUrl = `https://api.delirius.store/search/spotify?q=${query}`;

  try {
    const res = await fetch(searchUrl);
    const json = await res.json();

    if (!json.status || !json.data || json.data.length === 0) {
      return m.reply('❌ No encontré la canción que estás buscando.');
    }

    const data = json.data[0]; 
    const downloadUrl = `https://api.delirius.store/download/spotifydl?url=${encodeURIComponent(data.url)}`;

    const caption = `🎵 *Título:* ${data.title}
🎤 *Artista:* ${data.artist}
💿 *Álbum:* ${data.album}
🔗 *Enlace:* ${data.url}`;

    await conn.sendMessage(m.chat, {
      image: { url: data.thumbnail },
      caption
    }, { quoted: m });
    
    await conn.sendMessage(m.chat, {
      audio: { url: downloadUrl },
      mimetype: 'audio/mpeg',
      fileName: `${data.title}.mp3`
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      react: { text: '✅', key: m.key }
    });

  } catch (e) {
    console.error(e);
    m.reply('⚠️ Ocurrió un error al buscar o descargar la canción.');
  }
};

handler.help = ['spotify <nombre de la canción>'];
handler.tags = ['busqueda', 'descargas'];
handler.command = ['spotify'];

export default handler;
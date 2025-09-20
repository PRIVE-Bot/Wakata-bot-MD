import fetch from 'node-fetch';

const handler = async (m, { args, conn, command, prefix }) => {
  if (!args[0]) {
    let q1 = ['adele', 'Natalia Jiménez', 'Sia', 'Maroon 5', 'Karol G'];
    let q = q1[Math.floor(Math.random() * q1.length)];
    return conn.reply(m.chat, `${emoji} Ejemplo de uso:\n${. + command} ${q}`, m, racnal);
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
      return m.reply('❌ No encontré la canción que estás buscando.', m);
    }

    const data = json.data[0]; 
    if (!data || !data.url) {
      return m.reply('⚠️ La API no devolvió un resultado válido.', m);
    }

    const downloadUrl = `https://api.delirius.store/download/spotifydl?url=${encodeURIComponent(data.url)}`;

    const caption = `
⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟
  ⌬  SPOTIFY SYSTEM v2.0  ⌬
  
  ◉ TÍTULO: ${data.title || 'Desconocido'}
  ◉ ARTISTA: ${data.artist || 'Desconocido'}
  ◉ ÁLBUM: ${data.album || 'Desconocido'}
  ◉ LINK: ${data.url}

⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟⟟`;

    await conn.sendMessage(m.chat, {
      image: { url: data.thumbnail || 'https://i.ibb.co/sQpZwdd/music.jpg' },
      caption
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      audio: { url: downloadUrl },
      mimetype: 'audio/mpeg',
      fileName: `${data.title || 'cancion'}.mp3`
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      react: { text: '✅', key: m.key }
    });

  } catch (e) {
    console.error(e);
    m.reply('⚠️ Ocurrió un error al buscar o descargar la canción.', m);
  }
};

handler.help = ['spotify <nombre de la canción>'];
handler.tags = ['busqueda', 'descargas'];
handler.command = ['spotify'];

export default handler;
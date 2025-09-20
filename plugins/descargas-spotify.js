import fetch from 'node-fetch';

const handler = async (m, { args, conn, command, prefix }) => {
  if (!args[0]) {
    let ejemplos = ['adele', 'Natalia Jiménez', 'Sia', 'Maroon 5', 'Karol G'];
    let random = ejemplos[Math.floor(Math.random() * ejemplos.length)];
    return conn.reply(m.chat, `${emoji} Ejemplo de uso:\n${(prefix || '.') + command} ${random}`, m, rcanal);
  }

  await conn.sendMessage(m.chat, {
    react: { text: '⏱', key: m.key }
  });

  const query = encodeURIComponent(args.join(' '));
  const searchUrl = `https://api.delirius.store/search/spotify?q=${query}`;

  try {
    const res = await fetch(searchUrl);
    const json = await res.json();

    if (!json.estado || !json.datos || json.datos.length === 0) {
      return m.reply('❌ No encontré la canción que estás buscando.', m);
    }

    const data = json.datos[0]; 
    if (!data || !data.url) {
      return m.reply('⚠️ La API no devolvió un resultado válido.', m);
    }

    const downloadUrl = `https://api.delirius.store/download/spotifydl?url=${encodeURIComponent(data.url)}`;
    const dl = await fetch(downloadUrl).then(r => r.json()).catch(() => null);

    const audioUrl = dl?.datos?.url;
    if (!audioUrl || audioUrl.includes('undefined')) {
      return m.reply('⚠️ Error al obtener el enlace de descarga.', m);
    }

    const caption = `
╔══ ✦ ⋆ ── ✧ ── ⋆ ✦ ══╗
   ⟡  SPOTIFY TRACK INFO  ⟡
   
   ⌬ TÍTULO » ${data.título || 'Desconocido'}
   ⌬ ARTISTA » ${data.artista || 'Desconocido'}
   ⌬ ÁLBUM » ${data.álbum || 'Desconocido'}
   ⌬ DURACIÓN » ${data.duración || 'N/A'}
   ⌬ POPULARIDAD » ${data.popularidad || 'N/A'}
   ⌬ PUBLICADO » ${data.publicar || 'N/A'}
   ⌬ LINK » ${data.url}

╚══ ✦ ⋆ ── ✧ ── ⋆ ✦ ══╝`;

    await conn.sendMessage(m.chat, {
      image: { url: data.imagen || 'https://i.ibb.co/sQpZwdd/music.jpg' },
      caption
    }, { quoted: m });

    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mpeg',
      fileName: `${data.título || 'cancion'}.mp3`
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
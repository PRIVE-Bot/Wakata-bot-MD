import fetch from "node-fetch";
import yts from "yt-search";
import Jimp from "jimp";

async function resizeImage(buffer, size = 300) {
  const image = await Jimp.read(buffer);
  return image.resize(size, size).getBufferAsync(Jimp.MIME_JPEG);
}

const handler = async (m, { conn, text, command }) => {
  await m.react('🔎');
  await m.react('🔍');
  await m.react('🌟');

  if (!text?.trim()) {
    return conn.reply(m.chat, "❌ Dime el nombre de la canción o video que buscas", m);
  }

  try {
    const search = await yts.search({ query: text, pages: 1 });
    if (!search.videos.length) return m.reply("❌ No se encontró nada con ese nombre.");

    const videoInfo = search.videos[0];
    const { title, thumbnail, timestamp, views, ago, url, author } = videoInfo;

    const [thumbFileRes] = await Promise.all([conn.getFile(thumbnail)]);
    const thumb = thumbFileRes.data;
    const thumbResized = await resizeImage(thumb, 300);

    const fkontak = {
      key: { fromMe: false, participant: "0@s.whatsapp.net" },
      message: {
        orderMessage: {
          itemCount: 1,
          status: 1,
          surface: 1,
          message: `「 ${title} 」`,
          orderTitle: "Mejor Bot",
          thumbnail: thumbResized
        }
      }
    };

    const infoMessage = `★ ${global.botname || 'Bot'} ★

┏☾ *Titulo:* 「 ${title} 」 
┏┛  *Canal:* ${author?.name || 'Desconocido'} 
┃✎ *Vistas:* ${formatViews(views)} 
┃✎ *Duración:* ${timestamp}
┃✎ *Publicado:* ${ago}
┃
┗⌼ ᴅᴇsᴄᴀʀɢᴀɴᴅᴏ...`;

    await conn.sendMessage(
      m.chat,
      { image: thumb, caption: infoMessage },
      { quoted: fkontak }
    );

    if (command === "play") {
      const apiURL = `https://delirius-apiofc.vercel.app/download/ytmp3?url=${encodeURIComponent(url)}`;
      const res = await fetch(apiURL);
      const json = await res.json();
      if (!json?.status || !json.data?.download?.url) return m.reply("❌ No se pudo descargar el audio desde Delirius.");

      await m.react('🎧');

      await conn.sendMessage(
        m.chat,
        {
          audio: { url: json.data.download.url },
          mimetype: "audio/mpeg",
          fileName: json.data.download.filename
        },
        { quoted: fkontak }
      );
    }

    if (command === "play2") {
      const apiURL = `https://delirius-apiofc.vercel.app/download/ytmp4?url=${encodeURIComponent(url)}`;
      const res = await fetch(apiURL);
      const json = await res.json();
      if (!json?.status || !json.data?.download?.url) return m.reply("❌ No se pudo descargar el video desde Delirius.");

      await m.react('📽️');

      await conn.sendMessage(
        m.chat,
        {
          video: { url: json.data.download.url },
          mimetype: "video/mp4",
          fileName: json.data.download.filename,
          thumbnail: thumb
        },
        { quoted: fkontak }
      );
    }

  } catch (err) {
    console.error("❌ Error:", err);
    return m.reply(`⚠️ Ocurrió un error: ${err.message}`);
  }
};

handler.command = handler.help = ["play", "play2"];
handler.tags = ["downloader"];
export default handler;

function formatViews(views) {
  if (!views) return "Desconocido";
  const n = Number(String(views).replace(/,/g, ''));
  if (isNaN(n)) return "Desconocido";
  return n >= 1000 ? (n / 1000).toFixed(1) + "k (" + n.toLocaleString() + ")" : n.toString();
}
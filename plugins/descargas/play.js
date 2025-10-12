import fetch from "node-fetch";
import yts from "yt-search";
import Jimp from "jimp";

async function resizeImage(buffer, size = 300) {
  const image = await Jimp.read(buffer);
  return image.resize(size, size).getBufferAsync(Jimp.MIME_JPEG);
}

const handler = async (m, { conn, text, command }) => {
  if (!text?.trim()) return conn.reply(m.chat, `❌ Dime el nombre de la canción o video que buscas`, m);

  await m.react('🔎');
  await m.react('🔍');
  await m.react('🌟');

  try {
    const search = await yts.search({ query: text, pages: 1 });
    if (!search.videos.length) return m.reply("❌ No se encontró nada con ese nombre.");

    const video = search.videos[0];
    const { title, thumbnail, timestamp, views, ago, url, author } = video;
    const vistas = formatViews(views);

    const thumbRes = await resizeImage((await conn.getFile(thumbnail)).data, 300);
    const fkontak = {
      key: { fromMe: false, participant: "0@s.whatsapp.net" },
      message: {
        orderMessage: {
          itemCount: 1,
          status: 1,
          surface: 1,
          message: `「 ${title} 」`,
          orderTitle: "Mejor Bot",
          thumbnail: thumbRes
        }
      }
    };

    const infoMessage = `★ ${global.botname || 'Bot'} ★

┏☾ *Titulo:* 「 ${title} 」 
┏┛  *Canal:* ${author?.name || 'Desconocido'} 
┃✎ *Vistas:* ${vistas} 
┃✎ *Duración:* ${timestamp}
┃✎ *Publicado:* ${ago}
┗⌼ ᴅᴇsᴄᴀʀɢᴀɴᴅᴏ...`;

    await conn.sendMessage(m.chat, { image: thumbRes, caption: infoMessage }, { quoted: fkontak });
    if (command === "play") {
      await m.react('🎧');
      const res = await fetch(`https://api.yupra.my.id/api/downloader/ytmp3?url=${encodeURIComponent(url)}`);
      const json = await res.json();

      if (!json?.status || !json.result?.link) return m.reply("❌ No se pudo descargar el audio desde Yupra.");

      await conn.sendMessage(
        m.chat,
        {
          audio: { url: json.result.link },
          mimetype: "audio/mpeg",
          fileName: `${json.result.title}.mp3`
        },
        { quoted: fkontak }
      );
    }

    if (command === "play2") {
      await m.react('📽️');
      try {
        const apiURL = `https://api.sylphy.xyz/download/ytmp4?url=${encodeURIComponent(url)}&apikey=sylphy-fbb9`;
        const res = await fetch(apiURL);
        const json = await res.json();
        if (!json?.status || !json.res?.url) return m.reply("❌ No se pudo descargar el video desde Sylphy.");

        await conn.sendMessage(
          m.chat,
          {
            video: { url: json.res.url },
            fileName: `${json.res.title || title}.mp4`,
            mimetype: "video/mp4",
            thumbnail: thumbRes
          },
          { quoted: fkontak }
        );
      } catch (err) {
        console.error("❌ Error en play2:", err.message);
        return m.reply(`⚠️ Ocurrió un error: ${err.message}`);
      }
    }

  } catch (err) {
    console.error("❌ Error:", err.message);
    return m.reply(`⚠️ Ocurrió un error: ${err.message}`);
  }
};

handler.command = handler.help = ["play", "play2"];
handler.tags = ["downloader"];
export default handler;

function formatViews(views) {
  if (typeof views !== "number" || isNaN(views)) return "Desconocido";
  return views >= 1000
    ? (views / 1000).toFixed(1) + "k (" + views.toLocaleString() + ")"
    : views.toString();
}
import fetch from "node-fetch";
import yts from "yt-search";
import Jimp from "jimp";

async function resizeImage(buffer, size = 300) {
  const image = await Jimp.read(buffer);
  return image.resize(size, size).getBufferAsync(Jimp.MIME_JPEG);
}

const handler = async (m, { conn, text, command }) => {
  if (!text?.trim()) return conn.reply(m.chat, "❀ Dime el nombre de la canción o video que buscas", m);

  await m.react('🔎');

  try {
    const search = await yts.search({ query: text, pages: 1 });
    if (!search.videos.length) return m.reply("❌ No se encontró nada con ese nombre.");

    const videoInfo = search.videos[0];
    const { title, thumbnail, timestamp, views, ago, url, author, seconds } = videoInfo;

    if (seconds > 1800) return m.reply('⚠ El video supera el límite de 30 minutos.');

    const thumbFileRes = await conn.getFile(thumbnail);
    const thumbResized = await resizeImage(thumbFileRes.data, 300);

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

    const vistas = views >= 1000 ? (views / 1000).toFixed(1) + "k (" + views.toLocaleString() + ")" : views.toString();

    const infoMessage = `★ ${global.botname || 'Bot'} ★
┏☾ *Titulo:* 「 ${title} 」 
┃ *Canal:* ${author?.name || 'Desconocido'} 
┃✎ *Vistas:* ${vistas} 
┃✎ *Duración:* ${timestamp}
┃✎ *Publicado:* ${ago}
┗⌼ ᴅᴇsᴄᴀʀɢᴀɴᴅᴏ...`;

    await conn.sendMessage(m.chat, { image: thumbFileRes.data, caption: infoMessage }, { quoted: fkontak });

    if (["play", "yta", "ytmp3", "playaudio"].includes(command)) {
      const res = await fetch(`https://api.yupra.my.id/api/downloader/ytmp3?url=${encodeURIComponent(url)}`);
      const json = await res.json();
      const audioURL = json?.result?.link;
      if (!audioURL) return m.reply("❌ No se pudo descargar el audio.");

      await m.react('🎧');
      await conn.sendMessage(
        m.chat,
        { audio: { url: audioURL }, mimetype: "audio/mpeg", fileName: `${json.result.title || title}.mp3` },
        { quoted: fkontak }
      );
    }

    if (["play2", "ytv", "ytmp4", "mp4"].includes(command)) {
      const res = await fetch(`https://api.yupra.my.id/api/downloader/ytmp4?url=${encodeURIComponent(url)}`);
      const json = await res.json();
      const videoURL = json?.result?.formats?.[0]?.url;
      if (!videoURL) return m.reply("❌ No se pudo descargar el video.");

      await m.react('📽️');
      await conn.sendMessage(
        m.chat,
        { video: { url: videoURL }, fileName: `${json.result.title || title}.mp4`, mimetype: "video/mp4", thumbnail: thumbFileRes.data },
        { quoted: fkontak }
      );
    }

    await m.react('✔️');
  } catch (e) {
    await m.react('✖️');
    return conn.reply(m.chat, typeof e === 'string' ? e : `⚠︎ Error: ${e.message}`, m);
  }
};

handler.command = handler.help = ["play", "play2", "yta", "ytv", "ytmp3", "ytmp4", "playaudio", "mp4"];
handler.tags = ["downloader"];
export default handler;
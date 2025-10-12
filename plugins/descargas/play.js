import fetch from "node-fetch";
import yts from "yt-search";
import Jimp from "jimp";

const FORMAT_VIDEO = ["360", "480", "720", "1080", "1440", "4k"];

async function resizeImage(buffer, size = 300) {
  const image = await Jimp.read(buffer);
  return image.resize(size, size).getBufferAsync(Jimp.MIME_JPEG);
}

async function fetchFromApis(apis) {
  for (const { api, endpoint, extractor } of apis) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(endpoint, { signal: controller.signal }).then(r => r.json());
      clearTimeout(timeout);
      const link = extractor(res);
      if (link) return { url: link, api };
    } catch (e) {}
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  return null;
}

async function getAud(url) {
  const apis = [
    { api: 'Xyro', endpoint: `https://xyro.site/download/youtubemp3?url=${encodeURIComponent(url)}`, extractor: res => res.result?.dl },
    { api: 'Yupra', endpoint: `https://api.yupra.my.id/api/downloader/ytmp3?url=${encodeURIComponent(url)}`, extractor: res => res.resultado?.enlace },
    { api: 'Vreden', endpoint: `https://api.vreden.web.id/api/ytmp3?url=${encodeURIComponent(url)}`, extractor: res => res.result?.download?.url },
    { api: 'Delirius', endpoint: `https://api.delirius.store/download/ymp3?url=${encodeURIComponent(url)}`, extractor: res => res.data?.download?.url },
    { api: 'ZenzzXD', endpoint: `https://api.zenzxz.my.id/downloader/ytmp3?url=${encodeURIComponent(url)}`, extractor: res => res.download_url },
  ];
  return await fetchFromApis(apis);
}

async function getVid(url) {
  const apis = [
    { api: 'Xyro', endpoint: `https://xyro.site/download/youtubemp4?url=${encodeURIComponent(url)}&quality=360`, extractor: res => res.result?.dl },
    { api: 'Yupra', endpoint: `https://api.yupra.my.id/api/downloader/ytmp4?url=${encodeURIComponent(url)}`, extractor: res => res.resultado?.formatos?.[0]?.url },
    { api: 'Vreden', endpoint: `https://api.vreden.web.id/api/ytmp4?url=${encodeURIComponent(url)}`, extractor: res => res.result?.download?.url },
    { api: 'Delirius', endpoint: `https://api.delirius.store/download/ytmp4?url=${encodeURIComponent(url)}`, extractor: res => res.data?.download?.url },
    { api: 'ZenzzXD', endpoint: `https://api.zenzxz.my.id/downloader/ytmp4?url=${encodeURIComponent(url)}`, extractor: res => res.download_url },
  ];
  return await fetchFromApis(apis);
}

const handler = async (m, { conn, text, command }) => {
  if (!text?.trim()) return conn.reply(m.chat, `❀ Dime el nombre de la canción o video que buscas`, m);

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

    const vistas = views >= 1_000 ? (views / 1000).toFixed(1) + "k (" + views.toLocaleString() + ")" : views.toString();

    const infoMessage = `★ ${global.botname || 'Bot'} ★
┏☾ *Titulo:* 「 ${title} 」 
┃ *Canal:* ${author?.name || 'Desconocido'} 
┃✎ *Vistas:* ${vistas} 
┃✎ *Duración:* ${timestamp}
┃✎ *Publicado:* ${ago}
┗⌼ ᴅᴇsᴄᴀʀɢᴀɴᴅᴏ...`;

    await conn.sendMessage(m.chat, { image: thumbFileRes.data, caption: infoMessage }, { quoted: fkontak });

    if (["play", "yta", "ytmp3", "playaudio"].includes(command)) {
      const audio = await getAud(url);
      if (!audio?.url) return m.reply("❌ No se pudo descargar el audio desde ninguna API.");
      await m.react('🎧');
      await conn.sendMessage(
        m.chat,
        { audio: { url: audio.url }, mimetype: "audio/mpeg", fileName: `${title}.mp3` },
        { quoted: fkontak }
      );
    }

    if (["play2", "ytv", "ytmp4", "mp4"].includes(command)) {
      const video = await getVid(url);
      if (!video?.url) return m.reply("❌ No se pudo descargar el video desde ninguna API.");
      await m.react('📽️');
      await conn.sendMessage(
        m.chat,
        { video: { url: video.url }, fileName: `${title}.mp4`, mimetype: "video/mp4", thumbnail: thumbFileRes.data },
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
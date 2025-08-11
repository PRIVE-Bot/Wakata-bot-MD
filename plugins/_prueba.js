// edited and optimized by 
// https://github.com/deylin-eliac

import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";
import { createMessageWithReactions, setActionCallback } from '../lib/reaction.js';

const FORMAT_AUDIO = ["mp3", "m4a", "webm", "acc", "flac", "opus", "ogg", "wav"];
const FORMAT_VIDEO = ["360", "480", "720", "1080", "1440", "4k"];

const ddownr = {
  download: async (url, format) => {
    if (!FORMAT_AUDIO.includes(format) && !FORMAT_VIDEO.includes(format)) {
      throw new Error("⚠️ Formato no compatible.");
    }

    const config = {
      method: "GET",
      url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 10000
    };

    const response = await axios.request(config).catch(() => null);
    if (!response?.data?.success) throw new Error("⛔ No se pudo obtener detalles del video.");

    const { id, title, info } = response.data;
    const downloadUrl = await ddownr.cekProgress(id);
    return { title, image: info.image, downloadUrl };
  },

  cekProgress: async (id) => {
    const config = {
      method: "GET",
      url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 8000
    };

    for (let i = 0; i < 5; i++) {
      const response = await axios.request(config).catch(() => null);
      if (response?.data?.success && response.data.progress === 1000) {
        return response.data.download_url;
      }
      await new Promise(res => setTimeout(res, 3000));
    }
    throw new Error("⏳ Tiempo agotado al obtener enlace de descarga.");
  }
};

const handler = async (m, { conn, text }) => {
  await m.react('⚡️');
  if (!text?.trim()) return conn.reply(m.chat, "Dime el nombre de la canción o video que buscas", m);

  try {
    const search = await yts.search(text);
    const videoInfo = search?.videos?.[0];
    if (!videoInfo) return m.reply("❌ No se encontró nada.");

    const { title, thumbnail, timestamp, views, ago, url, author } = videoInfo;
    const thumbData = (await conn.getFile(thumbnail)).data;

    const infoMessage = `★ ${global.botname || 'Bot'} ★

╭⍰ *Titulo:* 「 ${title} 」 
⍰ *Canal:* ${author?.name || 'Desconocido'} 
⍰ *Vistas:* ${formatViews(views)} 
⍰ *Duración:* ${timestamp}
⍰ *Publicado:* ${ago}

> ❤️ = Audio | 🔥 = Video
`;

    const actions = {
      '❤️': { type: 'audio', data: { url, title } },
      '🔥': { type: 'video', data: { url, title, thumb: thumbData } },
    };

    const msg = await conn.sendMessage(m.chat, { image: thumbData, caption: infoMessage }, { quoted: m });
    createMessageWithReactions(conn, msg, actions); // no bloquea la ejecución

  } catch (error) {
    console.error("❌ Error:", error);
    return m.reply(`⚠️ Error: ${error.message}`);
  }
};

handler.command = handler.help = ["play", "yta", "ytmp3", "ytv", "ytmp4"];
handler.tags = ["downloader"];
export default handler;


setActionCallback('audio', async (conn, chat, data) => {
  try {
    const api = await ddownr.download(data.url, "mp3");
    await conn.sendMessage(chat, {
      audio: { url: api.downloadUrl },
      mimetype: 'audio/mpeg',
      fileName: `${data.title}.mp3`
    });
  } catch (err) {
    await conn.sendMessage(chat, { text: `❌ Error al descargar audio: ${err.message}` });
  }
});

setActionCallback('video', async (conn, chat, data) => {
  try {
    const apiURL = `https://api.sylphy.xyz/download/ytmp4?url=${encodeURIComponent(data.url)}&apikey=sylphy-fbb9`;
    const json = await fetch(apiURL).then(r => r.json()).catch(() => null);
    if (!json?.status || !json.res?.url) throw new Error("No se pudo descargar el video.");
    await conn.sendMessage(chat, {
      video: { url: json.res.url },
      fileName: `${json.res.title || data.title}.mp4`,
      mimetype: "video/mp4",
      thumbnail: data.thumb
    });
  } catch (err) {
    await conn.sendMessage(chat, { text: `❌ Error al descargar video: ${err.message}` });
  }
});

function formatViews(views) {
  return typeof views === "number" && !isNaN(views)
    ? views >= 1000
      ? (views / 1000).toFixed(1) + "k (" + views.toLocaleString() + ")"
      : views.toString()
    : "Desconocido";
}
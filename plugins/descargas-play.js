// editado y optimizado por 
// https://github.com/deylin-eliac

import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";

const FORMAT_AUDIO = ["mp3", "m4a", "webm", "acc", "flac", "opus", "ogg", "wav"];
const FORMAT_VIDEO = ["360", "480", "720", "1080", "1440", "4k"];

const ddownr = {
  download: async (url, format) => {
    if (!FORMAT_AUDIO.includes(format) && !FORMAT_VIDEO.includes(format)) {
      throw new Error("⚠️ Ese formato no es compatible.");
    }

    const config = {
      method: "GET",
      url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 15000
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
      timeout: 15000
    };

    let retries = 0;
    while (retries < 8) { // Máx. 8 intentos (~40s)
      const response = await axios.request(config).catch(() => null);
      if (response?.data?.success && response.data.progress === 1000) {
        return response.data.download_url;
      }
      retries++;
      await new Promise(res => setTimeout(res, 5000));
    }
    throw new Error("⏳ Tiempo de espera agotado para obtener enlace de descarga.");
  }
};

const handler = async (m, { conn, text, command }) => {
  await m.react('⚡️');

  if (!text?.trim()) {
    return conn.reply(m.chat, `${emoji} Dime el nombre de la canción o video que buscas`, m, rcanal);
  }

  try {
    const search = await yts.search({ query: text, pages: 1 });
    if (!search.videos.length) return m.reply("❌ No se encontró nada con ese nombre.");

    const videoInfo = search.videos[0];
    const { title, thumbnail, timestamp, views, ago, url, author } = videoInfo;

    const vistas = formatViews(views);
    const thumb = (await conn.getFile(thumbnail)).data;

    const infoMessage = `★ ${global.botname || 'Bot'} ★

╭ ⍰ *Título:* 「 ${title} 」 
⍰ *Canal:* ${author?.name || 'Desconocido'} 
⍰ *Vistas:* ${vistas} 
⍰ *Duración:* ${timestamp}
⍰ *Publicado:* ${ago}

> *Sigue el canal oficial:*
> whatsapp.com/channel/0029VbAzn9GGU3BQw830eA0F
`;

    await conn.sendMessage(m.chat, { image: thumb, caption: infoMessage }, { quoted: m });

    if (["play", "yta", "ytmp3"].includes(command)) {
      const api = await ddownr.download(url, "mp3");
      return conn.sendMessage(m.chat, {
        audio: { url: api.downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`
      }, { quoted: m });
    }

    if (["play2", "ytv", "ytmp4"].includes(command)) {
  const sources = [
    `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`,
    `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${url}`,
    `https://axeel.my.id/api/download/video?url=${encodeURIComponent(url)}`,
    `https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`
  ];

  let downloadUrl = null;

  
  try {
    downloadUrl = await Promise.any(
      sources.map(src =>
        fetch(src, { timeout: 15000 })
          .then(r => r.json())
          .then(({ data, result, downloads }) =>
            data?.dl || result?.download?.url || downloads?.url || data?.download?.url || null
          )
          .catch(() => null)
      )
    );
  } catch {
    downloadUrl = null;
  }

  
  if (!downloadUrl) {
    try {
      const api = await ddownr.download(url, "720"); 
      downloadUrl = api.downloadUrl;
    } catch {
      downloadUrl = null;
    }
  }

  
  if (!downloadUrl) {
    return m.reply("❌ No se pudo obtener el video desde ninguna fuente disponible.");
  }

  
  await conn.sendMessage(m.chat, {
    video: { url: downloadUrl },
    fileName: `${title}.mp4`,
    mimetype: "video/mp4",
    thumbnail: thumb
  }, { quoted: m });
}

      } catch {
        return m.reply("❌ No se pudo descargar el video desde ninguna fuente.");
      }
    }

  } catch (error) {
    console.error("❌ Error:", error);
    return m.reply(`⚠️ Ocurrió un error: ${error.message}`);
  }
};

handler.command = handler.help = ["play", "play2", "ytmp3", "yta", "ytmp4", "ytv"];
handler.tags = ["downloader"];

export default handler;

function formatViews(views) {
  if (typeof views !== "number" || isNaN(views)) return "Desconocido";
  return views >= 1000
    ? (views / 1000).toFixed(1) + "k (" + views.toLocaleString() + ")"
    : views.toString();
}
import fetch from "node-fetch";
import axios from "axios";

const formatAudio = ["mp3", "m4a", "webm", "acc", "flac", "opus", "ogg", "wav"];
const formatVideo = ["360", "480", "720", "1080", "1440", "4k"];

const ddownr = {
  download: async (url, format) => {
    if (!formatAudio.includes(format) && !formatVideo.includes(format)) {
      throw new Error("⚠️ Formato no soportado.");
    }

    const config = {
      method: "GET",
      url: `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`,
      headers: { "User-Agent": "Mozilla/5.0" }
    };

    const response = await axios.request(config);
    if (response.data?.success) {
      const { id, title, info } = response.data;
      const downloadUrl = await ddownr.cekProgress(id);
      return { title, image: info.image, downloadUrl };
    } else {
      throw new Error("⛔ No se pudo procesar el video.");
    }
  },

  cekProgress: async (id) => {
    const config = {
      method: "GET",
      url: `https://p.oceansaver.in/ajax/progress.php?id=${id}`,
      headers: { "User-Agent": "Mozilla/5.0" }
    };

    while (true) {
      const response = await axios.request(config);
      if (response.data?.success && response.data.progress === 1000) {
        return response.data.download_url;
      }
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

const handler = async (m, { conn, text, command }) => {
  try {
    if (!text || !/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(text)) {
      return conn.reply(m.chat, "⚡ Ingresa una URL válida de YouTube.", m, fake);
    }
  await m.react('⚡️');

    const url = text.trim();
    let api;


    if (["ytmp3", "yta"].includes(command)) {
      api = await ddownr.download(url, "mp3");
      await conn.sendMessage(m.chat, {
        audio: { url: api.downloadUrl },
        mimetype: "audio/mpeg",
        fileName: `${api.title}.mp3`,
        contextInfo: {
          externalAdReply: {
            title: "⚡ Spark-Bot | YT-MP3",
            body: api.title,
            mediaType: 1,
            previewType: 0,
            mediaUrl: url,
            sourceUrl: url,
            thumbnailUrl: api.image,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });
  await m.react('🔥');


    } else if (["ytmp4", "ytv"].includes(command)) {
      const sources = [
        `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`,
        `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${url}`,
        `https://axeel.my.id/api/download/video?url=${encodeURIComponent(url)}`,
        `https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`
      ];

      let success = false;
      for (let source of sources) {
        try {
          const res = await fetch(source);
          const { data, result, downloads } = await res.json();
          let downloadUrl = data?.dl || result?.download?.url || downloads?.url || data?.download?.url;

          if (downloadUrl) {
            success = true;
            await conn.sendMessage(m.chat, {
              video: { url: downloadUrl },
              fileName: `${api?.title || "video"}.mp4`,
              mimetype: "video/mp4",
              caption: "⚡ Aquí tienes tu video descargado por *Spark-Bot* ⚡",
              contextInfo: {
                externalAdReply: {
                  title: "⚡ Spark-Bot | YT-MP4",
                  body: api?.title || "YouTube Video",
                  mediaType: 1,
                  previewType: 0,
                  mediaUrl: url,
                  sourceUrl: url,
                  thumbnailUrl: api?.image,
                  renderLargerThumbnail: true
                }
              }
            }, { quoted: m });
            break;
          }
        } catch (e) {
          console.error(`❌ Error con la fuente ${source}:`, e.message);
        }
      }

      if (!success) return m.reply("⚠️ No se encontró un enlace de descarga válido.");
    }
  } catch (error) {
    return m.reply(`❌ Error: ${error.message}`);
  }
};

handler.command = handler.help = ["ytmp3", "yta", "ytmp4", "ytv"];
handler.tags = ["downloader"];

export default handler;
// edited and optimized by 
// https://github.com/deylin-eliac

/*import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";
import { createMessageWithReactions, setActionCallback } from '../lib/reaction.js';

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
    while (retries < 8) {
      const response = await axios.request(config).catch(() => null);
      if (response?.data?.success && response.data.progress === 1000) {
        return response.data.download_url;
      }
      retries++;
      await new Promise(res => setTimeout(res, 9000));
    }
    throw new Error("⏳ Tiempo de espera agotado para obtener enlace de descarga.");
  }
};

const handler = async (m, { conn, text }) => {
  await m.react('🔥');

  if (!text) {
    return conn.reply(m.chat, `Dime el nombre de la canción o video que buscas`, m);
  }

  try {
    const searchResults = await yts.search({ query: text, pages: 1 });
    if (!searchResults.videos.length) {
      return m.reply("❌ No se encontró nada con ese nombre.");
    }

    const videoInfo = searchResults.videos[0];
    const { title, thumbnail, timestamp, views, ago, url, author } = videoInfo;

    const [thumbFileRes, thumb2Res] = await Promise.all([
      conn.getFile(thumbnail),
      fetch('https://files.catbox.moe/f8qrut.png')
    ]);

    const thumb2 = Buffer.from(await thumb2Res.arrayBuffer());

    const fkontak = {
      key: {
        participants: "0@s.whatsapp.net",
        remoteJid: "status@broadcast",
        fromMe: false,
        id: "Halo"
      },
      message: {
        locationMessage: {
          name: '𝗥𝗘𝗔𝗖𝗖𝗜𝗢𝗡𝗔 𝗔 𝗘𝗦𝗧𝗘 𝗠𝗘𝗡𝗦𝗔𝗝𝗘 𝗖𝗢𝗡 𝗟𝗢𝗦 𝗘𝗠𝗢𝗝𝗜𝗦 𝗜𝗡𝗗𝗜𝗖𝗔𝗗𝗢𝗦',
          jpegThumbnail: thumb2
        }
      },
      participant: "0@s.whatsapp.net"
    };

    const fkontak2 = {
        key: {
            participants: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            fromMe: false,
            id: "Halo"
        },
        message: {
            locationMessage: {
                name: `𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗔:\n「 ${title} 」`,
                jpegThumbnail: thumb2
            }
        },
        participant: "0@s.whatsapp.net"
    };

    const vistas = formatViews(views);

    const infoMessage = `★ ${global.botname || 'Bot'} ★

╭⍰ *Titulo:* 「 ${title} 」 
⍰ *Canal:* ${author?.name || 'Desconocido'} 
⍰ *Vistas:* ${vistas} 
⍰ *Duración:* ${timestamp}
⍰ *Publicado:* ${ago}

> *Selecciona una opción reaccionando:*
> ❤️ = Descargar Audio 
> 🔥 = Descargar Video
`;

    const actions = {
      '❤️': { type: 'audio', data: { url, title, fkontak2 } },
      '🔥': { type: 'video', data: { url, title, thumb: thumbFileRes.data, fkontak2 } },
    };

    const msg = await conn.sendMessage(m.chat, { image: thumbFileRes.data, caption: infoMessage }, { quoted: fkontak });
    await createMessageWithReactions(conn, msg, actions);

  } catch (error) {
    console.error("❌ Error en handler:", error);
    return m.reply(`⚠️ Ocurrió un error: ${error.message}`);
  }
};

handler.command = handler.help = ["play", "yta", "ytmp3", "ytv", "ytmp4"];
handler.tags = ["downloader"];

export default handler;


setActionCallback('audio', async (conn, chat, data) => {
  const { url, title, fkontak2 } = data;
  try {
    const api = await ddownr.download(url, "mp3");
    await conn.sendMessage(chat, {
      audio: { url: api.downloadUrl },
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`
    }, { quoted: fkontak2 });
  } catch (err) {
    await conn.sendMessage(chat, { text: `❌ Error al descargar el audio: ${err.message}` });
  }
});

setActionCallback('video', async (conn, chat, data) => {
  const { url, title, thumb, fkontak2 } = data;
  try {
    const apiURL = `https://api.sylphy.xyz/download/ytmp4?url=${encodeURIComponent(url)}&apikey=sylphy-fbb9`;
    const res = await fetch(apiURL);
    const json = await res.json();
    if (!json?.status || !json.res?.url) {
      await conn.sendMessage(chat, { text: "❌ No se pudo descargar el video desde Sylphy." });
      return;
    }
    await conn.sendMessage(chat, {
      video: { url: json.res.url },
      fileName: `${json.res.title || title}.mp4`,
      mimetype: "video/mp4",
      thumbnail: thumb
    }, { quoted: fkontak2 });
  } catch (err) {
    await conn.sendMessage(chat, { text: `❌ Error al descargar el video: ${err.message}` });
  }
});


function formatViews(views) {
  if (typeof views !== "number" || isNaN(views)) return "Desconocido";
  if (views < 1000) {
    return views.toString();
  }
  const SI_POSTFIXES = ["", "k", "M", "G", "T", "P", "E"];
  const tier = Math.log10(Math.abs(views)) / 3 | 0;
  if (tier === 0) return views.toString();
  const postfix = SI_POSTFIXES[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = views / scale;
  return scaled.toFixed(1) + postfix;
}
*/




// versión antigua 🗝️ 
// 👇


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

const [thumbFileRes, thumb2Res] = await Promise.all([
      conn.getFile(thumbnail),
      fetch('https://files.catbox.moe/f8qrut.png')
    ]);

    const thumb2 = Buffer.from(await thumb2Res.arrayBuffer());

    const fkontak = {
      key: {
        participants: "0@s.whatsapp.net",
        remoteJid: "status@broadcast",
        fromMe: false,
        id: "Halo"
      },
      message: {
        locationMessage: {
          name: '𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗦 𝗣𝗟𝗔𝗬',
          jpegThumbnail: thumb2
        }
      },
      participant: "0@s.whatsapp.net"
    };

    const fkontak2 = {
        key: {
            participants: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            fromMe: false,
            id: "Halo"
        },
        message: {
            locationMessage: {
                name: `𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗔:\n「 ${title} 」`,
                jpegThumbnail: thumb2
            }
        },
        participant: "0@s.whatsapp.net"
    };


    const vistas = formatViews(views);
    const thumb = (await conn.getFile(thumbnail)).data;

    const infoMessage = `★ ${global.botname || 'Bot'} ★

╭⍰ *Titulo:* 「 ${title} 」 
⍰ *Canal:* ${author?.name || 'Desconocido'} 
⍰ *Vistas:* ${vistas} 
⍰ *Duración:* ${timestamp}
⍰ *Publicado:* ${ago}

> *Sigue el canal oficial:*
> whatsapp.com/channel/0029VbAzn9GGU3BQw830eA0F
`;

    await conn.sendMessage(m.chat, { image: thumb, caption: infoMessage }, { quoted: fkontak });

    // Audio
    if (["play", "yta", "ytmp3"].includes(command)) {
      const api = await ddownr.download(url, "mp3");
      return conn.sendMessage(m.chat, {
        audio: { url: api.downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`
      }, { quoted: fkontak2 });
    }

    // Video
    if (["play2", "ytv", "ytmp4"].includes(command)) {
      try {
        const apiURL = `https://api.sylphy.xyz/download/ytmp4?url=${encodeURIComponent(url)}&apikey=sylphy-fbb9`;
        const res = await fetch(apiURL);
        const json = await res.json();

        if (!json?.status || !json.res?.url) {
          return m.reply("❌ No se pudo descargar el video desde Sylphy.");
        }

        await conn.sendMessage(m.chat, {
          video: { url: json.res.url },
          fileName: `${json.res.title || title}.mp4`,
          mimetype: "video/mp4",
          thumbnail: thumb
        }, { quoted: fkontak2 });

      } catch (err) {
        console.error("❌ Error en play2:", err.message);
        return m.reply(`⚠️ Ocurrió un error: ${err.message}`);
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
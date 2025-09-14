// editado y optimizado por 
// https://github.com/deylin-eliac

/*import fetch from "node-fetch";
import yts from "yt-search";
import axios from "axios";
import Jimp from "jimp";

const FORMAT_AUDIO = ["mp3", "m4a", "webm", "acc", "flac", "opus", "ogg", "wav"];
const FORMAT_VIDEO = ["360", "480", "720", "1080", "1440", "4k"];

async function resizeImage(buffer, size = 300) {
  const image = await Jimp.read(buffer);
  return image.resize(size, size).getBufferAsync(Jimp.MIME_JPEG);
}

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
    if (!response?.data?.success) {
      const apiMsg = response?.data?.msg || response?.data?.error || "Error desconocido";
      throw new Error(`⛔ Error API: ${apiMsg}`);
    }

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
    return conn.reply(m.chat, `⚠️ Dime el nombre de la canción o video que buscas`, m, rcanal);
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

    const thumb = thumbFileRes.data;
    const thumbResized = await resizeImage(thumb, 300); 
    const thumb2 = Buffer.from(await thumb2Res.arrayBuffer());

const res3 = await fetch('https://files.catbox.moe/wfd0ze.jpg');
const thumb3 = Buffer.from(await res3.arrayBuffer());

const fkontak2 = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
        documentMessage: {
            title: "𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗡𝗗𝗢",
            fileName: botname,
            jpegThumbnail: thumb3
        }
    }
}

    
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

    const vistas = formatViews(views);

    const infoMessage = `★ ${global.botname || 'Bot'} ★

  ┏☾ *Titulo:* 「 ${title} 」 
┏┛  *Canal:* ${author?.name || 'Desconocido'} 
┃✎ *Vistas:* ${vistas} 
┃✎ *Duración:* ${timestamp}
┃✎ *Publicado:* ${ago}
┃
┗⌼ ᴅᴇsᴄᴀʀɢᴀɴᴅᴏ...`;
`;

    await conn.sendMessage(
      m.chat,
      {
        image: thumb,
        caption: infoMessage,
        contextInfo: {
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: channelRD.id,
            newsletterName: channelRD.name,
            serverMessageId: -1
          }
        }
      },
      { quoted: fkontak2 }
    );

    // Audio
    if (["play"].includes(command)) {
      const api = await ddownr.download(url, "mp3");
      await conn.sendMessage(
        m.chat,
        {
          audio: { url: api.downloadUrl },
          mimetype: "audio/mpeg",
          fileName: `${title}.mp3`,
          ptt: true
        },
        { quoted: fkontak }
      );
    }

    // Video
    if (["play2"].includes(command)) {
      try {
        const apiURL = `https://api.sylphy.xyz/download/ytmp4?url=${encodeURIComponent(url)}&apikey=sylphy-fbb9`;
        const res = await fetch(apiURL);
        const json = await res.json();

        if (!json?.status || !json.res?.url) {
          return m.reply("❌ No se pudo descargar el video desde Sylphy.");
        }

        await conn.sendMessage(
          m.chat,
          {
            video: { url: json.res.url },
            fileName: `${json.res.title || title}.mp4`,
            mimetype: "video/mp4",
            thumbnail: thumb
          },
          { quoted: fkontak }
        );

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

handler.command = handler.help = ["play", "play2"];
handler.tags = ["downloader"];

export default handler;

function formatViews(views) {
  if (typeof views !== "number" || isNaN(views)) return "Desconocido";
  return views >= 1000
    ? (views / 1000).toFixed(1) + "k (" + views.toLocaleString() + ")"
    : views.toString();
}*/




import yts from "yt-search";
import fetch from "node-fetch";

const handler = async (m, { conn, text, command }) => {
  // 1. Reacciona al mensaje para indicar que se está procesando
  await m.react('🔎');

  // 2. Valida si el usuario proporcionó un texto de búsqueda
  if (!text?.trim()) {
    return conn.reply(m.chat, `🎵 Por favor, escribe el nombre de la canción o video que buscas.`, m);
  }

  try {
    // 3. Busca el video en YouTube
    const search = await yts.search({ query: text, pages: 1 });
    const videoInfo = search.videos[0];

    // 4. Si no se encuentra ningún video, notifica al usuario
    if (!videoInfo) {
      await m.react('❌');
      return m.reply("❌ No se encontró nada con ese nombre. Intenta con otra búsqueda.");
    }
    
    // 5. Destructura la información relevante del video
    const { title, thumbnail, timestamp, views, ago, url, author } = videoInfo;
    const vistas = formatViews(views);
    
    // 6. Crea el mensaje informativo con los detalles del video
    const infoMessage = `★ 𝗗𝗲𝘀𝗰𝗮𝗿𝗴𝗮𝘀 ★
    
┏✑ Titulo: 「 ${title} 」
┃✑ Canal: ${author?.name || 'Desconocido'}
┃✑ Vistas: ${vistas}
┃✑ Duración: ${timestamp}
┃✑ Publicado: ${ago}
┗✑ 𝗟𝗶𝗻𝗸: ${url}

*Elije la opción que deseas descargar:*
*🎧 Audio:* .play ${text}
*📹 Video:* .play2 ${text}
`;

    // 7. Envía el mensaje informativo con la imagen del thumbnail
    await conn.sendMessage(
      m.chat,
      {
        image: { url: thumbnail },
        caption: infoMessage,
      },
      { quoted: m }
    );
    
    // 8. Condicional para ejecutar la descarga según el comando
    if (command === "play") {
      await m.react('🎧');
      const apiURL = `https://yt-dey-pi.onrender.com/download-mp3?url=${encodeURIComponent(url)}`;
      const res = await fetch(apiURL);
      const json = await res.json();
      
      if (!json?.status || !json.audio_url) {
        await m.react('❌');
        return m.reply("❌ No se pudo descargar el audio. La API no respondió correctamente.");
      }
      
      await conn.sendMessage(
        m.chat,
        {
          audio: { url: json.audio_url },
          mimetype: "audio/mpeg",
          fileName: `${json.title || title}.mp3`,
        },
        { quoted: m }
      );
      
    } else if (command === "play2") {
      await m.react('📽️');
      const apiURL = `https://yt-dey-pi.onrender.com/download-mp4?url=${encodeURIComponent(url)}`; // Usé una API para MP4, si la tuya no funciona, se puede buscar otra
      const res = await fetch(apiURL);
      const json = await res.json();
      
      if (!json?.status || !json.video_url) {
        await m.react('❌');
        return m.reply("❌ No se pudo descargar el video. La API no respondió correctamente.");
      }
      
      await conn.sendMessage(
        m.chat,
        {
          video: { url: json.video_url },
          fileName: `${json.title || title}.mp4`,
          mimetype: "video/mp4",
          thumbnail: { url: thumbnail }
        },
        { quoted: m }
      );
    }

  } catch (error) {
    // 9. Manejo de errores general para cualquier problema inesperado
    console.error("❌ Error en el manejador:", error);
    await m.react('⚠️');
    return m.reply(`⚠️ ¡Ups! Ocurrió un error inesperado: ${error.message}.`);
  }
};

handler.command = ["play", "play2"];

export default handler;

// 10. Función auxiliar para formatear vistas
function formatViews(views) {
  if (typeof views !== "number" || isNaN(views)) return "Desconocido";
  return views >= 1000 ? `${(views / 1000).toFixed(1)}k (${views.toLocaleString()})` : views.toLocaleString();
}


import fetch from "node-fetch";
import yts from "yt-search";
import Jimp from "jimp";

async function resizeImage(buffer, size = 300) {
  const image = await Jimp.read(buffer);
  return image.resize(size, size).getBufferAsync(Jimp.MIME_JPEG);
}

// Función interna para descargar usando yt.savetube.me
async function saveTubeDownload(url, format = "mp3") {
  try {
    // Paso 1: obtener token
    const tokenRes = await fetch("https://yt.savetube.me/api/v1/authorize", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    const tokenJson = await tokenRes.json();
    if (!tokenJson?.result) throw new Error("No se pudo obtener token");

    const token = tokenJson.result;

    // Paso 2: obtener metadata
    const metaRes = await fetch("https://yt.savetube.me/api/v1/info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, token })
    });
    const metaJson = await metaRes.json();
    if (!metaJson?.status) throw new Error("No se pudo obtener metadata");

    const videoInfo = metaJson.result;

    // Paso 3: elegir formato
    let chosenFormat;
    if (format === "mp3") {
      chosenFormat = videoInfo.mp3[0]; // primer mp3
    } else {
      chosenFormat = videoInfo.mp4[1] || videoInfo.mp4[0]; // mejor calidad mp4
    }

    if (!chosenFormat) throw new Error("Formato no disponible");

    // Paso 4: generar link de descarga
    const dlRes = await fetch("https://yt.savetube.me/api/v1/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        video_id: videoInfo.id,
        format: chosenFormat.key,
        token
      })
    });
    const dlJson = await dlRes.json();
    if (!dlJson?.status) throw new Error("No se pudo generar link");

    return {
      status: true,
      title: videoInfo.title,
      download: dlJson.result
    };
  } catch (e) {
    return { status: false, error: e.message };
  }
}

const handler = async (m, { conn, text, command }) => {
  await m.react('🔎');
  if (!text?.trim()) return conn.reply(m.chat, `🎧 Dime el nombre de la canción o video que buscas`, m);

  try {
    const search = await yts.search({ query: text, pages: 1 });
    if (!search.videos.length) return m.reply("❌ No se encontró nada con ese nombre.");

    const videoInfo = search.videos[0];
    const { title, thumbnail, timestamp, views, ago, url, author } = videoInfo;

    const thumbFileRes = await conn.getFile(thumbnail);
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
          orderTitle: "Descarga",
          thumbnail: thumbResized
        }
      }
    };

    const vistas = formatViews(views);
    const infoMessage = `★ ${global.botname || 'Bot'} ★

┏☾ *Titulo:* 「 ${title} 」 
┃ *Canal:* ${author?.name || 'Desconocido'} 
┃ *Vistas:* ${vistas} 
┃ *Duración:* ${timestamp}
┃ *Publicado:* ${ago}
┗⌼ ᴅᴇsᴄᴀʀɢᴀɴᴅᴏ...`;

    await conn.sendMessage(m.chat, { image: thumb, caption: infoMessage }, { quoted: fkontak });

    if (command === "play") {
      await m.react('🎧');
      const dl = await saveTubeDownload(url, "mp3");
      if (!dl.status) return m.reply(`❌ Error: ${dl.error}`);

      await conn.sendMessage(
        m.chat,
        {
          audio: { url: dl.download },
          mimetype: "audio/mpeg",
          fileName: `${dl.title}.mp3`,
          ptt: true
        },
        { quoted: fkontak }
      );
    }

    if (command === "play2") {
      await m.react('📽️');
      const dl = await saveTubeDownload(url, "mp4");
      if (!dl.status) return m.reply(`❌ Error: ${dl.error}`);

      await conn.sendMessage(
        m.chat,
        {
          video: { url: dl.download },
          fileName: `${dl.title}.mp4`,
          mimetype: "video/mp4",
          thumbnail: thumb
        },
        { quoted: fkontak }
      );
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
}
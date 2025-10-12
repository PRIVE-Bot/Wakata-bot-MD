import fetch from "node-fetch";
import yts from "yt-search";

const handler = async (m, { conn, text }) => {
  if (!text?.trim()) return conn.reply(m.chat, `❌ Dime el nombre de la canción que buscas`, m);

  try {
    // Buscar el video en YouTube
    const search = await yts(text);
    if (!search.videos.length) return m.reply("❌ No se encontró nada con ese nombre.");

    const video = search.videos[0];
    const { title, url } = video;

    // Obtener link directo de audio desde la API de Kirito
    const res = await fetch(`https://api.kirito.my/api/ytmp3?url=${encodeURIComponent(url)}`);
    const json = await res.json();

    if (!json?.url) return m.reply("❌ No se pudo descargar el audio.");

    // Enviar el audio
    await conn.sendMessage(
      m.chat,
      {
        audio: { url: json.url },
        mimetype: "audio/mpeg",
        fileName: `${title}.mp3`
      },
      { quoted: m }
    );

  } catch (err) {
    console.error("❌ Error:", err.message);
    return m.reply(`⚠️ Ocurrió un error: ${err.message}`);
  }
};

handler.command = ["play", "mp3"];
handler.tags = ["downloader"];
export default handler;
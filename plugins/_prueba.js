import fetch from "node-fetch";

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`⚠️ Ingresa un link de YouTube\n\nEjemplo:\n${usedPrefix + command} https://youtube.com/watch?v=li_smPIZOZs`);

    try {
        // Consulta tu API
        let api = `https://dey-yt.onrender.com/api/download?url=${encodeURIComponent(text)}`;
        let res = await fetch(api);
        let json = await res.json();

        if (!json.status || !json.res?.url) {
            return m.reply("❌ No se pudo obtener el audio.");
        }

        let { title, filesize, quality, thumbnail, url } = json.res;

        // Enviar información + audio
        await conn.sendMessage(m.chat, {
            audio: { url },
            mimetype: 'audio/mpeg',
            fileName: `${title}.mp3`,
            contextInfo: {
                externalAdReply: {
                    title: title,
                    body: `Tamaño: ${filesize} | Calidad: ${quality}`,
                    thumbnailUrl: thumbnail,
                    sourceUrl: text,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply("⚠️ Error al procesar tu solicitud.");
    }
};

handler.help = ["playmp3"].map(v => v + " <url>");
handler.tags = ["downloader"];
handler.command = ["playmp3", "ytmp3"];

export default handler;
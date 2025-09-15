import fetch from "node-fetch";

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return m.reply(`⚠️ Ingresa un link de YouTube\n\nEjemplo:\n${usedPrefix + command} https://youtube.com/watch?v=li_smPIZOZs`);

    try {
        // Mensaje de búsqueda
        const searchingMsg = await conn.sendMessage(m.chat, { text: '🔎 Buscando tu audio...' }, { quoted: m });

        // Consulta tu API
        let api = `https://dey-yt.onrender.com/api/download?url=${encodeURIComponent(text)}`;
        let res = await fetch(api);
        let json = await res.json();

        if (!json.status || !json.res?.url) {
            return conn.sendMessage(m.chat, { text: '❌ No se pudo obtener el audio.' }, { quoted: m });
        }

        let { title, filesize, quality, thumbnail, url } = json.res;

        // Eliminar mensaje de "buscando"
        await conn.sendMessage(m.chat, { delete: searchingMsg.key });

        // Enviar audio
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
        m.reply("⚠️ Ocurrió un error al procesar tu solicitud.");
    }
};

handler.help = ["playmp3"].map(v => v + " <url>");
handler.tags = ["downloader"];
handler.command = ["playmp3", "ytmp3"];

export default handler;
import axios from 'axios';
import cheerio from 'cheerio';

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('❌ Por favor, ingresa el link de la canción de Spotify.');

    try {
        // 1. Obtener HTML del track
        const resp = await axios.get(text, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        const $ = cheerio.load(resp.data);

        // 2. Sacar preview, título y artista
        const preview = $('meta[property="og:audio"]').attr('content');
        const title = $('meta[property="og:title"]').attr('content');
        const artist = $('meta[name="music:musician"]').attr('content');

        if (!preview) return m.reply('❌ No se pudo obtener el preview de la canción.');

        // 3. Enviar mensaje con audio
        await conn.sendMessage(m.chat, {
            audio: { url: preview },
            mimetype: 'audio/mpeg',
            fileName: title + '.mp3',
            caption: `🎵 ${title}\n👤 ${artist}`
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply('❌ Ocurrió un error al obtener la canción.');
    }
};

handler.command = /^(spotify|sp2)$/i;
export default handler;
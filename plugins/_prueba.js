import axios from 'axios';
import cheerio from 'cheerio';

let handler = async (m, { conn, text }) => {
    if (!text) return m.reply('❌ Por favor, ingresa el nombre de la canción.');

    try {
        // 1. Buscar canción en Spotify mediante el buscador web
        const searchUrl = `https://open.spotify.com/search/${encodeURIComponent(text)}`;
        const searchResp = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        });

        // Obtener el primer track desde el HTML
        const trackUrlMatch = searchResp.data.match(/"url":"(\/track\/[a-zA-Z0-9]+)"/);
        if (!trackUrlMatch) return m.reply('❌ No se encontró la canción.');

        const trackUrl = 'https://open.spotify.com' + trackUrlMatch[1];

        // 2. Scrape de la página del track para obtener preview
        const trackResp = await axios.get(trackUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        const $$ = cheerio.load(trackResp.data);
        const previewUrl = $$('meta[property="og:audio"]').attr('content');

        if (!previewUrl) return m.reply('❌ No se pudo obtener el preview de la canción.');

        // 3. Enviar audio
        await conn.sendMessage(m.chat, {
            audio: { url: previewUrl },
            mimetype: 'audio/mpeg',
            fileName: text + '.mp3'
        }, { quoted: m });

    } catch (e) {
        console.error(e);
        m.reply('❌ Ocurrió un error al buscar la canción.');
    }
};

handler.command = /^(spotify|sp)$/i;
export default handler;
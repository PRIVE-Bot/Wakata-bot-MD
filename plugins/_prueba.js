import { default: makeWASocket, proto } from '@whiskeysockets/baileys';
import axios from 'axios';
import cheerio from 'cheerio';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) return conn.reply(m.chat, '❌ Por favor, ingresa el nombre de la canción.', m);

    try {
        // 1. Buscar canción en Spotify (scrapeando la búsqueda)
        const query = encodeURIComponent(text);
        const searchUrl = `https://open.spotify.com/search/${query}`;
        const searchResp = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        });

        const $ = cheerio.load(searchResp.data);

        // 2. Obtener primer track (tomamos el href de la primera pista)
        let trackHref = $('a[href^="/track/"]').attr('href');
        if (!trackHref) return conn.reply(m.chat, '❌ No se encontró la canción.', m);

        const trackUrl = 'https://open.spotify.com' + trackHref;

        // 3. Scraper del track para obtener og:audio (mp3-preview)
        const trackPage = await axios.get(trackUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        });

        const $$ = cheerio.load(trackPage.data);
        const previewUrl = $$('meta[property="og:audio"]').attr('content');
        if (!previewUrl) return conn.reply(m.chat, '❌ No se pudo obtener el preview de la canción.', m);

        // 4. Enviar al chat
        await conn.sendMessage(m.chat, {
            audio: { url: previewUrl },
            mimetype: 'audio/mpeg',
            fileName: text + '.mp3'
        }, { quoted: m });

    } catch (err) {
        console.error(err);
        conn.reply(m.chat, '❌ Ocurrió un error al buscar la canción.', m);
    }
};

handler.command = /^(spotify|sp)$/i;
export default handler;
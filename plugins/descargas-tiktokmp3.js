import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return conn.reply(m.chat, `🎩 Ingrese una URL de TikTok\n*Ejemplo:* ${usedPrefix + command} https://vm.tiktok.com/dirección`, m, fake);

    try {
        
        let api = `https://eliasar-yt-api.vercel.app/api/search/tiktok?query=${args[0]}`;
        let response = await fetch(api);
        let json = await response.json();

        let res = Array.isArray(json.results) ? json.results[0] : json.results;
        if (!res) return m.reply('❌ No se encontró ningún resultado.');

        let ttt = `*Autor:* ${res.author || 'Desconocido'}\n*Título:* ${res.title || 'Sin título'}`;

        // API de descarga
        let dark = await (await fetch(`https://dark-core-api.vercel.app/api/download/tiktok?key=dk-vip&url=${args[0]}`)).json();
        let aud = res.audio;
        let img = dark.result?.thumbnail || null;

        // Validar imagen
        if (img) await conn.sendFile(m.chat, img, 'thumbnail.jpg', ttt, m).catch(err => console.log('Error enviando thumbnail:', err));

        // Validar audio
        if (aud) {
            await conn.sendMessage(
                m.chat,
                { audio: { url: aud.toString() }, mimetype: 'audio/mpeg' },
                { quoted: m }
            ).catch(err => console.log('Error enviando audio:', err));
        } else {
            m.reply('❌ No se pudo obtener el audio del TikTok.');
        }

        if (conn.react) m.react('✅');

    } catch (e) {
        m.reply(`⚠️ Error: ${e.message}`);
        if (conn.react) m.react('✖️');
    }
}

handler.command = ['tiktokmp3', 'ttmp3'];

export default handler;
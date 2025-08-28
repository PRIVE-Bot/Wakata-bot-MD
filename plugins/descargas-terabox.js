import axios from 'axios';
import { URL } from 'url';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    

    if (!text) {
        return m.reply(`${emoji} Por favor, ingresa un enlace de *Terabox*.`);
    }

    try {
        new URL(text);
    } catch (e) {
        return m.reply(`${emoji} Por favor, ingresa una URL válida.`);
    }

    await m.react('🕓');

    try {
        const result = await terabox(text);
        if (!result.length) {
            return m.reply(`${emoji} No se encontraron archivos para descargar en el enlace proporcionado.`);
        }

        for (let i = 0; i < result.length; i++) {
            const { fileName, type, thumb, url } = result[i];

            if (!fileName || !url) {
                console.error('Error: Datos del archivo incompletos', { fileName, url });
                continue;
            }

            const caption = `
┏━━━━━━━━━━━━━━━━⌼
┇ *Nombre File:* ${fileName}
┇ *Formato:* ${type}
┇ URL: ${url}
┗━━━━━━━━━━━━━━━━⍰
`;
            
            try {
                await conn.sendFile(m.chat, url, fileName, caption, m, false, {
                    thumbnail: thumb ? await getBuffer(thumb) : null
                });
                await m.react(emoji);
            } catch (error) {
                console.error('Error al enviar el archivo:', error);
                m.reply(`${emoji2} Error al enviar el archivo: ${fileName}`);
            }
        }
    } catch (err) {
        console.error('Error general:', err.message);
        m.reply(`${emoji2} Ocurrió un error al descargar el archivo.`);
    }
};

handler.help = ["terabox *<url>*"];
handler.tags = ["dl"];
handler.command = ['terabox', 'tb'];
handler.group = true;
handler.register = true;
handler.coin = 5;

export default handler;

async function terabox(url) {
    const fileDataResponse = await axios.post('https://teradl-api.dapuntaratya.com/generate_file', {
        mode: 1,
        url: url
    });

    const data = fileDataResponse.data;

    if (!data.list || data.list.length === 0) {
        throw new Error('No se encontró la lista de archivos en la respuesta de la API.');
    }

    const files = [];

    for (const file of data.list) {
        try {
            const downloadLinkResponse = await axios.post('https://teradl-api.dapuntaratya.com/generate_link', {
                js_token: data.js_token,
                cookie: data.cookie,
                sign: data.sign,
                timestamp: data.timestamp,
                shareid: data.shareid,
                uk: data.uk,
                fs_id: file.fs_id
            });

            const downloadData = downloadLinkResponse.data;

            if (downloadData.download_link && downloadData.download_link.url_1) {
                files.push({
                    fileName: file.name,
                    type: file.type,
                    thumb: file.image,
                    url: downloadData.download_link.url_1
                });
            }
        } catch (linkError) {
            console.error(`Error al generar el enlace para el archivo "${file.name}".`);
        }
    }

    return files;
}

async function getBuffer(url) {
    try {
        const res = await axios({
            method: 'get',
            url,
            responseType: 'arraybuffer'
        });
        return res.data;
    } catch (err) {
        console.error('Error al obtener el buffer:', err);
        return null;
    }
}

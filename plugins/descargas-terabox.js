/*import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`${emoji} Por favor, ingresa un enlace de *Terabox*.`);
  await m.react('🕓');

  try {
    const result = await terabox(text);
    if (!result.length) return m.reply(`${emoji2} ingresa una URL válida.`);

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
┇  URL: ${url}
┗━━━━━━━━━━━━━━━━⍰
`;
      console.log(`Enviando archivo: ${fileName}, URL: ${url}`);

      try {
        await conn.sendFile(m.chat, url, fileName, caption, m, false, {
          thumbnail: thumb ? await getBuffer(thumb) : null
        });
        await m.react('✅');
      } catch (error) {
        console.error('Error al enviar el archivo:', error);
        m.reply(`${msm} Error al enviar el archivo: ${fileName}`);
      }
    }
  } catch (err) {
    console.error('Error general:', err);
    m.reply('Error al descargar el archivo.');
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
  return new Promise(async (resolve, reject) => {
    await axios
      .post('https://teradl-api.dapuntaratya.com/generate_file', {
        mode: 1,
        url: url
      })
      .then(async (a) => {
        const array = [];
        for (let x of a.data.list) {
          let dl = await axios
            .post('https://teradl-api.dapuntaratya.com/generate_link', {
              js_token: a.data.js_token,
              cookie: a.data.cookie,
              sign: a.data.sign,
              timestamp: a.data.timestamp,
              shareid: a.data.shareid,
              uk: a.data.uk,
              fs_id: x.fs_id
            })
            .then((i) => i.data)
            .catch((e) => e.response);

          if (!dl.download_link || !dl.download_link.url_1) {
            console.error('Error: Enlace de descarga no encontrado', dl);
            continue;
          }

          array.push({
            fileName: x.name,
            type: x.type,
            thumb: x.image,
            url: dl.download_link.url_1
          });
        }
        resolve(array);
      })
      .catch((e) => {
        console.error('Error en la API Terabox:', e.response.data);
        reject(e.response.data);
      });
  });
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
}*/



import axios from "axios";
import * as cheerio from "cheerio";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`⚠️ Ingresa un enlace de *Terabox*.\n\nEjemplo:\n${usedPrefix + command} https://terabox.com/s/1abcdXYZ`);

  await m.react('🕓');

  try {
    const result = await teraboxScraper(text);

    if (!result.length) {
      await m.react('❌');
      return m.reply("⚠️ No se pudieron obtener archivos, revisa el enlace.");
    }

    for (let { fileName, size, url } of result) {
      let caption = `
┏━━━━━━━━━━━━━━━━⌼
┇ *Nombre:* ${fileName}
┇ *Tamaño:* ${size}
┇ *Descarga:* ${url}
┗━━━━━━━━━━━━━━━━⍰
`;
      await conn.sendMessage(m.chat, { text: caption }, { quoted: m });
    }

    await m.react('✅');
  } catch (e) {
    console.error("Error general:", e);
    await m.react('❌');
    m.reply("❌ Ocurrió un error al procesar el enlace.");
  }
};

handler.help = ["terabox *<url>*"];
handler.tags = ["dl"];
handler.command = ["terabox", "tb"];

export default handler;

/* ================================
   Scraper Terabox funcional
   ================================ */
async function teraboxScraper(url) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const $ = cheerio.load(data);

    // Buscar scripts donde Terabox guarda la info
    const script = $("script").filter((i, el) => $(el).html().includes("window.__PRELOADED_STATE__")).html();
    if (!script) return [];

    const json = JSON.parse(script.match(/window\.__PRELOADED_STATE__\s*=\s*(\{.*\});/)[1]);

    if (!json.shareCommon || !json.fileList) return [];

    const files = json.fileList.list.map((file) => ({
      fileName: file.server_filename,
      size: formatBytes(file.size),
      url: `https://d.terabox.com/download/${file.fs_id}`, // aproximado
    }));

    return files;
  } catch (err) {
    console.error("Error en scraper Terabox:", err.message);
    return [];
  }
}

function formatBytes(bytes) {
  if (!+bytes) return "0 B";
  const k = 1024,
    sizes = ["B", "KB", "MB", "GB", "TB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}
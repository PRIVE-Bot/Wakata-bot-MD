import { igdl } from 'ruhend-scraper';

const handler = async (m, { text, conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `${emojis} Necesitas enviar un enlace de Facebook para descargar.`, m, rcanal);
  }

  let res;
  try {
    await m.react(rwait);
    res = await igdl(args[0]);
  } catch (e) {
    return conn.reply(m.chat, `${emojis} hubo un error al obtener los datos. ¿Seguro que el enlace es válido?`, m, rcanal);
  }

  let result = res?.data;
  if (!result || result.length === 0) {
    return conn.reply(m.chat, `${emojis} No se encontró nada... prueba con otro link.`, m, rcanal);
  }

  let data;
  try {
    data = result.find(i => i.resolution === "720p (HD)") || result.find(i => i.resolution === "360p (SD)");
  } catch (e) {
    return conn.reply(m.chat, `${emojis} no se pudo procesar el video.`, m, rcanal);
  }

  if (!data) {
    return conn.reply(m.chat, `${emojis} No hay resolución compatible disponible.`, m, rcanal);
  }

  let video = data.url;


  let {
    title = "Desconocido",
    duration = "No disponible",
    size = "Desconocido",
    resolution = data.resolution || "Sin datos",
    thumbnail
  } = data;

  let infoMsg = `

🎞️ *Resolución:* ${resolution}
🌐 *Origen:* Facebook
🔗 *Enlace:* ${args[0]}
`.trim();

  try {
    await conn.sendMessage(m.chat, {
      video: { url: video },
      caption: infoMsg,
      fileName: 'facebook_video.mp4',
      mimetype: 'video/mp4'
    }, { quoted: m });

    await m.react(done);
  } catch (e) {
    await m.react(error);
    return conn.reply(m.chat, `${emojis} no se pudo obtener el vídeo...`, m, rcanal);
  }
};

handler.help = ['facebook', 'fb'];
handler.tags = ['descargas'];
handler.command = ['facebook', 'fb'];

handler.group = true;

export default handler;
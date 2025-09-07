/*import fetch from 'node-fetch';
import { igdl } from 'ruhend-scraper';

const handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `${emoji} Necesitas enviar un enlace de *Facebook* para descargar.`, m, rcanal);
  }

  
  const regexFacebook = /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/[^\s]+$/i;
  if (!regexFacebook.test(args[0])) {
    return conn.reply(m.chat, `${emoji} El enlace proporcionado no es válido o no pertenece a *Facebook* ❌`, m, rcanal);
  }

  let res;
  try {
    if (m.react) await m.react('⏳');
    res = await igdl(args[0]); 
  } catch (e) {
    return conn.reply(m.chat, `${emoji} Hubo un error al obtener los datos. ¿Seguro que el enlace es válido?`, m, rcanal);
  }

  let result = Array.isArray(res) ? res : res?.data;
  if (!result || result.length === 0) {
    return conn.reply(m.chat, `${emoji} No se encontró nada... prueba con otro link.`, m, rcanal);
  }

  let data;
  try {
   
    data = result.find(i => i.resolution === "720p (HD)") || result.find(i => i.resolution === "360p (SD)") || result[0];
  } catch (e) {
    return conn.reply(m.chat, `${emoji} No se pudo procesar el video.`, m, rcanal);
  }

  if (!data?.url) {
    return conn.reply(m.chat, `${emoji} No hay resolución compatible disponible.`, m, rcanal);
  }

  let video = data.url;

 
  const resThumb = await fetch('https://files.catbox.moe/nbkung.jpg');
  const thumb2 = Buffer.from(await resThumb.arrayBuffer());

  const fkontak = {
    key: {
      participants: ["0@s.whatsapp.net"],
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      locationMessage: {
        name: `𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔 𝗗𝗘 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞`,
        jpegThumbnail: thumb2
      }
    },
    participant: "0@s.whatsapp.net"
  };

  let infoMsg = `
🎞️ *Resolución:* ${data.resolution || "Sin datos"}
🌐 *Origen:* Facebook
🔗 *Enlace:* ${args[0]}

`.trim();

  try {
    await conn.sendMessage(m.chat, {
      video: { url: video },
      caption: infoMsg,
      fileName: 'facebook_video.mp4',
      mimetype: 'video/mp4'
    }, { quoted: fkontak });

    if (m.react) await m.react('✅');
  } catch (e) {
    if (m.react) await m.react('❌');
    return conn.reply(m.chat, `${emoji} No se pudo obtener el vídeo...`, m, rcanal);
  }
};

handler.help = ['facebook <url>', 'fb <url>'];
handler.tags = ['descargas'];
handler.command = ['facebook', 'fb'];
handler.group = true;

export default handler;*/



import fetch from 'node-fetch'
import { igdl } from 'ruhend-scraper'

const handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `${emoji} Necesitas enviar un enlace de *Facebook* para descargar.`, m, rcanal)
  }

  const regexFacebook = /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/[^\s]+$/i
  if (!regexFacebook.test(args[0])) {
    return conn.reply(m.chat, `${emoji} El enlace proporcionado no es válido o no pertenece a *Facebook* ❌`, m, rcanal)
  }

  let res
  try {
    if (m.react) await m.react('⏳')
    res = await igdl(args[0])
  } catch {
    return conn.reply(m.chat, `${emoji} Hubo un error al obtener los datos. ¿Seguro que el enlace es válido?`, m, rcanal)
  }

  let result = Array.isArray(res) ? res : res?.data
  if (!result || result.length === 0) {
    return conn.reply(m.chat, `${emoji} No se encontró nada... prueba con otro link.`, m, rcanal)
  }

  let data
  try {
    data = result.find(i => i.resolution === "720p (HD)") || result.find(i => i.resolution === "360p (SD)") || result[0]
  } catch {
    return conn.reply(m.chat, `${emoji} No se pudo procesar el video.`, m, rcanal)
  }

  if (!data?.url) {
    return conn.reply(m.chat, `${emoji} No hay resolución compatible disponible.`, m, rcanal)
  }

  let video = data.url

  const resThumb = await fetch('https://files.catbox.moe/nbkung.jpg')
  const thumb2 = Buffer.from(await resThumb.arrayBuffer())

  const fkontak = {
    key: { participants: ["0@s.whatsapp.net"], remoteJid: "status@broadcast", fromMe: false, id: "Halo" },
    message: { locationMessage: { name: `𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗`, jpegThumbnail: thumb2 } },
    participant: "0@s.whatsapp.net"
  }

  let infoMsg = `
🎥 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑

*🌟 MENÚ DE VIDEOS DE FACEBOOK 🎵*

📺 Resolución » ${data.resolution || "Desconocida"}  
🌐 Origen » Facebook  

*➔ Responde con el número para descargar:*

1️ ⇶ Vídeo normal 📽️  
2️ ⇶ Sólo audio 🎵  
3️ ⇶ Nota de vídeo 🕳️
`.trim()

  await conn.reply(m.chat, infoMsg, m, rcanal)

  conn.ev.once('messages.upsert', async ({ messages }) => {
    let quoted = messages[0]
    if (!quoted.message) return
    let num = (quoted.text || quoted.message.conversation || "").trim()

    if (!["1", "2", "3"].includes(num)) return

    await conn.reply(m.chat, `${emoji} Enviando contenido...`, quoted, rcanal)

    try {
      if (num === "1") {
        await conn.sendMessage(m.chat, { video: { url: video }, caption: "📥 Aquí tienes tu vídeo normal." }, { quoted: fkontak })
      } else if (num === "2") {
        await conn.sendMessage(m.chat, { audio: { url: video }, mimetype: 'audio/mp4' }, { quoted: fkontak })
      } else if (num === "3") {
        await conn.sendMessage(m.chat, { video: { url: video }, ptt: true, mimetype: 'video/mp4' }, { quoted: fkontak })
      }
      if (m.react) await m.react('✅')
    } catch {
      if (m.react) await m.react('❌')
      return conn.reply(m.chat, `${emoji} No se pudo obtener el contenido...`, m, rcanal)
    }
  })
}

handler.help = ['facebook <url>', 'fb <url>']
handler.tags = ['descargas']
handler.command = ['facebook', 'fb']
//handler.group = true

export default handler
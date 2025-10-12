import fetch from "node-fetch";
import yts from "yt-search";
import Jimp from "jimp";
import axios from "axios";
import crypto from "crypto";

async function resizeImage(buffer, size = 300) {
  const image = await Jimp.read(buffer);
  return image.resize(size, size).getBufferAsync(Jimp.MIME_JPEG);
}

const savetube = {
  api: {
    base: "https://media.savetube.me/api",
    info: "/v2/info",
    download: "/download",
    cdn: "/random-cdn"
  },
  headers: {
    accept: "*/*",
    "content-type": "application/json",
    origin: "https://yt.savetube.me",
    referer: "https://yt.savetube.me/",
    "user-agent": "Postify/1.0.0"
  },
  crypto: {
    hexToBuffer: (hex) => Buffer.from(hex.match(/.{1,2}/g).join(""), "hex"),
    decrypt: async (enc) => {
      const keyHex = "C5D58EF67A7584E4A29F6C35BBC4EB12";
      const data = Buffer.from(enc, "base64");
      const iv = data.slice(0, 16);
      const content = data.slice(16);
      const decipher = crypto.createDecipheriv("aes-128-cbc", savetube.crypto.hexToBuffer(keyHex), iv);
      let decrypted = decipher.update(content);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return JSON.parse(decrypted.toString());
    }
  },
  isUrl: (str) => {
    try { new URL(str); return /youtube.com|youtu.be/.test(str); } 
    catch { return false; }
  },
  youtube: (url) => {
    const patterns = [/youtube.com\/watch\?v=([a-zA-Z0-9_-]{11})/, /youtube.com\/embed\/([a-zA-Z0-9_-]{11})/, /youtu.be\/([a-zA-Z0-9_-]{11})/];
    for (let p of patterns) if (p.test(url)) return url.match(p)[1];
    return null;
  },
  request: async (endpoint, data = {}, method = "post") => {
    try {
      const { data: res } = await axios({ method, url: endpoint.startsWith("http") ? endpoint : savetube.api.base + endpoint, data: method==="post"?data:undefined, params: method==="get"?data:undefined, headers: savetube.headers });
      return { status: true, data: res };
    } catch (e) { return { status: false, error: e.message }; }
  },
  getCDN: async () => { const r = await savetube.request(savetube.api.cdn, {}, "get"); return r.status ? { status: true, cdn: r.data.cdn } : r; },
  download: async (url, type="audio") => {
    if (!savetube.isUrl(url)) return { status:false, error:"URL inválida" };
    const id = savetube.youtube(url);
    if (!id) return { status:false, error:"No se pudo obtener ID del video" };
    try {
      const cdnRes = await savetube.getCDN();
      if (!cdnRes.status) return cdnRes;
      const infoRes = await savetube.request(`https://${cdnRes.cdn}${savetube.api.info}`, { url: `https://www.youtube.com/watch?v=${id}` });
      if (!infoRes.status) return infoRes;
      const decrypted = await savetube.crypto.decrypt(infoRes.data.data);
      const dlRes = await savetube.request(`https://${cdnRes.cdn}${savetube.api.download}`, { id, downloadType: type==="audio"?"audio":"video", quality:type==="audio"?"mp3":"720p", key:decrypted.key });
      if (!dlRes.data.data?.downloadUrl) return { status:false, error:"No se pudo obtener link de descarga" };
      return { status:true, result:{ title:decrypted.title||"Desconocido", format:type==="audio"?"mp3":"mp4", download:dlRes.data.data.downloadUrl, thumbnail:decrypted.thumbnail||null } };
    } catch(e){ return { status:false, error:e.message }; }
  }
};

const handler = async (m, { conn, text, command, global, botname, channelRD }) => {
  if (!text?.trim()) return conn.reply(m.chat, "❀ Dime el nombre de la canción o video que buscas", m);
  try { await m.react('🔎'); } catch{}

  let url, title, thumbnail, author, timestamp, views, ago, seconds;
  if (savetube.isUrl(text)) {
    url = text;
    title = "YouTube Video";
    thumbnail = "https://i.postimg.cc/rFfVL8Ps/image.jpg";
    author = { name: 'Desconocido' };
    timestamp = 'Desconocido';
    views = 0;
    ago = 'Desconocido';
    seconds = 0;
  } else {
    const search = await yts.search({ query: text, pages: 1 });
    if (!search.videos.length) return m.reply("❌ No se encontró nada con ese nombre.");
    const vid = search.videos[0];
    url = vid.url;
    title = vid.title;
    thumbnail = vid.thumbnail;
    author = vid.author;
    timestamp = vid.timestamp;
    views = vid.views;
    ago = vid.ago;
    seconds = vid.seconds;
  }

  if (seconds > 1800) return m.reply('⚠ El video supera el límite de 30 minutos.');

  let thumb;
  try {
    const thumbFileRes = await conn.getFile(thumbnail);
    thumb = await resizeImage(thumbFileRes.data, 300);
  } catch { thumb = null; }

  const res3 = await fetch('https://files.catbox.moe/wfd0ze.jpg');
  const thumb3 = Buffer.from(await res3.arrayBuffer());

  const fkontak2 = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
      documentMessage: {
        title: "𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗡𝗗𝗢",
        fileName: botname,
        jpegThumbnail: thumb3
      }
    }
  }

  const fkontak = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
      orderMessage: {
        itemCount: 1,
        status: 1,
        surface: 1,
        message: `「 ${title} 」`,
        orderTitle: "Mejor Bot",
        thumbnail: thumb
      }
    }
  };

  const vistas = views >= 1000 ? (views / 1000).toFixed(1) + "k (" + views.toLocaleString() + ")" : views.toString();

  const infoMessage = `★ ${global.botname || 'Bot'} ★

  ┏☾ *Titulo:* 「 ${title} 」 
┏┛  *Canal:* ${author?.name || 'Desconocido'} 
┃✎ *Vistas:* ${vistas} 
┃✎ *Duración:* ${timestamp}
┃✎ *Publicado:* ${ago}
┃
┗⌼ ᴅᴇsᴄᴀʀɢᴀɴᴅᴏ...`;

  await conn.sendMessage(
    m.chat,
    {
      image: thumb,
      caption: infoMessage,
      ...global.rcanal,
    },
    { quoted: fkontak2 }
  );

  if (["play","yta","ytmp3","playaudio"].includes(command)) {
    try { await m.react('🎧'); } catch{}
    const dl = await savetube.download(url,"audio");
    if (!dl.status) return m.reply(`❌ Error: ${dl.error}`);
    await conn.sendMessage(m.chat,{ audio:{ url:dl.result.download }, mimetype:"audio/mpeg", fileName:`${dl.result.title}.mp3` }, { quoted:fkontak });
  }

  if (["play2","ytv","ytmp4","mp4"].includes(command)) {
    try { await m.react('📽️'); } catch{}
    const dl = await savetube.download(url,"video");
    if (!dl.status) return m.reply(`❌ Error: ${dl.error}`);
    await conn.sendMessage(m.chat,{ video:{ url:dl.result.download }, fileName:`${dl.result.title}.mp4`, mimetype:"video/mp4", thumbnail:thumb }, { quoted:fkontak });
  }

  try { await m.react('✔️'); } catch{}
};

handler.command = handler.help = ["play","play2","yta","ytv","ytmp3","ytmp4","playaudio","mp4"];
handler.tags = ["downloader"];
export default handler;
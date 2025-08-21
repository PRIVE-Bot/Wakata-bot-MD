import axios from 'axios';
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

// 🔹 Subir imagen a telegra.ph (hosting gratis y rápido)
async function uploadImage(buffer) {
  const form = new FormData();
  form.append('file', buffer, 'file.jpg');

  const res = await fetch('https://telegra.ph/upload', {
    method: 'POST',
    body: form
  });

  const json = await res.json();
  if (json.error) throw new Error(json.error);

  return 'https://telegra.ph' + json[0].src;
}

let handler = async (m, { text, conn, usedPrefix, command }) => {
  let url, prompt;

  try {
    // 🔹 Caso 1: Responder una imagen
    if (m.quoted && /image/.test(m.quoted.mimetype || '')) {
      if (!text) return m.reply(`Formato:\nResponde una imagen con:\n${usedPrefix + command} <prompt>\n\nEjemplo:\n${usedPrefix + command} ponele en color negro`);
      const mediaPath = await conn.downloadAndSaveMediaMessage(m.quoted);
      url = await uploadImage(fs.readFileSync(mediaPath));
      prompt = text.trim();
    }

    // 🔹 Caso 2: Enviar imagen con caption
    else if (m.message?.imageMessage) {
      if (!text) return m.reply(`Formato:\nEnvía una imagen con:\n${usedPrefix + command} <prompt>\n\nEjemplo:\n${usedPrefix + command} ponele en color negro`);
      const mediaPath = await conn.downloadAndSaveMediaMessage(m);
      url = await uploadImage(fs.readFileSync(mediaPath));
      prompt = text.trim();
    }

    // 🔹 Caso 3: Texto con url | prompt
    else if (text && text.includes('|')) {
      const [link, pr] = text.split('|').map(v => v.trim());
      if (!link || !pr) return m.reply(`Formato incorrecto!\nEjemplo:\n${usedPrefix + command} https://files.catbox.moe/1zw3ek.jpeg | Ubah rambutnya jadi putih`);
      url = link;
      prompt = pr;
    }

    // 🔹 Ningún caso válido
    else {
      return m.reply(`Formato:\n${usedPrefix + command} <url> | <prompt>\nO responde/envía imagen con:\n${usedPrefix + command} <prompt>\n\nEjemplo:\n${usedPrefix + command} https://files.catbox.moe/1zw3ek.jpeg | Ubah rambutnya jadi putih`);
    }

    // ✨ Llamar a la API
    await m.react('✨');
    const apiUrl = `https://api-faa-skuarta.vercel.app/faa/editfoto?url=${encodeURIComponent(url)}&prompt=${encodeURIComponent(prompt)}`;
    const res = await axios.get(apiUrl, { responseType: 'arraybuffer' });

    await conn.sendMessage(m.chat, { image: res.data, caption: `✅ *EDIT COMPLETADO*` }, { quoted: m });
    await m.react('🪄');

  } catch (e) {
    console.error(e);
    m.reply("❌ Error al procesar la imagen.");
  }
};

handler.command = ['edit', 'editimg'];
handler.help = ['edit <url>|<prompt>', 'editimg'];
handler.tags = ['ai'];

export default handler;
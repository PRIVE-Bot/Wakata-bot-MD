import axios from 'axios';

let handler = async (m, { text, conn, usedPrefix, command }) => {
    let url, prompt;

    
    if (m.quoted && /image/.test(m.quoted.mimetype || '')) {
        if (!text) return m.reply(`Format:\nResponde una imagen con:\n${usedPrefix + command} <prompt>\n\nEjemplo:\n${usedPrefix + command} ponele en color negro`);
        url = await conn.downloadAndSaveMediaMessage(m.quoted);
        prompt = text.trim();
    } 
    
    else if (text && text.includes('|')) {
        const parts = text.split('|').map(v => v.trim());
        url = parts[0];
        prompt = parts[1];
    } 
    
    else if (m.message?.imageMessage) {
        if (!text) return m.reply(`Format:\nEnvía una imagen con:\n${usedPrefix + command} <prompt>\n\nEjemplo:\n${usedPrefix + command} ponele en color negro`);
        url = await conn.downloadAndSaveMediaMessage(m);
        prompt = text.trim();
    } 
    else {
        return m.reply(`Format:\n${usedPrefix + command} <url> | <prompt>\nO responde/envía imagen con:\n${usedPrefix + command} <prompt>\n\nEjemplo:\n${usedPrefix + command} https://files.catbox.moe/1zw3ek.jpeg | Ubah rambutnya jadi putih`);
    }

    try {
  await m.react('✨');
        const apiUrl = `https://api-faa-skuarta.vercel.app/faa/editfoto?url=${encodeURIComponent(url)}&prompt=${encodeURIComponent(prompt)}`;
        const res = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        await conn.sendMessage(m.chat, { image: res.data, caption: `*EDIT COMPLETADO*` }, { quoted: m });
  await m.react('🪄');
    } catch (e) {
        console.error(e);
        m.reply("❌ Gagal memproses gambar.");
    }
};

handler.command = ['edit', 'editimg'];
handler.help = ['edit', 'editimg']
handler.tags = ['ai']

export default handler;
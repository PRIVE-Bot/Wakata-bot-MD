import axios from 'axios';
import fs from 'fs';
import uploadImage from '../lib/uploadImage.js'; 

let handler = async (m, { text, conn, usedPrefix, command }) => {
    let url, prompt;

    try {
        if (m.quoted && /image/.test(m.quoted.mimetype || '')) {
            if (!text) return m.reply(`Formato:\nResponde una imagen con:\n${usedPrefix + command} <prompt>\n\nEjemplo:\n${usedPrefix + command} ponele en color negro`);
            const mediaPath = await conn.downloadAndSaveMediaMessage(m.quoted);
            url = await uploadImage(fs.readFileSync(mediaPath)); // subimos a host de imágenes
            prompt = text.trim();
        } 
        
        else if (text && text.includes('|')) {
            const parts = text.split('|').map(v => v.trim());
            url = parts[0];
            prompt = parts[1];
        } 
        
        else if (m.message?.imageMessage) {
            if (!text) return m.reply(`Formato:\nEnvía una imagen con:\n${usedPrefix + command} <prompt>\n\nEjemplo:\n${usedPrefix + command} ponele en color negro`);
            const mediaPath = await conn.downloadAndSaveMediaMessage(m);
            url = await uploadImage(fs.readFileSync(mediaPath));
            prompt = text.trim();
        } 
        
        else {
            return m.reply(`Formato:\n${usedPrefix + command} <url> | <prompt>\nO responde/envía imagen con:\n${usedPrefix + command} <prompt>\n\nEjemplo:\n${usedPrefix + command} https://files.catbox.moe/1zw3ek.jpeg | Ubah rambutnya jadi putih`);
        }

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
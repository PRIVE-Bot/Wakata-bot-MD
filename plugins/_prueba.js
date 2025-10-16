import fetch from "node-fetch";
import { fileTypeFromBuffer } from "file-type";
import crypto from "crypto";
import { URLSearchParams } from "url"; // Importamos URLSearchParams si se usa node-fetch

const API_URL = "https://api.kirito.my/api/upload"; 

async function kiritoUploader(buffer) {
    let { mime: detectedMime } = (await fileTypeFromBuffer(buffer)) || {};
    let base64Data = buffer.toString("base64");
    let dataURI = `data:${detectedMime || 'application/octet-stream'};base64,${base64Data}`;
    
    let res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: dataURI }) 
    });

    // Siempre intenta obtener la data JSON, incluso si el estado no es OK
    const data = await res.json().catch(async () => {
        const txt = await res.text().catch(() => "");
        return { status: false, error: "Respuesta no JSON", raw: txt };
    });

    if (!res.ok) {
        // Lanza un error con el mensaje y el JSON de la API si no es 2xx
        const apiError = JSON.stringify(data, null, 2);
        throw new Error(`Error HTTP ${res.status}. Respuesta API: ${apiError}`);
    }

    if (!data.status) {
        // Lanza un error si la API devuelve status: false
        const apiError = JSON.stringify(data, null, 2);
        throw new Error(`Subida fallida (status: false). Respuesta API: ${apiError}`);
    }

    // Devuelve el objeto de datos completo tal como lo envió la API
    return { data, detectedMime };
}


let handler = async (m, { conn, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    if (!mime) return conn.reply(m.chat, `📎 Por favor, responde a un archivo válido (imagen, video, audio, etc.)`, m, rcanal);

    await m.react('⬆️');

    let loaderMsg;

    try {
        let media = await q.download();
        loaderMsg = await conn.sendMessage(m.chat, { text: `🚀 Subiendo archivo...` }, { quoted: m });
        
        // La función devuelve el objeto 'data' completo de la API
        const { data, detectedMime } = await kiritoUploader(media);
        
        let preview = {};
        if (detectedMime?.startsWith("image")) {
            preview.image = { url: data.url };
        } else if (detectedMime?.startsWith("video")) {
            preview.video = { url: data.url, mimetype: detectedMime };
        } else {
            preview.text = `📄 Archivo subido con éxito.`; 
        }

        // Usamos los campos de 'data' directamente
        let txt = `*乂 K I R I T O  -  U P L O A D 乂*\n\n`;
        txt += `*» URL:* ${data.url}\n`;
        txt += `*» Tipo:* ${data.tipo || detectedMime}\n`;
        txt += `*» Tamaño:* ${data.tamaño}\n`;
        if (data.mensaje) txt += `*» Mensaje:* ${data.mensaje}\n`;
        txt += `*» Status:* ${data.status}\n\n`;
        txt += `> Kirito-Bot MD`;

        await conn.sendMessage(m.chat, { ...preview, caption: txt }, { quoted: m });
        await m.react('✅'); 
        await conn.sendMessage(m.chat, { delete: loaderMsg.key });
        await m.react('👑');

    } catch (err) {
        if (loaderMsg) await conn.sendMessage(m.chat, { delete: loaderMsg.key });
        // Muestra el JSON de error de la API si está disponible
        const errorMessage = err.message.includes('Respuesta API') ? 
                             `❌ Falló la subida. Verifique el JSON de error:\n\n\`\`\`json\n${err.message}\n\`\`\`` :
                             `❌ Ocurrió un error general: ${err.message}`;
                             
        await conn.sendMessage(m.chat, { text: errorMessage }, { quoted: m });
    }
};

handler.help = ['kirito_upload'];
handler.tags = ['transformador'];
handler.command = ['kirito_upload', 'post'];
export default handler;

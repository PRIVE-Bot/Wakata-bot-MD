import fetch from "node-fetch";
import { fileTypeFromBuffer } from "file-type";

let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  if (!mime) return conn.reply(m.chat, `Por favor, responde a un archivo válido (imagen, video, audio, etc.)`, m);

  await m.react('⬆️');

  let loaderMsg;

  try {
    let media = await q.download();
    let { mime: detectedMime, ext } = (await fileTypeFromBuffer(media)) || {};
    let base64Data = media.toString("base64");
    let dataURI = `data:${detectedMime || mime};base64,${base64Data}`;
    
    loaderMsg = await conn.sendMessage(m.chat, { text: "🚀 Subiendo archivo..." }, { quoted: m });
    
    let folder = detectedMime?.startsWith("image") ? "images" :
                 detectedMime?.startsWith("video") ? "videos" : "files";
    
    
    let name = `file-${Date.now()}.${ext || 'bin'}`;

    const API_URL = "https://api.kirito.my/api/upload"; 

    let res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file: dataURI, name, folder })
    });
    
    if (!res.ok) {
        const errorText = await res.text().catch(() => `Estado ${res.status}`);
        throw new Error(`Error en la petición API: ${res.status} - ${errorText.substring(0, 100)}`);
    }

    let data = await res.json().catch(async () => {
      const txt = await res.text().catch(() => "");
      return { status: false, error: "Respuesta no JSON", raw: txt };
    });

    if (!data.status) {
      if (loaderMsg) await conn.sendMessage(m.chat, { delete: loaderMsg.key });
      await conn.sendMessage(m.chat, { text: `❌ Error al subir el archivo: ${data.error || 'Desconocido'}` }, { quoted: m });
      return;
    }

    let preview = {};
    if (detectedMime?.startsWith("image")) {
        preview.image = { url: data.url }; 
    } else if (detectedMime?.startsWith("video")) {
        preview.video = { url: data.url, mimetype: data.tipo || detectedMime }; 
    } else {
        preview.text = `📄 Archivo subido con éxito.`; 
    }

    let txt = `*乂 K I R I T O - U P L O A D 乂*\n\n`;
    txt += `*» URL:* ${data.url}\n`;
    txt += `*» Tipo:* ${data.tipo}\n`;
    txt += `*» Tamaño:* ${data.tamaño}\n`;
    if (data.mensaje) txt += `*» Mensaje:* ${data.mensaje}\n\n`;
    txt += `> Kirito-Bot MD`;

    await conn.sendMessage(m.chat, { ...preview, caption: txt }, { quoted: m });
    await m.react('✅'); 
    await conn.sendMessage(m.chat, { delete: loaderMsg.key });

  } catch (err) {
    if (loaderMsg) await conn.sendMessage(m.chat, { delete: loaderMsg.key });
    console.error(err);
    await conn.sendMessage(m.chat, { text: `❌ Ocurrió un error: ${err.message}` }, { quoted: m });
  }
};

handler.help = ['tourl3', 'kiritofile', 'kiritourl'];
handler.tags = ['transformador'];
handler.command = ['tourl3', 'kiritofile', 'kiritourl'];
export default handler;

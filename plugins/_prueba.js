import fetch from "node-fetch";
import { fileTypeFromBuffer } from "file-type";

let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  if (!mime) return conn.reply(m.chat, `${emoji} Por favor, responde a un archivo válido (imagen, video, audio, etc.)`, m, rcanal);

  await m.react('⏳');

  try {
    let media = await q.download();
    let { mime: detectedMime, ext } = (await fileTypeFromBuffer(media)) || {};
    let base64 = media.toString("base64");

    let loaderMsg = await conn.sendMessage(m.chat, { text: "🚀 Subiendo archivo..." }, { quoted: m });

    let res = await fetch("https://api.kirito.my/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file: base64 })
    });

    let data = await res.json();

    if (!data.status) {
      await conn.sendMessage(m.chat, { text: `❌ Error al subir el archivo: ${data.error || 'Desconocido'}` }, { quoted: m });
      return;
    }

    let preview = {};
    if (detectedMime?.startsWith("image")) preview.image = { url: `data:${detectedMime};base64,${base64}` };
    else if (detectedMime?.startsWith("video")) preview.video = { url: `data:${detectedMime};base64,${base64}`, mimetype: detectedMime };
    else preview.text = "📄 Vista previa no disponible para este tipo de archivo";

    let txt = `*乂 K I R I T O  -  U P L O A D 乂*\n\n`;
    txt += `*» URL:* ${data.url}\n`;
    txt += `*» Tipo:* ${data.tipo}\n`;
    txt += `*» Tamaño:* ${data.tamaño}\n`;
    if (data.mensaje) txt += `*» Mensaje:* ${data.mensaje}\n\n`;
    txt += `> Kirito-Bot MD`;

    await conn.sendMessage(m.chat, { ...preview, caption: txt }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    await conn.sendMessage(m.chat, { delete: loaderMsg.key });

  } catch (err) {
    console.error(err);
    await conn.sendMessage(m.chat, { text: `❌ Ocurrió un error: ${err.message}` }, { quoted: m });
  }
};

handler.help = ['tourl3', 'kiritofile', 'Kiritourl'];
handler.tags = ['transformador'];
handler.command = ['tourl3', 'kiritofile', 'kiritourl'];
export default handler;
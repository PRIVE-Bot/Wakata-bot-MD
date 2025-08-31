const handler = async (m, { conn, text }) => {
  const canal = "120363403593951965@newsletter";

  if (!m.quoted) return m.reply("✳️ Debes responder a un mensaje para reenviarlo al canal.");

  try {
    let q = m.quoted;
    let mime = q.mimetype || q.mediaType;

    if (mime) {
      // Si es archivo multimedia
      let media = await q.download();
      let type = mime.startsWith("image") ? "image"
               : mime.startsWith("video") ? "video"
               : mime.startsWith("audio") ? "audio"
               : mime === "image/webp" ? "sticker"
               : null;

      if (!type) return m.reply("❌ Tipo de archivo no soportado.");

      await conn.sendMessage(canal, {
        [type]: media,
        mimetype: mime,
        caption: type !== "sticker" ? (text || q.text || "") : undefined
      });

    } else {
      // Si es solo texto
      let content = q.text || q.body || text;
      if (!content) return m.reply("❌ No se pudo obtener el texto del mensaje citado.");

      await conn.sendMessage(canal, { text: content });
    }

    m.reply("✅ Mensaje reenviado correctamente al canal.");
  } catch (e) {
    console.error("Error al reenviar:", e);
    m.reply(`❌ Error al reenviar: ${e.message}`);
  }
};

handler.command = /^reenviar|canalmsg$/i;
export default handler;
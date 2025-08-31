const handler = async (m, { conn }) => {
  const canal = "120363403593951965@newsletter"; // ID del canal

  if (!m.quoted) {
    return m.reply("✳️ Debes responder a un mensaje para reenviarlo al canal.");
  }

  try {
    const q = m.quoted;
    const msg = q.msg || q.message;

    if (!msg) {
      return m.reply("❌ No se pudo obtener el contenido del mensaje citado.");
    }

    await conn.copyNForward(canal, { ...q, message: msg }, true);
    m.reply("✅ Mensaje reenviado correctamente al canal.");
  } catch (e) {
    console.error("Error al reenviar:", e);
    if (e.message?.includes("403")) {
      m.reply("❌ No tengo permisos para enviar mensajes a ese canal. Agrega el bot como administrador.");
    } else {
      m.reply(`❌ Ocurrió un error al reenviar el mensaje: ${e.message}`);
    }
  }
};

handler.command = /^reenviar|canalmsg$/i;
export default handler;
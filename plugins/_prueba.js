const handler = async (m, { conn }) => {
  const canal = "120363403593951965@newsletter"; // ID del canal

  if (!m.quoted) {
    return m.reply("✳️ Debes responder a un mensaje para reenviarlo al canal.");
  }

  try {
    // Intentamos cargar el mensaje completo
    const q = m.quoted;
    const msg = await conn.loadMessage(q.key.remoteJid, q.key.id);

    if (!msg) {
      return m.reply("❌ No se pudo recuperar el mensaje citado.");
    }

    await conn.copyNForward(canal, msg, true);
    m.reply("✅ Mensaje reenviado correctamente al canal.");
  } catch (e) {
    console.error("Error al reenviar:", e);

    if (e.message && e.message.includes("403")) {
      m.reply("❌ No tengo permisos para enviar mensajes a ese canal. Agrega el bot como administrador.");
    } else {
      m.reply(`❌ Ocurrió un error al reenviar el mensaje: ${e.message}`);
    }
  }
};

handler.command = /^reenviar|canalmsg$/i;
export default handler;
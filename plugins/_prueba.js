const handler = async (m, { conn, command }) => {
  const canal = "120363403593951965@newsletter";

  if (!m.quoted) {
    return m.reply("✳️ Debes etiquetar un mensaje para reenviarlo al canal.");
  }

  try {
    const q = m.quoted;
    
    // Validamos que el mensaje citado y su clave existen antes de continuar
    if (!q || !q.message || !q.key || !q.key.id) {
        return m.reply("❌ El mensaje citado no es válido o no se puede reenviar.");
    }

    await conn.relayMessage(canal, q.message, { messageId: q.key.id });
    m.reply("✅ Mensaje reenviado correctamente al canal.");
  } catch (e) {
    console.error("Error al reenviar el mensaje:", e);
    
    if (e.message && e.message.includes("403")) {
      m.reply("❌ Error: No tengo permisos para enviar mensajes a ese canal. Asegúrate de que el bot es administrador.");
    } else {
      m.reply(`❌ Ocurrió un error al reenviar el mensaje: ${e.message}`);
    }
  }
};

handler.command = /^reenviar|canalmsg$/i;
export default handler;

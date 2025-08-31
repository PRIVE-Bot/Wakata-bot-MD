const handler = async (m, { conn, command }) => {
  const canal = "120363403593951965@newsletter";

  if (!m.quoted) {
    return m.reply("✳️ Debes etiquetar un mensaje para reenviarlo al canal.");
  }

  try {
    const quotedMessage = m.quoted.isBaileys ? m.quoted.msg : m.quoted;
    if (!quotedMessage) {
        return m.reply("❌ Error: No se pudo obtener el mensaje citado correctamente.");
    }
    
    await conn.copyNForward(canal, quotedMessage, true);
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

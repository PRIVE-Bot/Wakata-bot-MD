const handler = async (m, { conn, command }) => {
  const canal = "120363403593951965@newsletter";

  if (!m.quoted) return m.reply("✳️ Debes etiquetar un mensaje para reenviarlo al canal.");

  try {
    let q = m.quoted;
    await conn.copyNForward(canal, q, true);
    m.reply("✅ Mensaje reenviado correctamente al canal.");
  } catch (e) {
    // Aquí se imprime la información del error completo
    console.error("Error al reenviar el mensaje:", e);
    // Y se le da al usuario un mensaje más específico si es posible
    if (e.message.includes("403")) { // 403 suele ser un error de permisos
      m.reply("❌ Error: No tengo permisos para enviar mensajes a ese canal. Asegúrate de que el bot es administrador.");
    } else {
      m.reply(`❌ Ocurrió un error al reenviar el mensaje: ${e.message}`);
    }
  }
};

handler.command = /^reenviar|canalmsg$/i; 
export default handler;

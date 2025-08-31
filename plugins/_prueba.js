export async function before(m, { conn }) {
  if (!m.message) return;

  // Detectar si es orderMessage
  if (m.message.orderMessage) {
    console.log("=== OrderMessage detectado ===");
    console.log(JSON.stringify(m, null, 2)); // lo imprime completo en consola

    // Opcional: enviarlo al chat en texto para inspección
    await conn.sendMessage(m.chat, {
      text: "📦 OrderMessage recibido:\n```" + JSON.stringify(m.message.orderMessage, null, 2) + "```"
    }, { quoted: m });
  }
}
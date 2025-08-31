// plugins/reenviar-canal.js
import { generateForwardMessageContent, generateWAMessageFromContent } from "@whiskeysockets/baileys";

const handler = async (m, { conn }) => {
  const canal = "120363403593951965@newsletter"; // tu canal

  if (!m.quoted) return m.reply("✳️ Debes etiquetar un mensaje para reenviarlo al canal.");

  try {
    // Generar contenido del mensaje original
    const content = await generateForwardMessageContent(m.quoted, false);

    // Crear mensaje con ese contenido
    const msg = generateWAMessageFromContent(canal, content, {
      userJid: conn.user.id,
      quoted: null, // sin citar nada en el canal
    });

    // Enviar al canal
    await conn.relayMessage(canal, msg.message, { messageId: msg.key.id });

    m.reply("✅ Mensaje reenviado correctamente al canal.");
  } catch (e) {
    console.error(e);
    m.reply("❌ Ocurrió un error al reenviar el mensaje.");
  }
};

handler.command = /^reenviar|canalmsg$/i;
export default handler;
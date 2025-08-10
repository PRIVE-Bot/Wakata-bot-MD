// plugins/reaction-prueba.js

let handler = async (m, { conn, command }) => {
  // Comando manual para probar
  if (command === 'prueba1') {
    await conn.sendMessage(m.chat, { text: 'Comando prueba1 ejecutado correctamente ✅' }, { quoted: m });
  }
};

// Escucha reacciones (mensajes con reactionMessage)
handler.all = async function (m, { conn }) {
  try {
    if (!m.message) return;
    if (!m.message.reactionMessage) return;

    const reaction = m.message.reactionMessage.text;
    const sender = m.key.participant || m.key.remoteJid;

    // Solo responde si la reacción es ❤️ o 👍
    if (reaction === '❤️' || reaction === '👍') {
      await conn.sendMessage(sender, {
        text: `👍 Has reaccionado correctamente con el emoji ${reaction} y el código funciona correctamente.`
      }, { quoted: m });
    }
  } catch (e) {
    console.error('Error en plugin reaction-prueba:', e);
  }
};

handler.command = /^(prueba1)$/i;


export default handler;
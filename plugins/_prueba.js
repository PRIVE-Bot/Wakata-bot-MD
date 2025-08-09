import reactionHandler from '../lib/reaction.js';

let handler = async (m, { conn }) => {
  // inicializa (si no está inicializado)
  reactionHandler.init(conn, { debug: true });

  // envía y registra en un solo paso
  const { sent, msgId } = await reactionHandler.sendAndRegister(m.chat, { text: 'Reacciona ✅ para confirmar o ❌ para cancelar (válido 60s).' }, [
    {
      emoji: '✅',
      callback: async ({ chatId, by, conn }) => {
        await conn.sendMessage(chatId, { text: `✅ Confirmado por @${(by||'unknown').split('@')[0]}` }, { mentions: [by] });
      },
      options: { once: true, timeout: 60000, onlyFrom: m.sender } // sólo la persona que ejecutó el comando
    },
    {
      emoji: '❌',
      callback: async ({ chatId, by, conn }) => {
        await conn.sendMessage(chatId, { text: `❌ Cancelado por @${(by||'unknown').split('@')[0]}` }, { mentions: [by] });
      },
      options: { once: true, timeout: 60000, onlyFrom: m.sender }
    }
  ]);

  // mensaje de confirmación (opcional)
  if (msgId) {
    await conn.sendMessage(m.chat, { text: `Mensaje enviado. ID: ${msgId}. Reacciona con ✅ o ❌ (60s).` });
  } else {
    await conn.sendMessage(m.chat, { text: 'Error: no se obtuvo msgId al enviar el mensaje.' });
  }
};

handler.command = ['testreact', 'reacttest'];
export default handler;
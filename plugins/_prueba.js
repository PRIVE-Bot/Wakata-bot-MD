import reactionHandler from '../lib/reaction.js';

let handler = async (m) => {
  const { sent, msgId } = await reactionHandler.sendAndRegister(
    m.chat,
    { text: 'Reacciona ✅ para confirmar o ❌ para cancelar (válido 60s).' },
    [
      {
        emoji: '✅',
        callback: async ({ chatId, by, conn }) => {
          await conn.sendMessage(chatId, { text: `✅ Confirmado por @${(by||'unknown').split('@')[0]}` }, { mentions: [by] });
        },
        options: { once: true, timeout: 60000, onlyFrom: m.sender }
      },
      {
        emoji: '❌',
        callback: async ({ chatId, by, conn }) => {
          await conn.sendMessage(chatId, { text: `❌ Cancelado por @${(by||'unknown').split('@')[0]}` }, { mentions: [by] });
        },
        options: { once: true, timeout: 60000, onlyFrom: m.sender }
      }
    ]
  );

  if (!msgId) {
    await m.reply('⚠ No se pudo obtener el ID del mensaje, revisa consola.');
  }
};

handler.command = ['testreact', 'reacttest'];
export default handler;
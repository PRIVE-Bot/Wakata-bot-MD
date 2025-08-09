import reactionHandler from '../lib/reaction.js';

let handler = async (m, { conn }) => {
    let sent = await conn.sendMessage(m.chat, { text: "Reacciona con ✅ para confirmar o ❌ para cancelar" });

    // ✅ Confirmar
    reactionHandler.registerReaction(sent.key.id, '✅', async ({ from, conn }) => {
        await conn.sendMessage(from, { text: "✅ Acción confirmada" });
    });

    // ❌ Cancelar
    reactionHandler.registerReaction(sent.key.id, '❌', async ({ from, conn }) => {
        await conn.sendMessage(from, { text: "❌ Acción cancelada" });
    });
};

handler.command = ['testreact'];
export default handler;
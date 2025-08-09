import reactionHandler from '../lib/reaction.js';

let handler = async (m, { conn }) => {
    // Envía el mensaje y guarda su ID
    let sent = await conn.sendMessage(m.chat, { text: "Reacciona con ✅ para confirmar o ❌ para cancelar" });

    // Registrar acción para ✅
    reactionHandler.registerReaction(sent.key.id, '✅', async ({ from, conn }) => {
        await conn.sendMessage(from, { text: "✅ Acción confirmada desde el plugin." });
    });

    // Registrar acción para ❌
    reactionHandler.registerReaction(sent.key.id, '❌', async ({ from, conn }) => {
        await conn.sendMessage(from, { text: "❌ Acción cancelada desde el plugin." });
    });
};

handler.command = ['testreact'];
export default handler;
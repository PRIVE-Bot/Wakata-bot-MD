// lib/reactionHandler.js
let registeredReactions = [];

/**
 * Registrar una reacción
 * @param {string} msgId - ID del mensaje que debe recibir la reacción
 * @param {string} emoji - Emoji que debe detectar
 * @param {function} callback - Función a ejecutar
 */
function registerReaction(msgId, emoji, callback) {
    registeredReactions.push({ msgId, emoji, callback });
}

/**
 * Escuchar reacciones desde Baileys
 * @param {object} conn - Conexión de Baileys
 */
function listenReactions(conn) {
    conn.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0];

        // Detectar si es un mensaje de reacción
        if (m.message?.reactionMessage) {
            const emoji = m.message.reactionMessage.text;
            const reactedMsgId = m.message.reactionMessage.key.id;
            const from = m.key.remoteJid;

            for (let r of registeredReactions) {
                if (r.msgId === reactedMsgId && r.emoji === emoji) {
                    try {
                        await r.callback({ from, emoji, msgId: reactedMsgId, conn });
                    } catch (err) {
                        console.error("Error ejecutando reacción:", err);
                    }
                }
            }
        }
    });
}

export default {
    registerReaction,
    listenReactions
};
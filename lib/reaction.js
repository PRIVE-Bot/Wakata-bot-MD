// lib/reactionHandler.js

let registeredReactions = [];

/**
 * Registrar una reacción
 * @param {string} msgId - ID del mensaje que debe recibir la reacción
 * @param {string} emoji - Emoji que debe detectar (ej. ✅)
 * @param {function} callback - Función a ejecutar cuando se detecta la reacción
 */
function registerReaction(msgId, emoji, callback) {
    registeredReactions.push({ msgId, emoji, callback });
}

/**
 * Escuchar reacciones desde Baileys
 * @param {object} conn - Conexión de Baileys
 */
function listenReactions(conn) {
    conn.ev.on('messages.update', async (update) => {
        for (const { key, update: msgUpdate } of update) {
            if (msgUpdate.reaction) {
                const emoji = msgUpdate.reaction.text;
                const reactedMsgId = msgUpdate.reaction.key.id;

                for (let r of registeredReactions) {
                    if (r.msgId === reactedMsgId && r.emoji === emoji) {
                        try {
                            await r.callback({
                                from: key.remoteJid,
                                emoji,
                                msgId: reactedMsgId,
                                conn
                            });
                        } catch (err) {
                            console.error("Error ejecutando reacción:", err);
                        }
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
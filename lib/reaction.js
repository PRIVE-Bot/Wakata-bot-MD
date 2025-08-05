export async function esperarReaccion(conn, chatId, fromJid, emojiEsperado, mensajeTexto, tiempo = 30000) {
    return new Promise(async (resolve, reject) => {
        try {
            // Enviar UN mensaje al que se debe reaccionar
            const mensaje = await conn.sendMessage(chatId, { text: mensajeTexto });

            const handler = async ({ reaction }) => {
                if (!reaction) return;
                if (reaction.key.id !== mensaje.key.id) return; // debe ser al mensaje enviado
                if (reaction.key.remoteJid !== chatId) return;
                if (reaction.key.participant !== fromJid) return;
                if (reaction.text !== emojiEsperado) return;

                conn.ev.off('messages.reaction', handler); // limpiar
                resolve(true);
            };

            conn.ev.on('messages.reaction', handler);

            // Tiempo máximo para reaccionar
            setTimeout(() => {
                conn.ev.off('messages.reaction', handler);
                resolve(false);
            }, tiempo);
        } catch (err) {
            reject(err);
        }
    });
}
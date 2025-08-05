

export async function esperarReaccion(conn, chatId, fromJid, emojiEsperado, mensajeTexto, tiempo = 30000) {
    return new Promise(async (resolve, reject) => {
        try {
            
            let enviado = await conn.sendMessage(chatId, { text: mensajeTexto }, { quoted: null });

            const handler = async ({ reaction }) => {
                try {
                    if (!reaction) return;
                    if (reaction.key.remoteJid !== chatId) return;
                    if (reaction.key.participant !== fromJid) return;
                    if (reaction.text !== emojiEsperado) return;

                    conn.ev.off('messages.reaction', handler);
                    resolve(true);
                } catch (err) {
                    reject(err);
                }
            };

            conn.ev.on('messages.reaction', handler);

            
            setTimeout(() => {
                conn.ev.off('messages.reaction', handler);
                resolve(false);
            }, tiempo);
        } catch (err) {
            reject(err);
        }
    });
}
export async function esperarReaccion(conn, chatId, fromJid, emojiEsperado, mensajeTexto, tiempo = 30000) {
    return new Promise(async (resolve, reject) => {
        try {
            // Enviar el mensaje y guardar su ID
            const { key } = await conn.sendMessage(chatId, { text: mensajeTexto });

            const handler = async (reactionUpdate) => {
                const r = reactionUpdate.reaction;
                if (!r) return;

                // Confirmar que es el mismo mensaje
                if (r.key?.id !== key.id) return;

                // Confirmar que es la persona correcta
                if ((r.key?.participant || r.participant) !== fromJid) return;

                // Confirmar que es el emoji correcto
                if (r.text !== emojiEsperado) return;

                conn.ev.off('messages.reaction', handler);
                resolve(true);
            };

            conn.ev.on('messages.reaction', handler);

            // Expira después de cierto tiempo
            setTimeout(() => {
                conn.ev.off('messages.reaction', handler);
                resolve(false);
            }, tiempo);
        } catch (e) {
            reject(e);
        }
    });
}
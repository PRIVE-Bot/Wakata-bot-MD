let mensajesReaccion = {};

export async function handler(m, { conn, command }) {
    if (command === 'testreact') {
        const mensajeParaReaccionar = 'Reacciona con ❤️ para activar la acción';
        const mensajeEnviado = await conn.sendMessage(m.chat, {
            text: mensajeParaReaccionar
        });

        if (mensajeEnviado?.key?.id) {
            mensajesReaccion[mensajeEnviado.key.id] = {
                chat: m.chat,
                remitenteOriginal: m.sender,
                textoEsperado: '❤️'
            };
        }
    }
}

handler.command = /^testreact$/i;

// Escuchamos el evento de reacción directamente aquí.
// El manejador principal del bot debe llamar a esta función en cada evento messages.upsert.
// Si tu manejador de plugins lo soporta, podrías usar un hook `before`.
// De lo contrario, este código funcionará si se ejecuta en cada mensaje.
export async function before(m, {
    conn
}) {
    // Verificamos si el mensaje es una reacción.
    if (m.message && m.message.reactionMessage) {
        const reaction = m.message.reactionMessage;
        const keyOriginal = reaction.key;
        const emoji = reaction.text;

        const datosMensaje = mensajesReaccion[keyOriginal.id];

        if (datosMensaje && emoji === datosMensaje.textoEsperado) {
            const {
                chat
            } = datosMensaje;

            await conn.sendMessage(chat, {
                text: `✅ ¡Acción ejecutada! El usuario ${m.sender} ha reaccionado con ${emoji}`
            });

            delete mensajesReaccion[keyOriginal.id];
        }
    }
}

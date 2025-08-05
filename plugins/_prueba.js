import { esperarReaccion } from '../lib/reaction.js';

let handler = async (m, { conn }) => {
    const emojiEsperado = '✅';
    const mensajeTexto = `🧠 Reacciona con *${emojiEsperado}* a este mensaje para confirmar la acción.`;

    const confirmado = await esperarReaccion(conn, m.chat, m.sender, emojiEsperado, mensajeTexto);

    if (confirmado) {
        m.reply('✅ ¡Reacción confirmada! Ejecutando acción...');
        // Tu acción aquí...
    } else {
        m.reply('⏱️ No reaccionaste a tiempo o con el emoji correcto.');
    }
};

handler.command = ['reaccionar'];
export default handler;
import { esperarReaccion } from '../lib/reaction.js';

let handler = async (m, { conn }) => {
    const emoji = '✅';
    const mensaje = `👆 Reacciona con *${emoji}* a este mensaje para confirmar. Tienes 30 segundos.`;

    const confirmado = await esperarReaccion(conn, m.chat, m.sender, emoji, mensaje);

    if (confirmado) {
        m.reply('✅ ¡Confirmado! Acción ejecutada.');
        // Aquí tu acción
    } else {
        m.reply('❌ No reaccionaste a tiempo o usaste otro emoji.');
    }
};

handler.command = ['reaccionar'];
export default handler;
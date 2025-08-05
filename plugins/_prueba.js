import { esperarReaccion } from '../lib/reaction.js';

let handler = async (m, { conn }) => {
    const emojiEsperado = '✅';

    await conn.sendMessage(m.chat, { text: `🧠 Reacciona con *${emojiEsperado}* a este mensaje para confirmar la acción.` }, { quoted: m });

    const confirmado = await esperarReaccion(conn, m.chat, m.sender, emojiEsperado, `Reacciona con ${emojiEsperado} para continuar...`);

    if (confirmado) {
        m.reply('✅ ¡Reacción confirmada! Ejecutando acción...');
        // Aquí tu lógica (por ejemplo: eliminar, banear, ejecutar otro comando, etc.)
    } else {
        m.reply('⏱️ No reaccionaste a tiempo o con el emoji correcto.');
    }
};

handler.command = ['reaccionar'];
export default handler;
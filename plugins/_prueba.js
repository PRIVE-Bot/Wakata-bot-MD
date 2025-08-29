import { createMessageWithReactions } from '../lib/reaction.js';

let handler = async (m, { conn }) => {
    const actions = {
        
        'ℹ️': { type: 'exec_command', data: { command: '.info' } },
        
        '📝': { type: 'exec_command', data: { command: '.help' } },
    };

    const infoMessage = `
Reacciona para ver más información.

ℹ️ = Ver info del bot
📝 = Ver lista de comandos
`;

    const msg = await conn.reply(m.chat, infoMessage, m);
    await createMessageWithReactions(conn, msg, actions);
};


handler.help = ['showinfo'];
handler.tags = ['general'];
handler.command = ['showinfo'];

export default handler;

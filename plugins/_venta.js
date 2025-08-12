

/*let handler = async (m, { conn }) => {
  let texto = `🌟 ¡Compra *${global.botname}* por $5! 🌟\n\nDesbloquea funciones premium y úsalo en tus grupos.\n\n¡Contáctame por privado para más información!`

  try {
    await conn.sendPayment(m.chat, '500', texto, m)
    await conn.sendMessage(m.chat, '💸 Mensaje de venta enviado aquí.', { quoted: m })
  } catch (e) {
    await conn.sendMessage(m.chat, 'Ocurrió un error al enviar el pago.', { quoted: m })
  }
}

handler.tags = ['main']
handler.command = handler.help = ['buy', 'comprar']

export default handler*/


import { createMessageWithReactions, setActionCallback } from '../lib/reaction.js';

let handler = async (m, { conn, text }) => {
  let texto = `🌟 ¡Compra *${global.botname}* por $5! 🌟\n\nDesbloquea funciones premium y úsalo en tus grupos.\n\n¡Contáctame por privado para más información!`

  try {
    const actions = {
        '🔥': { type: 'show_owner', data: {} },
    };

    await conn.sendPayment(m.chat, '500', texto, m);
    
    const reactionMessage = `\n\n*Para contactar al dueño, reacciona con 🔥*`
    const msg = await conn.sendMessage(m.chat, { text: reactionMessage }, { quoted: m });

    await createMessageWithReactions(conn, msg, actions);

  } catch (e) {
    await conn.sendMessage(m.chat, { text: 'Ocurrió un error al enviar el pago.' }, { quoted: m });
    console.error(e);
  }
};


setActionCallback('show_owner', async (conn, chat) => {
    
    const fakeMessage = {
        key: {
            remoteJid: chat,
            fromMe: false,
            id: 'FAKE_MSG_ID'
        },
        message: {
            conversation: '.creador'
        }
    };
    
    
    await conn.handler(fakeMessage);
});

handler.tags = ['main'];
handler.command = handler.help = ['buy', 'comprar'];

export default handler;

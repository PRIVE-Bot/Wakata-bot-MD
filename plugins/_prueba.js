

let handler = async (m, { conn }) => {
  
    await conn.reply(m.chat, `Hola me puedes ver?`, m, rcanal1);
};

handler.command = /^1$/i;
export default handler;
const handler = async (m, { conn, text }) => {
  if (!text) throw '✳️ _Por favor, ingresa el nuevo nombre para el bot._';
  
  global.db.data.settings[conn.user.jid].botName = text;
  
  m.reply(`✅ El nombre del bot se ha cambiado exitosamente a: *${text}*`);
};

handler.help = ['setname <nombre>'];
handler.tags = ['owner'];
handler.command = /^(setname)$/i;
handler.owner = true;

export default handler;

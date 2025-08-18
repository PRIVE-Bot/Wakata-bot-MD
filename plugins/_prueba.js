

var handler = async (m, { conn, text }) => {
  return conn.reply(m.chat, `prueba`, m, fake)
};


handler.command = ['1']

export default handler
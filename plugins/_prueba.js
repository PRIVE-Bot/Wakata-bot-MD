const handler = async (m, { conn, text, usedPrefix, command }) => {
    return conn.reply(m.chat, ` prueba `, m)
};

handler.command = ['1']
export default handler
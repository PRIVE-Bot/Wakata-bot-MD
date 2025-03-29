let handler = async (m, { conn, usedPrefix, command }) => {

    try {
        m.reply('👑 ʀᴇɪɴɪᴄɪᴀɴᴅᴏ ᴇʟ ʙᴏᴛ....')
        setTimeout(() => {
            process.exit(0)
        }, 3000) 
    } catch (error) {
        console.log(error)
        conn.reply(m.chat, `${error}`, m)
    }
}

handler.command = ['restart', 'autulizar']
handler.before = async (m, { conn }) => {
    let text = m.text?.toLowerCase()?.trim();
    if (text === 'restart' || text === 'sutualizar') {
        return handler(m, { conn });
    }
}
handler.rowner = true;

export default handler
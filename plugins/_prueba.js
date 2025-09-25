let handler = async (m, { conn, isAdmin, isOwner, text, usedPrefix, command }) => {
    if (command === 'setinfo') {
        if (!(isAdmin || isOwner)) {
            return conn.reply(m.chat, '🚫 Solo administradores pueden configurar la info del grupo.', m)
        }
        if (!text) {
            return conn.reply(m.chat, `⚡ Uso correcto:\n${usedPrefix + command} <información del grupo>`, m)
        }

        global.db.data.chats[m.chat].groupInfo = text
        conn.reply(m.chat, `✅ La información del grupo se guardó correctamente:\n\n📌 ${text}`, m)
    }
}

handler.before = async (m, { conn }) => {
    if (!m.isGroup) return false
    if (!m.text) return false

    let keywords = [
        /para que es el grupo/i,
        /de que es el grupo/i,
        /cual es la info del grupo/i,
        /informacion del grupo/i,
        /grupo para que/i
    ]

    let match = keywords.some(k => k.test(m.text))
    if (!match) return false

    let info = global.db.data.chats[m.chat].groupInfo
    if (!info) {
        return conn.reply(m.chat, 'ℹ️ Aún no se ha configurado información para este grupo.', m)
    }

    await conn.reply(
        m.chat,
        `👋 Hola @${m.sender.split('@')[0]}\n\n📖 El grupo es para:\n${info}`,
        m,
        { mentions: [m.sender] }
    )
    return true
}

handler.command = ['setinfo']
handler.group = true

export default handler
var handler = async (m, { conn, participants, usedPrefix, command }) => {

    if (!m.mentionedJid[0] && !m.quoted) {
        return conn.reply(m.chat, `${emoji} Debes mencionar a un usuario o responder a su mensaje para expulsarlo del grupo.`, m);
    }

    let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;

    const groupInfo = await conn.groupMetadata(m.chat);
    const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
    const ownerBot = global.owner[0][0] + '@s.whatsapp.net';
    const botNumber = conn.decodeJid(conn.user.id);

    if (user === botNumber) {
        return conn.reply(m.chat, `${emoji2} No puedo eliminar al bot del grupo.`, m);
    }

    if (user === ownerGroup) {
        return conn.reply(m.chat, `${emoji2} No puedo eliminar al propietario del grupo.`, m);
    }

    if (user === ownerBot) {
        return conn.reply(m.chat, `${emoji2} No puedo eliminar al propietario del bot.`, m);
    }

    try {
        await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
       // conn.reply(m.chat, `✅ Usuario eliminado del grupo.`, m);
    } catch (e) {
        conn.reply(m.chat, `${emoji} No se pudo eliminar al usuario. Verifica que el bot sea administrador.`, m);
    }
};

handler.help = ['kick'];
handler.tags = ['grupo'];
handler.command = ['kick','echar','hechar','sacar','ban','chu'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
var handler = async (m, { conn, participants, usedPrefix, command }) => {
    if (!m.mentionedJid[0] && !m.quoted) {
        return conn.reply(m.chat, `Debes mencionar a un usuario para expulsarlo de este cuartel galáctico.`, m);
    }

    let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;

    const groupInfo = await conn.groupMetadata(m.chat);
    const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
    const ownerBot = global.owner[0][0] + '@s.whatsapp.net';

    if (user === conn.user.jid) {
        return conn.reply(m.chat, ` No puedo expulsar a mi propia esencia.`, m);
    }

    if (user === ownerGroup) {
        return conn.reply(m.chat, ` No se puede expulsar al capitán del grupo.`, m);
    }

    if (user === ownerBot) {
        return conn.reply(m.chat, ` No puedo expulsar al creador de mi sistema.`, m);
    }

    await conn.groupParticipantsUpdate(m.chat, [user], 'remove');

    //conn.reply(m.chat, ` Un admin ha expulsado a un usuario del grupo:\n*» ${groupInfo.subject}*`, m);
};

handler.help = ['kick'];
handler.tags = ['grupo'];
handler.command = ['kick','echar','hechar','sacar','ban'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
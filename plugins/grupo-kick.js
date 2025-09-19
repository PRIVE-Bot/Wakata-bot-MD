var handler = async (m, { conn, participants, usedPrefix, command, args }) => {
    try {
        if (!m.isGroup) {
            return conn.reply(m.chat, '❌ Este comando solo se puede usar en grupos.', m);
        }

        const groupInfo = await conn.groupMetadata(m.chat);
        const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net';
        const ownerBot = global.owner[0][0] + '@s.whatsapp.net';

        let usersToKick = m.mentionedJid || [];
        const prefix = args[0]?.startsWith('+') ? args[0].replace(/\D/g, '') : null;

        if (m.quoted && !usersToKick.includes(m.quoted.sender)) {
            usersToKick.push(m.quoted.sender);
        }

        if (prefix) {
            let usersFoundByPrefix = [];
            for (let user of participants) {
                const number = user.id.split('@')[0];
                if (number.startsWith(prefix) && !usersToKick.includes(user.id)) {
                    usersToKick.push(user.id);
                    usersFoundByPrefix.push(user.id);
                }
            }
            if (usersFoundByPrefix.length === 0) {
                return conn.reply(m.chat, `⚠️ No se encontraron usuarios en el grupo con el prefijo *${prefix}*.`, m);
            }
        }

        if (!usersToKick.length) {
            return conn.reply(
                m.chat,
                `⚠️ Debes mencionar a alguien, responder a un mensaje o usar un prefijo como:\n*${usedPrefix + command} +504*`,
                m
            );
        }

        let notAllowed = [];
        let notKicked = [];

        for (let user of usersToKick) {
            if (user === conn.user.jid) {
                notAllowed.push('🤖 El bot no puede eliminarse a sí mismo.');
                continue;
            }
            if (user === ownerGroup) {
                notAllowed.push('👑 No se puede expulsar al dueño del grupo.');
                continue;
            }
            if (user === ownerBot) {
                notAllowed.push('🧑‍💻 No se puede expulsar al creador del bot.');
                continue;
            }

            try {
                await conn.groupParticipantsUpdate(m.chat, [user], 'remove');

                // Si se eliminó un mensaje citado del usuario expulsado
                if (m.quoted && m.quoted.sender === user) {
                    await conn.sendMessage(m.chat, { delete: m.quoted.key });
                }

            } catch (e) {
                let reason = '⚠️ Error desconocido';
                if (String(e).includes('not-authorized')) {
                    reason = '⚠️ El bot no tiene permisos para expulsar.';
                } else if (String(e).includes('403')) {
                    reason = '⚠️ No se pudo expulsar (posible restricción de WhatsApp).';
                } else if (String(e).includes('not-in-group')) {
                    reason = '⚠️ El usuario ya no está en el grupo.';
                }

                notKicked.push(`${reason} → @${user.split('@')[0]}`);
            }
        }

        if (notAllowed.length) {
            await conn.reply(m.chat, `❌ *No expulsados:*\n${notAllowed.join('\n')}`, m);
        }

        if (notKicked.length) {
            const notKickedMentions = notKicked.map(line => line.match(/@\d+/)[0]);
            await conn.reply(
                m.chat,
                `❌ *Errores al expulsar:*\n${notKicked.join('\n')}`,
                m,
                { mentions: notKickedMentions }
            );
        }

        if (!notAllowed.length && !notKicked.length) {
            await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
        } else {
            await conn.sendMessage(m.chat, { react: { text: "⚠️", key: m.key } });
        }

    } catch (e) {
        console.error(e);
        conn.reply(m.chat, `❌ Error inesperado: ${e.message}`, m);
    }
};

handler.help = ['kick'];
handler.tags = ['grupo'];
handler.command = ['kick','echar','hechar','sacar','ban'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
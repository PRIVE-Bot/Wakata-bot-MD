var handler = async (m, { conn, participants, usedPrefix, command, args }) => {
  try {
    if (!m.isGroup) return conn.reply(m.chat, '❌ Este comando solo se puede usar en grupos.', m);

    const groupInfo = await conn.groupMetadata(m.chat);
    const ownerGroup = groupInfo?.owner || (m.chat.split('-')[0] + '@s.whatsapp.net');
    const ownerBot = (global.owner && global.owner[0] && global.owner[0][0])
      ? `${global.owner[0][0]}@s.whatsapp.net`
      : conn.user?.jid;

    // --- Normalizar participants (por si la forma cambia entre versiones) ---
    const participantJids = (participants || [])
      .map(p => p.id || p.jid || p.participant || (typeof p === 'string' ? p : null))
      .filter(Boolean);
    const participantSet = new Set(participantJids);

    // --- Normalizar usersToKick (m.mentionedJid puede venir como string, array o undefined) ---
    let usersToKick = [];
    if (m.mentionedJid) {
      usersToKick = Array.isArray(m.mentionedJid) ? [...m.mentionedJid] : [String(m.mentionedJid)];
    }

    // quoted sender (robusto)
    const quotedSender = m.quoted?.sender || m.quoted?.key?.participant || null;
    if (quotedSender && !usersToKick.includes(quotedSender)) usersToKick.push(quotedSender);

    // prefijo tipo +504
    const prefix = args[0]?.startsWith('+') ? args[0].replace(/\D/g, '') : null;
    if (prefix) {
      const found = [];
      for (const member of participantJids) {
        const number = member.split('@')[0];
        if (number.startsWith(prefix) && !usersToKick.includes(member)) {
          usersToKick.push(member);
          found.push(member);
        }
      }
      if (found.length === 0) {
        return conn.reply(m.chat, `⚠️ No se encontraron usuarios en el grupo con el prefijo *${prefix}*.`, m);
      }
    }

    if (!usersToKick.length) {
      return conn.reply(
        m.chat,
        `⚠️ Debes mencionar a alguien, responder a un mensaje o usar un prefijo. Ejemplo:\n*${usedPrefix + command} +504*`,
        m
      );
    }

    // deduplicar y filtrar
    usersToKick = [...new Set(usersToKick)].filter(Boolean);

    const kicked = [];
    const notAllowed = [];
    const notKicked = [];

    for (const user of usersToKick) {
      // validaciones de protección
      if (user === conn.user.jid) {
        notAllowed.push({ jid: user, reason: '🤖 El bot no puede eliminarse a sí mismo.' });
        continue;
      }
      if (user === ownerGroup) {
        notAllowed.push({ jid: user, reason: '👑 No se puede expulsar al dueño del grupo.' });
        continue;
      }
      if (user === ownerBot) {
        notAllowed.push({ jid: user, reason: '🧑‍💻 No se puede expulsar al creador del bot.' });
        continue;
      }

      // está en el grupo?
      if (!participantSet.has(user)) {
        notKicked.push({ jid: user, reason: '⚠️ El usuario no está en el grupo.' });
        continue;
      }

      try {
        await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
        kicked.push(user);

        // si el mensaje citado pertenece al expulsado, intentar borrarlo
        if (quotedSender === user && m.quoted && m.quoted.key) {
          try { await conn.sendMessage(m.chat, { delete: m.quoted.key }); } catch (_) { /* ignore */ }
        }

      } catch (e) {
        // razon legible según mensaje de error
        let reason = e && e.message ? e.message : String(e);
        if (reason.includes('not-authorized') || reason.includes('401')) reason = '⚠️ El bot no tiene permisos administrativos para expulsar.';
        else if (reason.includes('403')) reason = '⚠️ Acción bloqueada por WhatsApp (403).';
        else if (reason.includes('not-in-group')) reason = '⚠️ El usuario ya no está en el grupo.';
        notKicked.push({ jid: user, reason });
        console.error('Error expulsando', user, e);
      }
    }

    // Construir respuesta resumida
    const parts = [];
    if (kicked.length) parts.push('✅ *Expulsados:*\n' + kicked.map(j => `@${j.split('@')[0]}`).join('\n'));
    if (notAllowed.length) parts.push('❌ *No expulsados (protección):*\n' + notAllowed.map(x => `@${x.jid.split('@')[0]} → ${x.reason}`).join('\n'));
    if (notKicked.length) parts.push('⚠️ *Errores al expulsar:*\n' + notKicked.map(x => `@${x.jid.split('@')[0]} → ${x.reason}`).join('\n'));

    const mentions = [
      ...kicked,
      ...notAllowed.map(x => x.jid),
      ...notKicked.map(x => x.jid)
    ].filter(Boolean);

    await conn.reply(m.chat, parts.length ? parts.join('\n\n') : '✅ Proceso terminado.', m, { mentions });

    // reaccion final
    const hadErrors = notAllowed.length || notKicked.length;
    await conn.sendMessage(m.chat, { react: { text: hadErrors ? '⚠️' : '✅', key: m.key } });

  } catch (e) {
    console.error('Handler error:', e);
    await conn.reply(m.chat, `❌ Error inesperado: ${e && e.message ? e.message : String(e)}`, m);
  }
};

handler.help = ['kick'];
handler.tags = ['grupo'];
handler.command = ['kick','echar','hechar','sacar','ban'];
handler.admin = true;
handler.group = true;
handler.botAdmin = true;

export default handler;
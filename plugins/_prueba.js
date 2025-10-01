import moment from 'moment-timezone';

const handler = async (m, { conn, text, command }) => {
  try {
    const nombre = m.pushName || 'Anónimo';
    const tag = '@' + m.sender.split('@')[0];
    const usertag = Array.from(new Set([...m.text.matchAll(/@(\d{5,})/g)]), m => `${m[1]}@s.whatsapp.net`);
    const chatLabel = m.isGroup ? (await conn.getName(m.chat) || 'Grupal') : 'Privado';
    const horario = moment.tz('America/Caracas').format('DD/MM/YYYY hh:mm:ss A');
    const ownerJid = '50432955554@s.whatsapp.net';
    const staffGroup = '120363420911001779@g.us';

    switch (command) {
      case 'report':
      case 'reportar': {
        if (!text) return conn.reply(m.chat, '❀ Por favor, ingresa el error que deseas reportar.', m);
        if (text.length < 10) return conn.reply(m.chat, 'ꕥ Especifique mejor el error, mínimo 10 caracteres.', m);

        await m.react('🕒');

        const rep = `${emoji} 𝗥𝗘𝗣𝗢𝗥𝗧𝗘 𝗥𝗘𝗖𝗜𝗕𝗜𝗗𝗢\n\n${emoji} *Usuario* » ${nombre}\n${emoji} *Tag* » ${tag}\n${emoji} *Reporte* » ${text}\n${emoji} *Chat* » ${chatLabel}\n✰ *Fecha* » ${horario}`;

        if (m.quoted && m.quoted.message) {
          await conn.sendMessage(ownerJid, { text: rep, mentions: [m.sender], quoted: m.quoted });
          await conn.sendMessage(staffGroup, { text: rep, mentions: [m.sender], quoted: m.quoted });
        } else if (m.msg.file || m.msg.image || m.msg.video || m.msg.document) {
          const mediaType = Object.keys(m.message).find(k => ['imageMessage','videoMessage','documentMessage','stickerMessage'].includes(k));
          await conn.sendMessage(ownerJid, { [mediaType]: m.message[mediaType], caption: rep, mentions: [m.sender] });
          await conn.sendMessage(staffGroup, { [mediaType]: m.message[mediaType], caption: rep, mentions: [m.sender] });
        } else {
          await conn.sendMessage(ownerJid, { text: rep, mentions: [m.sender] });
          await conn.sendMessage(staffGroup, { text: rep, mentions: [m.sender] });
        }

        await m.react('✔️');
        m.reply(`${emoji} Tu reporte ha sido enviado al desarrollador. Gracias por ayudar a mejorar el Bot.`);
        break;
      }
      case 'resuelto':
      case 'noresuelto': {
        if (!text) return conn.reply(m.chat, `❌ Debes indicar al usuario a notificar y un comentario opcional.`, m);
        const [target, ...rest] = text.split(' ');
        const comment = rest.join(' ') || 'Sin comentario';
        const jid = target.includes('@s.whatsapp.net') ? target : `${target}@s.whatsapp.net`;

        await conn.sendMessage(jid, { text: `${command === 'resuelto' ? '✅ Tu reporte ha sido marcado como resuelto.' : '❌ Tu reporte ha sido marcado como no resuelto.'}\nComentario del staff: ${comment}` });
        await conn.reply(m.chat, `${command === 'resuelto' ? '✅' : '❌'} Se notificó al usuario ${jid.replace('@s.whatsapp.net','')} sobre el reporte.`, m);
        break;
      }
    }
  } catch (err) {
    await m.react('✖️');
    conn.reply(m.chat, `⚠︎ Se ha producido un error.\n> Usa *report* para informarlo.\n\n${err.message}`, m);
  }
}

handler.help = ['report', 'resuelto', 'noresuelto']
handler.tags = ['main']
handler.command = ['report','reportar','resuelto','noresuelto']

export default handler;
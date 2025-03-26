/** By @MoonContentCreator || https://github.com/MoonContentCreator/BixbyBot-Md **/
import fetch from 'node-fetch';

const handler = async (m, { conn, command, text, isAdmin }) => {
  // Comando para MUTEAR
  if (command === 'mute') {
    if (!isAdmin) throw '🔥 *Solo un administrador puede ejecutar este comando*';

    // Evita que se mute al creador del bot
    const ownerID = global.owner[0][0] + '@s.whatsapp.net';
    if (m.sender === ownerID) throw '👑 *El creador del bot no puede ser mutado*';

    // Determinar el usuario objetivo: se busca en los mencionados, o en el mensaje citado; de lo contrario se usa el texto
    let target = (m.mentionedJid && m.mentionedJid[0])
      ? m.mentionedJid[0]
      : (m.quoted ? m.quoted.sender : text);
    
    // Evita que se mute al bot
    if (target === conn.user.jid) throw '🔥 *No puedes mutar el bot*';

    // Se obtiene la información del chat para verificar si el remitente es el creador del grupo
    const chat = await conn.getChatById(m.chat);
    const groupCreator = chat.groupMetadata ? chat.groupMetadata.split('-')[0] + '@s.whatsapp.net' : null;
    if (m.sender === groupCreator) throw '🔥 *No puedes mutar el creador del grupo*';

    // Se obtiene la información del usuario en la base de datos global
    let userData = global.db.data.users[target];
    if (userData && userData.mute === true) throw '🔥 *Este usuario ya ha sido mutado*';

    // Se prepara un mensaje de notificación con una imagen (vCard) para el mute
    const muteMessage = {
      key: { participants: 'group', fromMe: false, id: '0@s.whatsapp.net' },
      message: {
        locationMessage: {
          name: 'Halo',
          jpegThumbnail: await (await fetch('https://telegra.ph/file/f8324d9798fa2ed2317bc.png')).buffer(),
          vcard:
            'BEGIN:VCARD\n' +
            'VERSION:3.0\n' +
            'N:;Unlimited;;;\n' +
            'FN:Unlimited\n' +
            'ORG:Unlimited\n' +
            'TITLE:\n' +
            'item1.TEL;waid=19709001746:+1 (970) 900-1746\n' +
            'item1.X-ABLabel:Unlimited\n' +
            'X-WA-BIZ-DESCRIPTION:ofc\n' +
            'X-WA-BIZ-NAME:Unlimited\n' +
            'END:VCARD'
        }
      },
      participant: 'group'
    };

    // Si no se mencionó ni se citó a nadie, se pide que mencione
    if (!m.mentionedJid && !m.quoted) {
      return conn.reply(m.chat, '🔥 *Menciona a la persona que deseas demutar*', m);
    }

    // Se envía la notificación y se marca al usuario como "muted" en la base de datos
    conn.reply(m.chat, '*Tus mensajes serán eliminados*', muteMessage, null, { mentions: [target] });
    global.db.data.users[target].mute = true;
  }
  // Comando para DESMUTEAR
  else if (command === 'unmute') {
    if (!isAdmin) throw '🔥 *Solo un administrador puede ejecutar este comando*';

    let target = (m.mentionedJid && m.mentionedJid[0])
      ? m.mentionedJid[0]
      : (m.quoted ? m.quoted.sender : text);
    if (!target) return conn.reply(m.chat, '🔥 *Menciona a la persona que deseas mutar*', m);

    let userData = global.db.data.users[target];
    if (userData && userData.mute === false) throw '🔥 *Este usuario no ha sido mutado*';

    // Se prepara un mensaje de notificación con una imagen (vCard) para el desmute
    const unmuteMessage = {
      key: { participants: 'group', fromMe: false, id: '0@s.whatsapp.net' },
      message: {
        locationMessage: {
          name: 'Usuario demutado',
          jpegThumbnail: await (await fetch('https://telegra.ph/file/aea704d0b242b8c41bf15.png')).buffer(),
          vcard:
            'BEGIN:VCARD\n' +
            'VERSION:3.0\n' +
            'N:;Unlimited;;;\n' +
            'FN:Unlimited\n' +
            'ORG:Unlimited\n' +
            'TITLE:\n' +
            'item1.TEL;waid=19709001746:+1 (970) 900-1746\n' +
            'item1.X-ABLabel:Unlimited\n' +
            'X-WA-BIZ-DESCRIPTION:ofc\n' +
            'X-WA-BIZ-NAME:Unlimited\n' +
            'END:VCARD'
        }
      },
      participant: 'group'
    };

    if (!m.mentionedJid && !m.quoted) {
      return conn.reply(m.chat, '*Tus mensajes no serán eliminados*', m);
    }

    global.db.data.users[target].mute = false;
    conn.reply(m.chat, '*Tus mensajes no serán eliminados*', unmuteMessage, null, { mentions: [target] });
  }
};

handler.command = ['mute', 'unmute'];
handler.admin = true;
handler.botAdmin = true;
export default handler;
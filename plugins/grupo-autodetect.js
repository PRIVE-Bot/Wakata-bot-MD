/* eslint-disable */
import WAMessageStubType from '@whiskeysockets/baileys';
import fetch from 'node-fetch';

export async function before(m, { conn, participants, groupMetadata }) {
  
  let botSettings = global.db.data.settings[conn.user.jid] || {};
  if (botSettings.soloParaJid) {
    return; 
  }
  

  if (!m.messageStubType || !m.isGroup) return;

  const res = await fetch('https://files.catbox.moe/rq6xiz.jpg');
  const thumb2 = Buffer.from(await res.arrayBuffer());

  const fkontak = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
      orderMessage: {
        itemCount: 1,
        status: 1,
        surface: 1,
        message: `𝗘𝗡𝗟𝗔𝗖𝗘 𝗔𝗖𝗧𝗨𝗔𝗟𝗜𝗭𝗔𝗗𝗢`,
        orderTitle: "Mejor Bot",
        jpegThumbnail: thumb2
      }
    }
  };

  const res2 = await fetch('https://i.postimg.cc/y8yzWzjW/1756498087639.jpg');
  const thumb3 = Buffer.from(await res2.arrayBuffer());

  const fkontak2 = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
      orderMessage: {
        itemCount: 1,
        status: 1,
        surface: 1,
        message: `𝗜𝗠𝗔𝗚𝗘𝗡 𝗔𝗖𝗧𝗨𝗔𝗟𝗜𝗭𝗔𝗗𝗔`,
        orderTitle: "Mejor Bot",
        jpegThumbnail: thumb3
      }
    }
  };

  const res3 = await fetch('https://files.catbox.moe/vjx6r8.jpg');
  const thumb4 = Buffer.from(await res3.arrayBuffer());

  const fkontak3 = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
      orderMessage: {
        itemCount: 1,
        status: 1,
        surface: 1,
        message: `𝗡𝗢𝗠𝗕𝗥𝗘 𝗔𝗖𝗧𝗨𝗔𝗟𝗜𝗭𝗔𝗗𝗢`,
        orderTitle: "Mejor Bot",
        jpegThumbnail: thumb4
      }
    }
  };

  const res4 = await fetch('https://files.catbox.moe/vjx6r8.jpg');
  const thumb5 = Buffer.from(await res4.arrayBuffer());

  const fkontak4 = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
      orderMessage: {
        itemCount: 1,
        status: 1,
        surface: 1,
        message: `𝗘𝗗𝗜𝗧 𝗔𝗖𝗧𝗨𝗔𝗟𝗜𝗭𝗔𝗗𝗢`,
        orderTitle: "Mejor Bot",
        jpegThumbnail: thumb5
      }
    }
  };

  const res5 = await fetch('https://files.catbox.moe/eln12h.jpg');
  const thumb6 = Buffer.from(await res5.arrayBuffer());

  const fkontak5 = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
      orderMessage: {
        itemCount: 1,
        status: 1,
        surface: 1,
        message: `𝗘𝗦𝗧𝗔𝗗𝗢 𝗗𝗘𝗟 𝗚𝗥𝗨𝗣𝗢`, 
        orderTitle: "Mejor Bot",
        jpegThumbnail: thumb6
      }
    }
  };

  const res6 = await fetch('https://i.postimg.cc/sDxKyS7b/1756180619692.jpg');
  const thumb7 = Buffer.from(await res6.arrayBuffer());

  const fkontak6 = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
      orderMessage: {
        itemCount: 1,
        status: 1,
        surface: 1,
        message: `𝗡𝗨𝗘𝗩𝗢 𝗔𝗗𝗠𝗜𝗡`,
        orderTitle: "Mejor Bot",
        jpegThumbnail: thumb7
      }
    }
  };

  const res7 = await fetch('https://i.postimg.cc/sDxKyS7b/1756180619692.jpg');
  const thumb8 = Buffer.from(await res7.arrayBuffer());

  const fkontak7 = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
      orderMessage: {
        itemCount: 1,
        status: 1,
        surface: 1,
        message: `𝗨𝗡 𝗔𝗗𝗠𝗜𝗡 𝗠𝗘𝗡𝗢𝗦`,
        orderTitle: "Mejor Bot",
        jpegThumbnail: thumb8
      }
    }
  };


  let chat = global.db.data.chats[m.chat];
  let usuario = `@${m.sender.split`@`[0]}`;
  let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://files.catbox.moe/xr2m6u.jpg';

  let nombre = `📛 El nombre del grupo fue cambiado a: *${m.messageStubParameters[0]}*\n👤 Por: ${usuario}`;

  let foto = `🖼️ La foto del grupo ha sido actualizada.\n👤 Por: ${usuario}`;

  let edit = `🔧 La configuración del grupo ha sido modificada.\n👤 Por: ${usuario}\n📋 Permisos: ${m.messageStubParameters[0] == 'on' ? 'Solo administradores' : 'Todos los miembros'}`;

  let newlink = `🔗 El enlace del grupo ha sido restablecido.\n👤 Por: ${usuario}`;

  let status = `🔒 El grupo ahora está ${m.messageStubParameters[0] == 'on' ? '*cerrado*' : '*abierto*'}.\n👤 Por: ${usuario}`;

  let admingp = `🆙 *@${m.messageStubParameters[0].split`@`[0]}* ha sido ascendido a administrador.\n👤 Acción realizada por: ${usuario}`;

  let noadmingp = `⬇️ *@${m.messageStubParameters[0].split`@`[0]}* ha sido removido como administrador.\n👤 Acción realizada por: ${usuario}`;

  if (chat.detect && m.messageStubType == 21) {
    await conn.sendMessage(m.chat, { text: nombre, mentions: [m.sender] }, { quoted: fkontak3 });
  } else if (chat.detect && m.messageStubType == 22) {
    await conn.sendMessage(m.chat, { image: { url: pp }, caption: foto, mentions: [m.sender] }, { quoted: fkontak2 });
  } else if (chat.detect && m.messageStubType == 23) {
    await conn.sendMessage(m.chat, { text: newlink, mentions: [m.sender] }, { quoted: fkontak });
  } else if (chat.detect && m.messageStubType == 25) {
    await conn.sendMessage(m.chat, { text: edit, mentions: [m.sender] }, { quoted: fkontak4 });
  } else if (chat.detect && m.messageStubType == 26) {
    await conn.sendMessage(m.chat, { text: status, mentions: [m.sender] }, { quoted: fkontak5 });
  } else if (chat.detect && m.messageStubType == 29) {
    await conn.sendMessage(m.chat, { text: admingp, mentions: [`${m.sender}`, `${m.messageStubParameters[0]}`] }, { quoted: fkontak6 });
    return;
  } else if (chat.detect && m.messageStubType == 30) {
    await conn.sendMessage(m.chat, { text: noadmingp, mentions: [`${m.sender}`, `${m.messageStubParameters[0]}`] }, { quoted: fkontak7 });
  }
}

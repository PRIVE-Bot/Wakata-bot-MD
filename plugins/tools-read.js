import { downloadContentFromMessage } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {

    const fkontak = {
      key: { fromMe: false, participant: "0@s.whatsapp.net" },
      message: {
        orderMessage: {
          itemCount: 1,
          status: 1,
          surface: 1,
          message: `𝗗𝗘𝗦𝗕𝗟𝗢𝗤𝗨𝗘𝗔𝗗𝗢`,
          orderTitle: "Mejor Bot",
        }
      }
    };

    if (!m.quoted) return conn.reply(m.chat, 'Responde a una imagen o video ViewOnce.', m, fake);

    let quoted = m.quoted.message;
    if (!quoted) return conn.reply(m.chat, 'No se pudo obtener el mensaje citado.', m, fake);

    let type = Object.keys(quoted)[0];
    if (!['imageMessage', 'videoMessage'].includes(type))
      return conn.reply(m.chat, 'Responde a una imagen o video ViewOnce.', m, fake);

    await m.react('⚡️');
    let media = quoted[type];

    let stream = await downloadContentFromMessage(media, type.replace('Message', ''));
    let buffer = Buffer.concat([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

    if (type === 'videoMessage') {
      await conn.sendFile(m.chat, buffer, 'media.mp4', media?.caption || '', fkontak);
    } else if (type === 'imageMessage') {
      await conn.sendFile(m.chat, buffer, 'media.jpg', media?.caption || '', fkontak);
    }
}

handler.command = ['readviewonce', 'read', 'readvo', 'rvo', 'ver'];
export default handler;

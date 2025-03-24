import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { conn, text, participants }) => {
  try {
    const users = participants.map((u) => conn.decodeJid(u.id));
    const quotedMessage = m.quoted ? m.quoted : m;
    const quotedText = m.quoted ? await m.getQuotedObj() : m.text || '';

    // Crear mensaje con mención a todos
    const msg = generateWAMessageFromContent(
      m.chat,
      {
        extendedTextMessage: {
          text: text || quotedText,
          contextInfo: { mentionedJid: users },
        },
      },
      { quoted: m, userJid: conn.user.id }
    );

    // Enviar mensaje con menciones
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
  } catch (err) {
    console.error('[Error en Hidetag]:', err);

    const users = participants.map((u) => conn.decodeJid(u.id));
    const quoted = m.quoted ? m.quoted : m;
    const mime = (quoted.msg || quoted).mimetype || '';
    const isMedia = /image|video|sticker|audio/.test(mime);
    const messageText = text ? text : '✨ ¡Hola, soy *ASTRO-BOT 🚀*! Estoy aquí para iluminar el grupo. 🌟';

    if (isMedia) {
      const media = await quoted.download?.();
      const messageType =
        mime.includes('image')
          ? 'image'
          : mime.includes('video')
          ? 'video'
          : mime.includes('audio')
          ? 'audio'
          : 'sticker';

      await conn.sendMessage(
        m.chat,
        { [messageType]: media, mentions: users, caption: messageType === 'sticker' ? '' : messageText },
        { quoted: m }
      );
    } else {
      const hiddenText = '\u200E'.repeat(850) + `\n🚀 ${messageText} 🚀\n`;

      await conn.sendMessage(
        m.chat,
        {
          text: hiddenText,
          mentions: users,
          contextInfo: {
            externalAdReply: {
              title: 'ASTRO-BOT 🚀',
              thumbnailUrl: 'https://whatsapp.com/channel/0029Vb1AFK6HbFV9kaB3b13W',
              sourceUrl: 'https://whatsapp.com/channel/0029Vb1AFK6HbFV9kaB3b13W',
            },
          },
        },
        { quoted: m }
      );
    }
  }
};

// **Comando activador**
handler.command = /^(hidetag|notify|notificar|noti|n|hidetah|hidet)$/i;
handler.group = true;
handler.admin = true;

export default handler;
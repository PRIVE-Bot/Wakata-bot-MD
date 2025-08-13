/*
 * Código hecho por Destroy
 * https://github.com/The-King-Destroy
 * Modificado por Deylin - Optimizado
 */

let handler = async (m, { conn, text }) => {
  let who = m.quoted?.sender
    || (m.mentionedJid && m.mentionedJid[0])
    || (text && /\d{5,}/.test(text) ? text.replace(/\D/g, '') + '@s.whatsapp.net' : null)
    || (m.fromMe ? conn.user.jid : m.sender);

  try {
    let name = await conn.getName(who);
    let ppUrl = await conn.profilePictureUrl(who, 'image').catch(() => 'https://files.catbox.moe/9y329o.jpg');
    await conn.sendFile(m.chat, ppUrl, 'profile.jpg', `*Foto de perfil de:* ${name}`, m);
  } catch {
    await m.reply('❌ No se pudo obtener la foto de perfil.');
  }
};

handler.help = ['pfp @user', 'pfp +numero'];
handler.tags = ['sticker'];
handler.command = ['pfp', 'getpic'];

export default handler;
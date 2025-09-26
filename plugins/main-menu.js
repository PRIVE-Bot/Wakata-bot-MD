import { xpRange } from '../lib/levelling.js'
import ws from 'ws';

const tagGroups = {
  '⟡ＤＯＷＮＬＯＡＤＥＲ⟡': ['downloader', 'dl', 'descargas'],
  '✦ＡＮＩＭＥ✦': ['anime'],
  '▢ＢＵＳＣＡＤＯＲ▢': ['buscador', 'search'],
  '⌬ＧＡＭＥ⌬': ['geme', 'juegos'],
  '⊹ＩＭＡＧＥＮ⊹': ['imagen'],
  '『ＧＲＯＵＰＳ』': ['grupo'],
  '⟦ＨＥＲＲＡＭＩＥＮＴＡＳ⟧': ['herramientas', 'tools'],
  '⋆ＯＮ / ＯＦＦ⋆': ['nable'],
  '☣ＮＳＦＷ☣': ['nsfw'],
  '✦ＯＷＮＥＲ✦': ['owner'],
  '✧ＳＵＢ ＢＯＴＳ✧': ['serbot'],
  '⊶ＳＴＩＣＫＥＲＳ⊷': ['sticker'],
  '⦿ＩＡ⦿': ['ia', 'ai'],
  '⇝ＭＯＴＩＶＡＣＩＯＮＡＬ⇜': ['motivacional'],
  '◈ＩＮＦＯ◈': ['main'],
  '⟡ＴＲＡＮＳＦＯＲＭＡＤＯＲ⟡': ['transformador'],
  '✧ＦＵＮ✧': ['fun']
};

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    // ================= Detectar dispositivo del usuario =================
    const target = m.quoted ? m.quoted : m
    const id = target.key?.id || target.id || ''
    let device = 'Desconocido';
    if (id) {
      const hex = id.replace(/[^a-fA-F0-9]/g, '');
      if (hex.length >= 28) device = 'Android';
      if (hex.length <= 22) device = 'iOS';
    }

    // ================= Preparar tags =================
    let tags = {};
    for (let [decoratedName, aliases] of Object.entries(tagGroups)) {
      aliases.forEach(alias => { tags[alias] = decoratedName; });
    }

    // ================= Preparar usuario =================
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
    let user = global.db.data.users[userId]
    if (!user) global.db.data.users[userId] = { exp: 0, level: 1 }
    let { exp, level } = global.db.data.users[userId]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = conn.getName(userId)
    let mode = global.opts["self"] ? "Privado" : "Público";
    let totalCommands = Object.keys(global.plugins).length;
    let totalreg = Object.keys(global.db.data.users).length;
    let uptime = clockString(process.uptime() * 1000);
    const users = [...new Set((global.conns || []).filter(c => c.user && c.ws?.socket?.readyState !== ws.CLOSED))];

    // ================= Preparar help =================
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => ({
      help: Array.isArray(plugin.help) ? plugin.help : (plugin.help ? [plugin.help] : []),
      tags: Array.isArray(plugin.tags) ? plugin.tags : (plugin.tags ? [plugin.tags] : []),
      limit: plugin.limit,
      premium: plugin.premium,
    }));

    // ================= Construir texto del menú =================
    let menuText = `
*╭━〘 ${botname} ☆ 〙━⌬*
┃ ✎ *Nombre:* @${userId.split('@')[0]}
┃ ✎ *Tipo:* ${(conn.user.jid == global.conn.user.jid ? 'Principal 🅥' : 'Prem Bot 🅑')}
┃ ✎ *Modo:* ${mode}
┃ ✎ *Usuarios:* ${totalreg}
┃ ✎ *Uptime:* ${uptime}
┃ ✎ *Comandos:* ${totalCommands}
┃ ✎ *Sub-Bots:* ${users.length}
*╰━━━━━━━━━━━━━━━━━━━━━⌬*
*${emoji}* 𝐋𝐈𝐒𝐓𝐀 𝐃𝐄 𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒↷↷
${Object.entries(tagGroups).map(([decoratedName, aliases]) => {
  const commandsForTag = help.filter(menu => menu.tags.some(t => aliases.includes(t)));
  if (!commandsForTag.length) return '';
  return `
╭━━〔 ${decoratedName} ${getRandomEmoji()} 〕━━━⌬
${commandsForTag.map(menu => menu.help.map(help => 
  `┃ ➩ ${_p}${help}${menu.limit ? ' ◜⭐◞' : ''}${menu.premium ? ' ◜🪪◞' : ''}`
).join('\n')).join('\n')}
╰━━━━━━━━━━━━━━⌬`;
}).filter(t => t !== '').join('\n')}
*⌬⌬➩ © Powered by Deylin - ${botname}*
`.trim();

    await m.react('👑');

    // ================= Enviar mensaje según dispositivo =================
    if (device === 'Android') {
      // Android: enviamos como productMessage
      const res1 = await fetch('https://i.postimg.cc/vHyTj3dZ/1758228459909.jpg');
      const img2 = Buffer.from(await res1.arrayBuffer());
      const fkontak = {
        key: { fromMe: false, participant: userId },
        message: {
          productMessage: {
            product: {
              productImage: { jpegThumbnail: img2 },
              title: `𝗟𝗜𝗦𝗧𝗔 𝗗𝗘 𝗙𝗨𝗡𝗖𝗜𝗢𝗡𝗘𝗦`,
              description: '1',
              currencyCode: "USD",
              priceAmount1000: "15000",
              retailerId: "BOT"
            },
            businessOwnerJid: userId
          }
        }
      };
      await conn.sendMessage(m.chat, {
        image: { url: global.img },
        caption: menuText,
        contextInfo: { mentionedJid: [userId] }
      }, { quoted: fkontak });
    } else {
      // iOS o desconocido: enviamos normal, sin productMessage
      await conn.sendMessage(m.chat, {
        image: { url: global.img },
        caption: menuText,
        contextInfo: { mentionedJid: [userId] }
      }, { quoted: m });
    }

  } catch (e) {
    conn.reply(m.chat, `❎ Lo sentimos, el menú tiene un error. ${e}`, m);
    throw e;
  }
};

handler.help = ['menu', 'allmenu'];
handler.tags = ['main'];
handler.command = ['menu', 'allmenu', 'menú'];
handler.register = true;

export default handler;

// ==================== Funciones auxiliares ====================
const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}

function getRandomEmoji() {
  const emojis = ['👑', '🔥', '🌟', '⚡'];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

function getLevelProgress(exp, min, max, length = 10) {
  if (exp < min) exp = min;
  if (exp > max) exp = max;
  let progress = Math.floor(((exp - min) / (max - min)) * length);
  progress = Math.max(0, Math.min(progress, length)); 
  let bar = '█'.repeat(progress) + '░'.repeat(length - progress);
  return `[${bar}]`;
}
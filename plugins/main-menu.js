import { xpRange } from '../lib/levelling.js'

const tags = {
  anime: 'ANIME', main: 'INFO', search: 'SEARCH', game: 'GAME',
  serbot: 'SUB BOTS', rpg: 'RPG', sticker: 'STICKER', grupo: 'GROUPS',
  nable: 'ON / OFF', premium: 'PREMIUM', downloader: 'DOWNLOAD', tools: 'TOOLS',
  fun: 'FUN', nsfw: 'NSFW', cmd: 'DATABASE', owner: 'OWNER', audio: 'AUDIOS',
  advanced: 'ADVANCED', buscador: 'BUSCADORES', weather: 'WEATHER', news: 'NEWS', finance: 'FINANCE',
  education: 'EDUCATION', health: 'HEALTH', entertainment: 'ENTERTAINMENT',
  sports: 'SPORTS', travel: 'TRAVEL', food: 'FOOD', shopping: 'SHOPPING',
  productivity: 'PRODUCTIVITY', social: 'SOCIAL', security: 'SECURITY', custom: 'CUSTOM'
};

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    const userId = m.sender;
    const mode = global.opts.self ? "Privado" : "Público";
    const totalCommands = Object.keys(global.plugins).length;
    const totalReg = Object.keys(global.db.data.users).length;
    const uptime = clockString(process.uptime() * 1000);
    const name = await conn.getName(userId);

    if (!global.db.data.users[userId]) {
      global.db.data.users[userId] = { exp: 0, level: 1 };
    }

    const { exp, level } = global.db.data.users[userId];
    const { min, xp, max } = xpRange(level, global.multiplier);

    
    const help = Object.values(global.plugins)
      .filter(p => !p.disabled)
      .map(p => ({
        help: Array.isArray(p.help) ? p.help : p.help ? [p.help] : [],
        tags: Array.isArray(p.tags) ? p.tags : p.tags ? [p.tags] : [],
        limit: p.limit,
        premium: p.premium
      }));

    
    let thumb2;
    try {
      const res = await fetch('https://files.catbox.moe/d48sk2.jpg');
      thumb2 = Buffer.from(await res.arrayBuffer());
    } catch {
      thumb2 = Buffer.alloc(0);
    }

    const fkontak = {
      key: { participants: "0@s.whatsapp.net", remoteJid: "status@broadcast", fromMe: false, id: "Halo" },
      message: { locationMessage: { name: `𝗠𝗘𝗡𝗨 ＝ 𝗟𝗜𝗦𝗧𝗔 𝗗𝗘 𝗙𝗨𝗡𝗖𝗜𝗢𝗡𝗘𝗦\n${botname}`, jpegThumbnail: thumb2 } },
      participant: "0@s.whatsapp.net"
    };

    
    let menuText = `
*◈ ━━━━━━━ ⸙ ━━━━━━━ ◈*

Hola *@${userId.split('@')[0]}* soy *${global.botname}*

┏╍╍╍╍╍╍╍╍╾『 𝑰 𝑵 𝑭 𝑶 』
┃ ʕ˖͜͡˖ʔ *Cliente:* @${userId.split('@')[0]}
┃ ۵卍 *Bot:* ${(conn.user.jid == global.conn.user.jid ? 'Principal 🅥' : 'Prem Bot 🅑')}
┃ ☒ *Modo:* ${mode}
┃ ஐ *Usuarios »* ${totalReg}
┃ ✎ *Tiempo Activo:* ${uptime}
┃ 〄 *Comandos »* ${totalCommands}
┗╍╍╍╍╍╍╍ ♢.💥.♢ ━━━━━━➤

*sɪɢᴜᴇ ᴇʟ ᴄᴀɴᴀʟ ᴏғɪᴄɪᴀʟ:*
whatsapp.com/channel/0029VbAzn9GGU3BQw830eA0F
${global.readMore}
*◤━━━━━ ☆. 🌀 .☆ ━━━━━◥*
⚙_*𝑳𝑰𝑺𝑻𝑨 𝑫𝑬 𝑪𝑶𝑴𝑨𝑵𝑫𝑶𝑺*_
${Object.keys(tags).reduce((acc, tag) => {
  const cmds = help.filter(h => h.tags.includes(tag));
  if (!cmds.length) return acc;
  const cmdList = cmds.flatMap(c => c.help.map(cmd => `┃ *\`»\`* \`/${cmd}\` ${c.limit ? '◜⭐◞' : ''} ${c.premium ? '◜🪪◞' : ''}`)).join('\n');
  return acc + `\n*┏━━━━▣━━⌬〘 ${tags[tag]} ${getRandomEmoji()} 〙*\n${cmdList}\n*┗━━━▣━━⌬⌨⌬━━▣━━━━⌬*`;
}, '')}

> ${dev}
`;

    const imageUrls = [
      'https://files.catbox.moe/nv87us.jpg',
      'https://files.catbox.moe/83cyxz.jpg',
      'https://files.catbox.moe/hhgh5y.jpg'
    ];
    const selectedImage = imageUrls[Math.floor(Math.random() * imageUrls.length)];

    await m.react('🌀');
    await conn.sendMessage(m.chat, {
      image: { url: selectedImage },
      caption: menuText.trim(),
      mentions: [m.sender]
    }, { quoted: fkontak });

  } catch (e) {
    console.error(e);
    conn.reply(m.chat, '❎ Lo sentimos, el menú tiene un error.', m);
  }
};

handler.command = ['menu', 'help'];

handler.before = async (m, { conn }) => {
  const text = m.text?.toLowerCase()?.trim();
  if (text === 'menu' || text === 'help') {
    return handler(m, { conn });
  }
};

export default handler;

function clockString(ms) {
  const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
  const m = String(Math.floor(ms / 60000) % 60).padStart(2, '0');
  const s = String(Math.floor(ms / 1000) % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function getRandomEmoji() {
  const emojis = ['👑', '🔥', '🌟', '⚡'];
  return emojis[Math.floor(Math.random() * emojis.length)];
}
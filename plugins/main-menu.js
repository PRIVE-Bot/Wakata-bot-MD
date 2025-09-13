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
    let tag = '@' + userId.split('@')[0]


    const help = Object.values(global.plugins)
      .filter(p => !p.disabled)
      .map(p => ({
        help: Array.isArray(p.help) ? p.help : p.help ? [p.help] : [],
        tags: Array.isArray(p.tags) ? p.tags : p.tags ? [p.tags] : [],
        limit: p.limit,
        premium: p.premium
      }));





const res = await fetch('https://files.catbox.moe/91rqne.jpg');
const img = Buffer.from(await res.arrayBuffer());

const fkontak = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
        productMessage: {
            product: {
                productImage: { jpegThumbnail: img },
                title: `𝗠𝗘𝗡𝗨 ＝ 𝗟𝗜𝗦𝗧𝗔 𝗗𝗘 𝗙𝗨𝗡𝗖𝗜𝗢𝗡𝗘𝗦`,
                description: botname ,
                currencyCode: "USD",
                priceAmount1000: "5000", 
                retailerId: "BOT"
            },
            businessOwnerJid: "0@s.whatsapp.net"
        }
    }
};




    let menuText = `
╔═══════════════════════════╗
║       INFORMACIÓN DEL BOT    
╟───────────────────────────╢
║ Cliente   : ${tag}
║ Bot       : ${(conn.user.jid == global.conn.user.jid ? 'Principal ⬢' : 'Premium ⬡')}
║ Modo      : ${mode}
║ Usuarios  : ${totalReg}
║ Activo    : ${uptime}
║ Comandos  : ${totalCommands}
╚═══════════════════════════╝


┌─═≡ LISTA DE COMANDOS ≡═─┐
${global.readMore}
${Object.keys(tags).map(tag => {
    const cmds = help.filter(h => h.tags.includes(tag));
    if (!cmds.length) return '';
    const cmdList = cmds.flatMap(c =>
        c.help.map(cmd => `│ ⊳ /${cmd} ${c.limit ? '[Límite]' : ''} ${c.premium ? '[Premium]' : ''}`)
    ).join('\n');
    return `
╔═══『 ${tags[tag]} ${getRandomEmoji()} 』═══╗
${cmdList}
╚══════════════════════╝`;
}).join('\n')}

> Desarrollador: ${dev}
`;

    await m.react('⚡');
    await conn.sendMessage(
  m.chat,
  {
    image: { url: global.img },
    caption: menuText.trim(),
    mentions: [m.sender]
  },
  { quoted: fkontak }
)

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
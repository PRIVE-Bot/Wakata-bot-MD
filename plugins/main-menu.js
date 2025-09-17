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
    let tag = '@' + userId.split('@')[0];

    const help = Object.values(global.plugins)
      .filter(p => !p.disabled)
      .map(p => ({
        help: Array.isArray(p.help) ? p.help : p.help ? [p.help] : [],
        tags: Array.isArray(p.tags) ? p.tags : p.tags ? [p.tags] : [],
        limit: p.limit,
        premium: p.premium
      }));

    const fkontak = {
      key: { fromMe: false, participant: "0@s.whatsapp.net" },
      message: {
        contactMessage: {
          displayName: botname,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;${botname};;;\nFN:${botname}\nEND:VCARD`
        }
      }
    };

    let menuText = `
┏━━━━━━━━━━━━━━━┅┉⌬
┃ » Hola, soy ${botname}
┣━━━━━━━━━━━━━━━┅┉⌬
┃✧ Client: ${tag}
┃➣ Bot: ${(conn.user.jid == global.conn.user.jid ?   'Principal' : 'Premium')}
┃✰ Mode: ${mode}
┃♛ Users: ${totalReg}
┃☾ Uptime: ${uptime}
┃✎ Commandos: ${totalCommands}
┗━━━━━━━━━━━━━━━┅┉⌬

┌─≡ FUNCTION CATALOG ≡─┐
${global.readMore}
${Object.keys(tags).reduce((acc, tag) => {
  const cmds = help.filter(h => h.tags.includes(tag));
  if (!cmds.length) return acc;
  const cmdList = cmds.flatMap(c =>
    c.help.map(cmd =>
      `│ /${cmd}${c.limit ? ' [L]' : ''}${c.premium ? ' [P]' : ''}`
    )
  ).join('\n');
  return acc + `\n╔═══ ${tags[tag]} ═══╗\n${cmdList}\n╚═══════════════╝`;
}, '')}

> ${dev}
`;

    await conn.sendMessage(
      m.chat,
      {
        image: { url: global.img },
        caption: menuText.trim(),
        mentions: [m.sender]
      },
      { quoted: fkontak }
    );

  } catch (e) {
    console.error(e);
    conn.reply(m.chat, 'Error: el menú no se pudo generar.', m);
  }
};

handler.command = ['menu', 'help', 'menú'];

export default handler;

function clockString(ms) {
  const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
  const m = String(Math.floor(ms / 60000) % 60).padStart(2, '0');
  const s = String(Math.floor(ms / 1000) % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}
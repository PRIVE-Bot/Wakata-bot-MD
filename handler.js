import { smsg } from './lib/simple.js';
import { format } from 'util';
import { fileURLToPath } from 'url';
import path, { join } from 'path';
import { unwatchFile, watchFile } from 'fs';
import chalk from 'chalk';
import fetch from 'node-fetch';

const { proto, get
} = (await import('@whiskeysockets/baileys')).default;
const isNumber = x => typeof x === 'number' && !isNaN(x);
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function handler(chatUpdate) {
  this.msgqueque = this.msgqueque || [];
  this.uptime = this.uptime || Date.now();

  if (!chatUpdate || !chatUpdate.messages || chatUpdate.messages.length === 0) {
    return;
  }
  
  const m = chatUpdate.messages[chatUpdate.messages.length - 1];
  if (!m) {
    return;
  }

  // Comprueba y procesa la base de datos si no está cargada
  if (global.db.data == null) {
    await global.loadDatabase();
  }

  // Evita el procesamiento de mensajes duplicados
  this.processedMessages = this.processedMessages || new Map();
  const messageId = m.key.id;
  const now = Date.now();
  const lifetime = 5000;

  for (const [id, time] of this.processedMessages.entries()) {
    if (now - time > lifetime) {
      this.processedMessages.delete(id);
    }
  }

  if (this.processedMessages.has(messageId)) {
    return;
  }
  this.processedMessages.set(messageId, now);

  try {
    m = smsg(this, m) || m;
    if (!m) {
      return;
    }
    m.exp = 0;
    m.coin = false;

    // Lógica para la base de datos del usuario
    const user = global.db.data.users[m.sender] || {};
    if (typeof user !== 'object') {
      global.db.data.users[m.sender] = {};
    }
    // Asignación de valores por defecto para el usuario
    Object.assign(global.db.data.users[m.sender], {
      exp: 0,
      coin: 10,
      joincount: 1,
      diamond: 3,
      lastadventure: 0,
      health: 100,
      lastclaim: 0,
      lastcofre: 0,
      lastdiamantes: 0,
      lastcode: 0,
      lastduel: 0,
      lastpago: 0,
      lastmining: 0,
      lastcodereg: 0,
      muto: false,
      registered: false,
      genre: '',
      birth: '',
      marry: '',
      description: '',
      packstickers: null,
      name: m.name,
      age: -1,
      regTime: -1,
      afk: -1,
      afkReason: '',
      banned: false,
      useDocument: false,
      bank: 0,
      level: 0,
      role: 'Nuv',
      premium: false,
      premiumTime: 0,
      ...user,
    });
    
    // Lógica para la base de datos del chat
    const chat = global.db.data.chats[m.chat] || {};
    if (typeof chat !== 'object') {
      global.db.data.chats[m.chat] = {};
    }
    // Asignación de valores por defecto para el chat
    Object.assign(global.db.data.chats[m.chat], {
      isBanned: false,
      sAutoresponder: '',
      welcome: false,
      autolevelup: false,
      autoAceptar: false,
      autosticker: false,
      autoRechazar: false,
      autoresponder: false,
      detect: true,
      economy: true,
      gacha: true,
      antiBot: false,
      antiBot2: false,
      modoadmin: false,
      antiLink: true,
      reaction: false,
      nsfw: false,
      antifake: false,
      delete: false,
      expired: 0,
      ...chat,
    });

    // Lógica para la configuración del bot
    const settings = global.db.data.settings[this.user.jid] || {};
    if (typeof settings !== 'object') {
      global.db.data.settings[this.user.jid] = {};
    }
    // Asignación de valores por defecto para la configuración
    Object.assign(global.db.data.settings[this.user.jid], {
      self: false,
      restrict: true,
      jadibotmd: true,
      antiPrivate: false,
      autoread: false,
      status: 0,
      ...settings,
    });
    
  } catch (e) {
    console.error(e);
  }

  // Configuraciones de operación del bot
  if (opts['nyimak']) return;
  if (!m.fromMe && opts['self']) return;
  if (opts['swonly'] && m.chat !== 'status@broadcast') return;
  
  if (typeof m.text !== 'string') {
    m.text = '';
  }

  // Determinación de roles
  const detectwhat = m.sender.includes('@lid') ? '@lid' : '@s.whatsapp.net';
  const isROwner = [...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + detectwhat).includes(m.sender);
  const isOwner = isROwner || m.fromMe;
  const isMods = isOwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + detectwhat).includes(m.sender);
  const isPrems = isROwner || global.db.data.users[m.sender]?.premiumTime > 0;

  // Lógica de cola de mensajes
  if (opts['queque'] && m.text && !(isMods || isPrems)) {
    const { msgqueque } = this;
    const time = 1000 * 5;
    const previousID = msgqueque[msgqueque.length - 1];
    msgqueque.push(m.id || m.key.id);
    setInterval(async () => {
      if (msgqueque.indexOf(previousID) === -1) {
        clearInterval(this);
      }
      await delay(time);
    }, time);
  }

  m.exp += Math.ceil(Math.random() * 10);
  
  const getLidFromJid = async (id, conn) => {
    if (id.endsWith('@lid')) return id;
    const res = await conn.onWhatsApp(id).catch(() => []);
    return res[0]?.lid || id;
  };
  
  const senderLid = await getLidFromJid(m.sender, this);
  const botLid = await getLidFromJid(this.user.jid, this);
  const senderJid = m.sender;
  const botJid = this.user.jid;
  const groupMetadata = m.isGroup ? (this.chats[m.chat]?.metadata || await this.groupMetadata(m.chat).catch(() => null)) : {};
  const participants = m.isGroup ? (groupMetadata.participants || []) : [];
  const user = participants.find(p => p.id === senderLid || p.id === senderJid) || {};
  const bot = participants.find(p => p.id === botLid || p.id === botJid) || {};
  const isRAdmin = user?.admin === 'superadmin';
  const isAdmin = isRAdmin || user?.admin === 'admin';
  const isBotAdmin = !!bot?.admin;

  m.isWABusiness = global.conn.authState?.creds?.platform?.startsWith('smb') || false;
  m.isChannel = m.chat.includes('@newsletter') || m.sender.includes('@newsletter');

  const pluginsDir = path.join(__dirname, './plugins');
  for (const name in global.plugins) {
    const plugin = global.plugins[name];
    if (!plugin || plugin.disabled) {
      continue;
    }
    const filename = join(pluginsDir, name);
    
    // Lógica para la función all()
    if (typeof plugin.all === 'function') {
      try {
        await plugin.all.call(this, m, { chatUpdate, __dirname: pluginsDir, __filename: filename });
      } catch (e) {
        console.error(e);
      }
    }

    if (!opts['restrict'] && plugin.tags?.includes('admin')) {
      continue;
    }
    
    const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.⚡]/g, '\\$&');
    const prefixes = plugin.customPrefix ? (Array.isArray(plugin.customPrefix) ? plugin.customPrefix : [plugin.customPrefix]) : (this.prefix ? [this.prefix] : global.prefix);
    const match = prefixes
      .map(p => {
        const re = p instanceof RegExp ? p : new RegExp(str2Regex(p));
        return [re.exec(m.text), re];
      })
      .find(p => p[0]);

    if (typeof plugin.before === 'function') {
      const shouldContinue = await plugin.before.call(this, m, {
        match,
        conn: this,
        participants,
        groupMetadata,
        user,
        bot,
        isROwner,
        isOwner,
        isRAdmin,
        isAdmin,
        isBotAdmin,
        isPrems,
        chatUpdate,
        __dirname: pluginsDir,
        __filename: filename,
      });
      if (shouldContinue) continue;
    }
    
    if (typeof plugin !== 'function') continue;

    const usedPrefix = (match?.[0] || '')[0];
    if (usedPrefix) {
      const noPrefix = m.text.replace(usedPrefix, '').trim();
      const [command, ...args] = noPrefix.split(/\s+/).filter(v => v);
      const text = args.join(' ');
      const lowerCommand = (command || '').toLowerCase();
      const fail = plugin.fail || global.dfail;

      const isAccept = plugin.command instanceof RegExp
        ? plugin.command.test(lowerCommand)
        : Array.isArray(plugin.command)
          ? plugin.command.some(cmd => (cmd instanceof RegExp ? cmd.test(lowerCommand) : cmd === lowerCommand))
          : typeof plugin.command === 'string'
            ? plugin.command === lowerCommand
            : false;

      global.comando = lowerCommand;
      
      if (!isAccept) continue;
      
      // Manejo de mensajes de Baileys
      if (m.id?.startsWith('NJX-') || (m.id?.startsWith('BAE5') && m.id.length === 16) || (m.id?.startsWith('B24E') && m.id.length === 20)) continue;

      m.plugin = name;

      // Restricciones de acceso y baneos
      const chatData = global.db.data.chats[m.chat];
      const userData = global.db.data.users[m.sender];
      const settingsData = global.db.data.settings[this.user.jid];

      if (chatData?.isBanned && !isROwner && !['grupo-unbanchat.js'].includes(name)) {
        continue;
      }
      
      if (userData?.banned && !isROwner && !['owner-exec.js', 'owner-exec2.js', 'grupo-delete.js'].includes(name)) {
        m.reply(`《✦》Estás baneado/a, no puedes usar comandos en este bot!\n\n${userData.bannedReason ? `✰ *Motivo:* ${userData.bannedReason}` : '✰ *Motivo:* Sin Especificar'}\n\n> ✧ Si este Bot es cuenta oficial y tiene evidencia que respalde que este mensaje es un error, puedes exponer tu caso con un moderador.`);
        userData.antispam = (userData.antispam || 0) + 1;
        continue;
      }

      // Lógica de antispam
      if (userData?.antispam2 && isROwner) continue;
      if (now - (userData?.spam || 0) < 3000) {
        console.log('[ SPAM ]');
        continue;
      }
      userData.spam = now;

      // Modo Admin
      const adminMode = chatData?.modoadmin;
      const isCmdPlugin = plugins[name].botAdmin || plugins[name].admin || plugins[name].group || plugins[name] || noPrefix || usedPrefix || m.text.slice(0, 1) === usedPrefix || plugins[name].command;
      if (adminMode && !isOwner && !isROwner && m.isGroup && !isAdmin && isCmdPlugin) {
        continue;
      }

      // Restricciones de plugin
      if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) {
        fail('owner', m, this);
        continue;
      }
      if (plugin.rowner && !isROwner) {
        fail('rowner', m, this);
        continue;
      }
      if (plugin.owner && !isOwner) {
        fail('owner', m, this);
        continue;
      }
      if (plugin.mods && !isMods) {
        fail('mods', m, this);
        continue;
      }
      if (plugin.premium && !isPrems) {
        fail('premium', m, this);
        continue;
      }
      if (plugin.group && !m.isGroup) {
        fail('group', m, this);
        continue;
      }
      if (plugin.botAdmin && !isBotAdmin) {
        fail('botAdmin', m, this);
        continue;
      }
      if (plugin.admin && !isAdmin) {
        fail('admin', m, this);
        continue;
      }
      if (plugin.private && m.isGroup) {
        fail('private', m, this);
        continue;
      }
      
      m.isCommand = true;
      const xp = 'exp' in plugin ? parseInt(plugin.exp) : 17;
      m.exp += xp;

      const extra = {
        match,
        usedPrefix,
        noPrefix,
        _args: args,
        args,
        command,
        text,
        conn: this,
        participants,
        groupMetadata,
        user: userData,
        bot,
        isROwner,
        isOwner,
        isRAdmin,
        isAdmin,
        isBotAdmin,
        isPrems,
        chatUpdate,
        __dirname: pluginsDir,
        __filename: filename,
      };

      try {
        await plugin.call(this, m, extra);
        if (!isPrems) m.coin = m.coin || plugin.coin || false;
      } catch (e) {
        m.error = e;
        console.error(e);
        if (e) {
          let errorText = format(e);
          for (const key of Object.values(global.APIKeys)) {
            errorText = errorText.replace(new RegExp(key, 'g'), 'Administrador');
          }
          m.reply(errorText);
        }
      } finally {
        if (typeof plugin.after === 'function') {
          try {
            await plugin.after.call(this, m, extra);
          } catch (e) {
            console.error(e);
          }
        }
        if (m.coin) {
          this.reply(m.chat, `❮✦❯ Utilizaste ${+m.coin} ${global.moneda}`, m);
        }
        break;
      }
    }
  }

  // Bloque finally del handler
  try {
    if (opts['queque'] && m.text) {
      const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id);
      if (quequeIndex !== -1) {
        this.msgqueque.splice(quequeIndex, 1);
      }
    }
    
    // Actualización de stats y monedas
    const userData = global.db.data.users[m.sender];
    if (m.sender && userData) {
      userData.exp += m.exp;
      userData.coin -= m.coin * 1;
      if (userData.muto) {
        await this.sendMessage(m.chat, { delete: m.key });
      }
    }

    // Actualización de estadísticas de comandos
    if (m.plugin) {
      const now = Date.now();
      const stats = global.db.data.stats[m.plugin] || { total: 0, success: 0, last: 0, lastSuccess: 0 };
      
      stats.total += 1;
      stats.last = now;
      if (m.error == null) {
        stats.success += 1;
        stats.lastSuccess = now;
      }
      global.db.data.stats[m.plugin] = stats;
    }

    // Lógica de autoread y reacciones
    const settingsREAD = global.db.data.settings[this.user.jid] || {};
    if (opts['autoread']) {
      await this.readMessages([m.key]);
    }
    
    const chatData = global.db.data.chats[m.chat];
    if (chatData?.reaction && m.text?.match(/(ción|dad|aje|oso|izar|mente|pero|tion|age|ous|ate|and|but|ify|ai|Pikachu|a|s)/gi)) {
      const emot = pickRandom(["🍟", "😃", "😄", "😁", "😆", "🍓", "😅", "😂", "🤣", "🥲", "☺️", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "🌺", "🌸", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🌟", "🤓", "😎", "🥸", "🤩", "🥳", "😏", "💫", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😶‍🌫️", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🫣", "🤭", "🤖", "🍭", "🤫", "🫠", "🤥", "😶", "📇", "😐", "💧", "😑", "🫨", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😮‍💨", "😵", "😵‍💫", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👺", "🧿", "🌩", "👻", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "🫶", "👍", "✌️", "🙏", "🫵", "🤏", "🤌", "☝️", "🖕", "🙏", "🫵", "🫂", "🐱", "🤹‍♀️", "🤹‍♂️", "🗿", "✨", "⚡", "🔥", "🌈", "🩷", "❤️", "🧡", "💛", "💚", "🩵", "💙", "💜", "🖤", "🩶", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "🚩", "👊", "⚡️", "💋", "🫰", "💅", "👑", "🐣", "🐤", "🐈"]);
      if (!m.fromMe) {
        this.sendMessage(m.chat, { react: { text: emot, key: m.key } });
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    try {
      if (!opts['noprint']) {
        await (await import('./lib/print.js')).default(m, this);
      }
    } catch (e) {
      console.log(m, m.quoted, e);
    }
  }
}

// Función de respuesta de fallos
global.dfail = (type, m, conn) => {
  const edadaleatoria = ['10', '28', '20', '40', '18', '21', '15', '11', '9', '17', '25'].getRandom();
  const user2 = m.pushName || 'Anónimo';
  const verifyaleatorio = ['registrar', 'reg', 'verificar', 'verify', 'register'].getRandom();

  const msg = {
    rowner: `*👑 〘 ${global.comando} 〙 es solo para los creadores, no insistas.*`,
    owner: `*⚡ 〘 ${global.comando} 〙 es exclusivo para los desarrolladores. Nivel insuficiente.*`,
    mods: `*👑 〘 ${global.comando} 〙 solo para moderadores. ¿Eres uno? No lo creo.*`,
    premium: `*👑 〘 ${global.comando} 〙 es un lujo de usuarios premium. Tú aún no estás en ese nivel.*`,
    group: `*👑 〘 ${global.comando} 〙 solo funciona en grupos. No intentes engañar al sistema.*`,
    private: `*⚡ 〘 ${global.comando} 〙 solo en chat privado. Aquí no, amigo.*`,
    admin: `*👑 〘 ${global.comando} 〙 es un poder reservado para administradores.*`,
    botAdmin: `*⚡ Necesito ser admin para ejecutar 〘 ${global.comando} 〙 Dame el rango y hablamos.*`,
    unreg: `*👑 Para usar 〘 ${global.comando} 〙 primero debes registrarte.*\n\n *⚡ Usa: #${verifyaleatorio} ${user2}.${edadaleatoria}*`,
    restrict: `*⚡ Esta función está bloqueada. Fin de la historia.*`,
  }[type];

  if (msg) {
    conn.reply(m.chat, msg, m, global.fake).then(() => m.react('✖️'));
  }
};

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

const file = global.__filename(import.meta.url, true);
watchFile(file, async () => {
  unwatchFile(file);
  console.log(chalk.magenta("Se actualizó 'handler.js'"));
  if (global.conns && global.conns.length > 0) {
    const users = [...new Set([...global.conns.filter(conn => conn.user && conn.ws?.socket?.readyState !== getWebSocket('CLOSED')).map(conn => conn)])];
    for (const userConn of users) {
      userConn.subreloadHandler(false);
    }
  }
});


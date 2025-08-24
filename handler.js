import { smsg } from './lib/simple.js';
import { format } from 'util';
import { fileURLToPath } from 'url';
import path, { join } from 'path';
import { unwatchFile, watchFile } from 'fs';
import chalk from 'chalk';
import fetch from 'node-fetch';

const { proto } = (await import('@whiskeysockets/baileys')).default;
const isNumber = x => typeof x === 'number' && !isNaN(x);

export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || [];
    this.uptime = this.uptime || Date.now();
    if (!chatUpdate) {
        return;
    }
    this.pushMessage(chatUpdate.messages).catch(console.error);

    let m = chatUpdate.messages[chatUpdate.messages.length - 1];
    if (!m) {
        return;
    }

    this.processedMessages = this.processedMessages || new Map();
    const id = m.key.id;
    const now = Date.now();
    const lifeTime = 9000;

    for (let [msgId, time] of this.processedMessages) {
        if (now - time > lifeTime) {
            this.processedMessages.delete(msgId);
        }
    }

    if (this.processedMessages.has(id)) {
        return;
    }
    this.processedMessages.set(id, now);

    if (global.db.data == null) {
        await global.loadDatabase();
    }
    try {
        m = smsg(this, m) || m;
        if (!m) {
            return;
        }

        try {
            let chat = global.db.data.chats[m.chat];
            if (typeof chat !== 'object') {
                global.db.data.chats[m.chat] = {};
            }
            if (chat) {
                if (!('isBanned' in chat)) chat.isBanned = false;
                if (!('sAutoresponder' in chat)) chat.sAutoresponder = '';
                if (!('welcome' in chat)) chat.welcome = true;
                if (!('autolevelup' in chat)) chat.autolevelup = false;
                if (!('autoAceptar' in chat)) chat.autoAceptar = false;
                if (!('autosticker' in chat)) chat.autosticker = false;
                if (!('autoRechazar' in chat)) chat.autoRechazar = false;
                if (!('autoresponder' in chat)) chat.autoresponder = false;
                if (!('detect' in chat)) chat.detect = true;
                if (!('detect2' in chat)) chat.detect2 = false;
                if (!('antiBot' in chat)) chat.antiBot = false;
                if (!('antiBot2' in chat)) chat.antiBot2 = false;
                if (!('antiver' in chat)) chat.antiver = false;
                if (!('modoadmin' in chat)) chat.modoadmin = false;
                if (!('antiLink' in chat)) chat.antiLink = true;
                if (!('antiLink2' in chat)) chat.antiLink2 = false;
                if (!('reaction' in chat)) chat.reaction = false;
                if (!('nsfw' in chat)) chat.reaction = false;
                if (!('simi' in chat)) chat.simi = false;
                if (!('antifake' in chat)) chat.antifake = false;
                if (!('antiTraba' in chat)) chat.antiTraba = false;
                if (!('antitoxic' in chat)) chat.antitoxic = false;
                if (!('delete' in chat)) chat.delete = false;
                if (!isNumber(chat.expired)) chat.expired = 0;
            } else {
                global.db.data.chats[m.chat] = {
                    isBanned: false,
                    sAutoresponder: '',
                    welcome: true,
                    autolevelup: false,
                    autoresponder: false,
                    delete: false,
                    autoAceptar: false,
                    autoRechazar: false,
                    detect: true,
                    detect2: false,
                    antiBot: false,
                    antiBot2: false,
                    modoadmin: false,
                    antiLink: true,
                    antiLink2: false,
                    simi: false,
                    antiver: false,
                    antifake: false,
                    antitoxic: false,
                    antiTraba: false,
                    reaction: false,
                    nsfw: false,
                    autosticker: false,
                    expired: 0,
                };
            }

            let settings = global.db.data.settings[this.user.jid];
            if (typeof settings !== 'object') {
                global.db.data.settings[this.user.jid] = {};
            }
            if (settings) {
                if (!('self' in settings)) settings.self = false;
                if (!('restrict' in settings)) settings.restrict = true;
                if (!('jadibotmd' in settings)) settings.jadibotmd = true;
                if (!('antiPrivate' in settings)) settings.antiPrivate = false;
                if (!('autoread' in settings)) settings.autoread = false;
                if (!('autoread2' in settings)) settings.autoread2 = false;
                if (!('antiSpam' in settings)) settings.antiSpam = false;
            } else {
                global.db.data.settings[this.user.jid] = {
                    self: false,
                    restrict: true,
                    jadibotmd: true,
                    antiPrivate: false,
                    autoread: false,
                    autoread2: false,
                    antiSpam: false,
                    status: 0,
                };
            }
        } catch (e) {
            console.error(e);
        }

        if (opts['nyimak']) {
            return;
        }
        if (!m.fromMe && opts['self']) {
            return;
        }
        if (opts['swonly'] && m.chat !== 'status@broadcast') {
            return;
        }
        if (typeof m.text !== 'string') {
            m.text = '';
        }

        const detectwhat = m.sender.includes('@lid') ? '@lid' : '@s.whatsapp.net';
const isROwner = [...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + detectwhat).includes(m.sender)
        const isOwner = isROwner || m.fromMe;
        const isMods = isROwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + detectwhat).includes(m.sender);
        const isPrems = isROwner || global.prems.map(v => v.replace(/[^0-9]/g, '') + detectwhat).includes(m.sender);

        if (m.isBaileys) {
            return;
        }
        if (opts['nyimak']) {
            return;
        }
        if (!isROwner && opts['self']) {
            return;
        }
        if (opts['swonly'] && m.chat !== 'status@broadcast') {
            return;
        }
        if (typeof m.text !== 'string') {
            m.text = '';
        }

        if (opts['queque'] && m.text && !(isMods || isPrems)) {
            const queque = this.msgqueque,
                time = 1000 * 5;
            const previousID = queque[queque.length - 1];
            queque.push(m.id || m.key.id);
            setInterval(async function() {
                if (queque.indexOf(previousID) === -1) clearInterval(this);
                await new Promise(resolve => setTimeout(resolve, time));
            }, time);
        }

        let usedPrefix;


        let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]

async function checkAdmins(m, conn) {
  if (!m.isGroup) return { isRAdmin: false, isAdmin: false, isBotAdmin: false }

  try {
    const groupMetadata = await conn.groupMetadata(m.chat)
    const participants = groupMetadata.participants || []
    const user = participants.find(u => conn.decodeJid(u.id) === m.sender)
    const bot = participants.find(u => conn.decodeJid(u.id) === conn.user.jid)
    
    const isRAdmin = user?.admin === 'superadmin'
    const isAdmin = isRAdmin || user?.admin === 'admin'
    const isBotAdmin = bot?.admin === 'admin' || bot?.admin === 'superadmin'
    
    return { isRAdmin, isAdmin, isBotAdmin }
  } catch (e) {
    return { isRAdmin: false, isAdmin: false, isBotAdmin: false }
  }
}


(async () => {
  const adminStatus = await checkAdmins(m, conn)
  const { isRAdmin, isAdmin, isBotAdmin } = adminStatus
  
  if (isBotAdmin) {
  } else {
  }
})();



        const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins');
        for (let name in global.plugins) {
            let plugin = global.plugins[name];
            if (!plugin) {
                continue;
            }
            if (plugin.disabled) {
                continue;
            }

            const __filename = join(___dirname, name);
            if (typeof plugin.all === 'function') {
                try {
                    await plugin.all.call(this, m, {
                        chatUpdate,
                        __dirname: ___dirname,
                        __filename
                    });
                } catch (e) {
                    console.error(e);
                }
            }

            if (!opts['restrict'] && plugin.tags && plugin.tags.includes('admin')) {
                continue;
            }

            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
            const _prefix = plugin.customPrefix ? plugin.customPrefix : this.prefix ? this.prefix : global.prefix;
            const match = (_prefix instanceof RegExp ?
                [[_prefix.exec(m.text), _prefix]] :
                Array.isArray(_prefix) ?
                _prefix.map(p => {
                    const re = p instanceof RegExp ? p : new RegExp(str2Regex(p));
                    return [re.exec(m.text), re];
                }) :
                typeof _prefix === 'string' ?
                [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
                [
                    [
                        [], new RegExp()
                    ]
                ]
            ).find(p => p[1]);

            if (typeof plugin.before === 'function') {
                if (await plugin.before.call(this, m, {
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
                        __dirname: ___dirname,
                        __filename
                    })) {
                    continue;
                }
            }

            if (typeof plugin !== 'function') {
                continue;
            }
            if ((usedPrefix = (match[0] || '')[0])) {
                let noPrefix = m.text.replace(usedPrefix, '');
                let [command, ...args] = noPrefix.trim().split` `.filter(v => v);
                args = args || [];
                let _args = noPrefix.trim().split` `.slice(1);
                let text = _args.join` `;
                command = (command || '').toLowerCase();
                let fail = plugin.fail || global.dfail;
                let isAccept = plugin.command instanceof RegExp ?
                    plugin.command.test(command) :
                    Array.isArray(plugin.command) ?
                    plugin.command.some(cmd => cmd instanceof RegExp ? cmd.test(command) : cmd === command) :
                    typeof plugin.command === 'string' ?
                    plugin.command === command :
                    false;

                global.comando = command;

                if (!isAccept) {
                    continue;
                }
                m.plugin = name;

                if (m.chat in global.db.data.chats) {
                    let chat = global.db.data.chats[m.chat];
                    if (!['grupo-unbanchat.js', 'owner-exec.js', 'owner-exec2.js', 'grupo-delete.js'].includes(name) && chat?.isBanned && !isROwner) {
                        return;
                    }
                }

                let adminMode = global.db.data.chats[m.chat]?.modoadmin;
                let mini = `${plugin.botAdmin || plugin.admin || plugin.group || plugin || noPrefix || usedPrefix || m.text.slice(0, 1) === usedPrefix || plugin.command}`;

                if (adminMode && !isOwner && !isROwner && m.isGroup && !isAdmin && mini) {
                    return;
                }

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
                } else if (plugin.botAdmin && !isBotAdmin) {
                    fail('botAdmin', m, this);
                    continue;
                } else if (plugin.admin && !isAdmin) {
                    fail('admin', m, this);
                    continue;
                }
                if (plugin.private && m.isGroup) {
                    fail('private', m, this);
                    continue;
                }

                m.isCommand = true;
                let extra = {
                    match,
                    usedPrefix,
                    noPrefix,
                    _args,
                    args,
                    command,
                    text,
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
                    __dirname: ___dirname,
                    __filename
                };
                try {
                    await plugin.call(this, m, extra);
                } catch (e) {
                    m.error = e;
                    console.error(e);
                    if (e) {
                        let text = format(e);
                        for (let key of Object.values(global.APIKeys)) text = text.replace(new RegExp(key, 'g'), 'Administrador');
                        m.reply(text);
                    }
                } finally {
                    if (typeof plugin.after === 'function') {
                        try {
                            await plugin.after.call(this, m, extra);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }
                break;
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        if (opts['queque'] && m.text) {
            const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id);
            if (quequeIndex !== -1) {
                this.msgqueque.splice(quequeIndex, 1);
            }
        }
        let stats = global.db.data.stats;
        if (m) {
            if (m.sender && global.db.data.users[m.sender]?.muto === true) {
                const bang = m.key.id;
                const cancellazzione = m.key.participant;
                await this.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: cancellazzione } });
            }

            if (m.plugin) {
                const now = +new Date();
                const stat = stats[m.plugin] = stats[m.plugin] || { total: 0, success: 0, last: now, lastSuccess: now };
                stat.total += 1;
                stat.last = now;
                if (m.error == null) {
                    stat.success += 1;
                    stat.lastSuccess = now;
                }
            }
        }

        try {
            if (!opts['noprint']) {
                await (await import(`./lib/print.js`)).default(m, this);
            }
        } catch (e) {
            console.log(m, m.quoted, e);
        }

        const settingsREAD = global.db.data.settings[this.user.jid] || {};
        if (opts['autoread'] || settingsREAD.autoread2) {
            await this.readMessages([m.key]);
        }

        if (global.db.data.chats[m.chat]?.reaction && m.text.match(/(ción|dad|aje|oso|izar|mente|pero|tion|age|ous|ate|and|but|ify|ai|yuki|a|s)/gi)) {
            const emot = pickRandom(["😃", "😁", "😂", "🤣", "🥲", "☺️", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🌟", "🤓", "😎", "🥸", "🤩", "🥳", "😏", "💫", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😶‍🌫️", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🫣", "🤭", "🤖", "🍭", "🤫", "🫠", "🤥", "😶", "📇", "😐", "💧", "😑", "🫨", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😮‍💨", "😵", "😵‍💫", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👺", "🧿", "🌩", "👻", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "🫶", "👍", "✌️", "🙏", "🫵", "🤏", "🤌", "☝️", "🖕", "🙏", "🫵", "🫂", "🐱", "🤹‍♀️", "🤹‍♂️", "🗿", "✨", "⚡", "🔥", "🌈", "🩷", "❤️", "🧡", "💛", "💚", "🩵", "💙", "💜", "🖤", "🩶", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "🚩", "👊", "⚡️", "💋", "🫰", "💅", "👑", "🐣", "🐤", "🐈"]);
            if (!m.fromMe) {
                await this.sendMessage(m.chat, { react: { text: emot, key: m.key } });
            }
        }
    }
}

export async function deleteUpdate(message) {
    try {
        const { fromMe, id, participant } = message;
        if (fromMe) {
            return;
        }
        const msg = this.serializeM(this.loadMessage(id));
        const chat = global.db.data.chats[msg?.chat] || {};
        if (!chat?.delete || !msg || !msg?.isGroup) {
            return;
        }

        const antideleteMessage = `╭•┈•〘✘ 𝗔𝗡𝗧𝗜 𝗗𝗘𝗟𝗘𝗧𝗘 ✘〙•┈• ◊
│❍ 𝗨𝗦𝗨𝗔𝗥𝗜𝗢:
│• @${participant.split`@`[0]}
│
│❒ 𝗔𝗰𝗮𝗯𝗮 𝗱𝗲 𝗲𝗹𝗶𝗺𝗶𝗻𝗮𝗿 𝘂𝗻 𝗺𝗲𝗻𝘀𝗮𝗷𝗲
│𝗿𝗲𝗲𝗻𝘃𝗶𝗮𝗻𝗱𝗼... ⧖˚₊· ͟͟͞͞➳❥
╰•┈•〘✘ 𝗔𝗡𝗧𝗜 𝗗𝗘𝗟𝗘𝗧𝗘 ✘〙•┈• ◊`.trim();

        await this.sendMessage(msg.chat, { text: antideleteMessage, mentions: [participant] }, { quoted: msg });
        this.copyNForward(msg.chat, msg).catch(e => console.log(e, msg));
    } catch (e) {
        console.error(e);
    }
}

global.dfail = (type, m, conn) => {
    const msg = {
        rowner: `
╭━━━━━━━✦✗✦━━━━━━━╮
┃ 👑 *〘 ${global.comando} 〙*
┃ 𝑆𝑜𝑙𝑜 𝑝𝑎𝑟𝑎 𝑙𝑜𝑠 𝐶𝑟𝑒𝑎𝑑𝑜𝑟𝑒𝑠 🍥
┃ 𝑁𝑜 𝑖𝑛𝑠𝑖𝑠𝑡𝑎𝑠...
╰━━━━━━━✦✗━━━━━━━╯
`,

        owner: `
╭━━━━━━━⚡━━━━━━━╮
┃ ⚡ *〘 ${global.comando} 〙*
┃ 𝐸𝑥𝑐𝑙𝑢𝑠𝑖𝑣𝑜 𝑑𝑒 𝐷𝑒𝑠𝑎𝑟𝑟𝑜𝑙𝑙𝑎𝑑𝑜𝑟𝑒𝑠 🍃
┃ 𝑁𝑖𝑣𝑒𝑙 𝑖𝑛𝑠𝑢𝑓𝑖𝑐𝑖𝑒𝑛𝑡𝑒...
╰━━━━━━━⚡━━━━━━━╯
`,

        mods: `
╭━━━🍂━━━━━🍂━━━╮
┃ 👑 *〘 ${global.comando} 〙*
┃ 𝑆𝑜𝑙𝑜 𝑝𝑎𝑟𝑎 𝑀𝑜𝑑𝑒𝑟𝑎𝑑𝑒𝑟𝑒𝑠 🌀
┃ ¿𝐸𝑟𝑒𝑠 𝑢𝑛𝑜? 𝑁𝑜 𝑙𝑜 𝑐𝑟𝑒𝑜...
╰━━━🍂━━━━━🍂━━━╯
`,

        premium: `
╭━━━🔥━━━━━🔥━━━╮
┃ 👑 *〘 ${global.comando} 〙*
┃ 𝐿𝑢𝑗𝑜 𝑑𝑒 𝑃𝑟𝑒𝑚𝑖𝑢𝑚 ✨
┃ 𝑇ú 𝑎𝑢𝑛 𝑛𝑜 𝑒𝑠𝑡á𝑠 𝑎 𝑒𝑠𝑒 𝑛𝑖𝑣𝑒𝑙...
╰━━━🔥━━━━━🔥━━━╯`,

        group: `
╭━━━━━👥━━━━━╮
┃ 👑 *〘 ${global.comando} 〙*
┃ 𝑆𝑜𝑙𝑜 𝑓𝑢𝑛𝑐𝑖𝑜𝑛𝑎 𝑒𝑛 𝐺𝑟𝑢𝑝𝑜𝑠 🍂
┃ 𝑁𝑜 𝑡𝑟𝑎𝑡𝑒𝑠 𝑑𝑒 𝑒𝑛𝑔𝑎ñ𝑎𝑟...
╰━━━━━👥━━━━━╯`,

        private: `
╭━━━━━⚡━━━━━╮
┃ ⚡ *〘 ${global.comando} 〙*
┃ 𝑆𝑜𝑙𝑜 𝑒𝑛 𝑃𝑟𝑖𝑣𝑎𝑑𝑜 🍃
┃ 𝐴𝑞𝑢í 𝑛𝑜, 𝑎𝑚𝑖𝑔𝑜...
╰━━━━━⚡━━━━━╯`,

        admin: `
╭━━━👑━━━━━👑━━━╮
┃ 👑 *〘 ${global.comando} 〙*
┃ 𝑃𝑜𝑑𝑒𝑟 𝑟𝑒𝑠𝑒𝑟𝑣𝑎𝑑𝑜 𝑎 𝐴𝑑𝑚𝑖𝑛𝑠 🌀
┃ 𝑅𝑒𝑠𝑝𝑒𝑡𝑎 𝑒𝑠𝑎 𝑟𝑒𝑔𝑙𝑎...
╰━━━👑━━━━━👑━━━╯
`,

        botAdmin: `
╭━━━⚡━━━━━⚡━━━╮
┃ ⚡ *〘 ${global.comando} 〙*
┃ 𝑁𝑒𝑐𝑒𝑠𝑖𝑡𝑜 𝑠𝑒𝑟 𝐴𝑑𝑚𝑖𝑛 👊
┃ 𝐷𝑎𝑚𝑒 𝑒𝑙 𝑟𝑎𝑛𝑔𝑜 𝑦 𝘩𝑎𝑏𝑙𝑎𝑚𝑜𝑠...
╰━━━⚡━━━━━⚡━━━╯
`,

        restrict: `
╭━━━🚫━━━━━🚫━━━╮
┃ ⚡ *〘 ${global.comando} 〙*
┃ 𝐹𝑢𝑛𝑐𝑖ó𝑛 𝐵𝑙𝑜𝑞𝑢𝑒𝑎𝑑𝑎 ❌
┃ 𝐹𝑖𝑛 𝑑𝑒 𝑙𝑎 ℎ𝑖𝑠𝑡𝑜𝑟𝑖𝑎...
╰━━━🚫━━━━━🚫━━━╯`
    }[type];

    if (msg) conn.reply(m.chat, msg, m, fake).then(_ => m.react('✖️'));
};

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

let file = global.__filename(import.meta.url, true);
watchFile(file, async() => {
    unwatchFile(file);
    console.log(chalk.magenta("Se actualizo 'handler.js'"));
    if (global.conns && global.conns.length > 0) {
        const users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])];
        for (const userr of users) {
            userr.subreloadHandler(false);
        }
    }
});

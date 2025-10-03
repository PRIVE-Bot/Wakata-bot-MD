import { smsg } from './lib/simple.js';
import { format } from 'util'; 
import { fileURLToPath } from 'url';
import path, { join } from 'path';
import { unwatchFile, watchFile } from 'fs';
import chalk from 'chalk';
import fetch from 'node-fetch';
import ws from 'ws';

const { proto } = (await import('@whiskeysockets/baileys')).default;
const isNumber = x => typeof x === 'number' && !isNaN(x);
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
    clearTimeout(this);
}, ms));

global.dfail = (type, m, conn) => {
    const messages = {
        rowner: `
┏━━━━━━━━━━━━━━━━╮
┃ *〘 ${global.comando} 〙*
┃ ➣ 𝑆𝑜𝑙𝑜 𝑝𝑎𝑟𝑎 𝑙𝑜𝑠 𝐶𝑟𝑒𝑎𝑑𝑜𝑟𝑒𝑠 ↷
┃ » 𝑁𝑜 𝑖𝑛𝑠𝑖𝑠𝑡𝑎𝑠...
┗━━━━━━━━━━━━━━━━╯
`,
        owner: `
┏━━━━━━━━━━━━━━━━╮
┃ *〘 ${global.comando} 〙*
┃ ➣ 𝐸𝑥𝑐𝑙𝑢𝑠𝑖𝑣𝑜 𝑑𝑒 𝐷𝑒𝑠𝑎𝑟𝑟𝑜𝑙𝑙𝑎𝑑𝑜𝑟𝑒𝑠 ↷
┃ » 𝑁𝑖𝑣𝑒𝑙 𝑖𝑛𝑠𝑢𝑓𝑖𝑐𝑖𝑒𝑛𝑡𝑒...
┗━━━━━━━━━━━━━━━━╯
`,
        group: `
┏━━━━━━━━━━━━╮
┃  *〘 ${global.comando} 〙*
┃ ➣ 𝑆𝑜𝑙𝑜 𝑓𝑢𝑛𝑐𝑖𝑜𝑛𝑎 𝑒𝑛 𝐺𝑟𝑢𝑝𝑜𝑠 ↷
┃ » 𝑁𝑜 𝑡𝑟𝑎𝑡𝑒𝑠 𝑑𝑒 𝑒𝑛𝑔𝑎ñ𝑎𝑟...
┗━━━━━━━━━━━━━╯`,
        private: `
┏━━━━━╹━━━━━━━╮
┃  *〘 ${global.comando} 〙*
┃ ➣ 𝑆𝑜𝑙𝑜 𝑒𝑛 𝑃𝑟𝑖𝑣𝑎𝑑𝑜 ↷
┃ » 𝐴𝑞𝑢í 𝑛𝑜, 𝑎𝑚𝑖𝑔𝑜...
┗━━━━━━━━━━━━━╯`,
        admin: `
┏━━━━━━━━━━━━━━╮
┃  *〘 ${global.comando} 〙*
┃ ➣ 𝑃𝑜𝑑𝑒𝑟 𝑟𝑒𝑠𝑒𝑟𝑣𝑎𝑑𝑜 𝑎 𝐴𝑑𝑚𝑖𝑛𝑠 ↷
┃ » 𝑅𝑒𝑠𝑝𝑒𝑡𝑎 𝑒𝑠𝑎 𝑟𝑒𝑔𝑙𝑎...
┗━━━━━━━━━━━━━━╯
`,
        botAdmin: `
┏━━━━━━━━━━━━━━╮
┃ *〘 ${global.comando} 〙*
┃ ➣ 𝑁𝑒𝑐𝑒𝑠𝑖𝑡𝑜 𝑠𝑒𝑟 𝐴𝑑𝑚𝑖𝑛 ↷
┃ » 𝐷𝑎𝑚𝑒 𝑒𝑙 𝑟𝑎𝑛𝑔𝑜 𝑦 𝘩𝑎𝑏𝑙𝑎𝑚𝑜𝑠...
┗━━━━━━━━━━━━━━╯
`,
        restrict: `
┏━━━━━━━━━━━━━━╮
┃ *〘 ${global.comando} 〙*
┃ ➣ 𝐹𝑢𝑛𝑐𝑖ó𝑛 𝐵𝑙𝑜𝑞𝑢𝑒𝑎𝑑𝑎 ↷
┃ » 𝑁𝑜 𝑖𝑛𝑡𝑒𝑛𝑡𝑒𝑠...
┗━━━━━━━━━━━━━━╯`
    };
    if (messages[type]) {
        conn.reply(m.chat, messages[type], m);
    }
};


export async function handler(chatUpdate) {
    this.uptime = this.uptime || Date.now();

    if (!chatUpdate || !chatUpdate.messages || chatUpdate.messages.length === 0) {
        return;
    }

    let m = chatUpdate.messages[chatUpdate.messages.length - 1];
    if (!m) return;

    m = smsg(this, m) || m;
    if (!m) return;

    if (!m.isGroup) return;

    this.processedMessages = this.processedMessages || new Map();
    const now = Date.now();
    const lifeTime = 9000;

    for (let [msgId, time] of this.processedMessages) {
        if (now - time > lifeTime) {
            this.processedMessages.delete(msgId);
        }
    }

    const id = m.key.id;
    if (this.processedMessages.has(id)) return;
    this.processedMessages.set(id, now);

    try {
        m = smsg(this, m);
        if (!m) return;

        await this.readMessages([m.key]);

        if (global.db.data == null) {
            await global.loadDatabase();
        }

        m.exp = 0;
        m.coin = false;

        const senderJid = m.sender;
        if (!global.db.data.users[senderJid]) {
            global.db.data.users[senderJid] = {
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
            };
        }

        const chatJid = m.chat;
        if (!global.db.data.chats[chatJid]) {
            global.db.data.chats[chatJid] = {
                isBanned: false,
                sAutoresponder: '',
                welcome: true,
                autolevelup: false,
                autoresponder: false,
                delete: false,
                autoAceptar: false,
                autoRechazar: false,
                detect: true,
                antiBot: false,
                antiBot2: true,
                modoadmin: false,
                antiLink: true,
                antifake: false,
                reaction: false,
                nsfw: false,
                expired: 0, 
                antiLag: false,
                per: [],
            };
        }

        const settingsJid = this.user.jid;
        if (!global.db.data.settings[settingsJid]) {
            global.db.data.settings[settingsJid] = {
                self: false,
                restrict: true,
                jadibotmd: true,
                antiPrivate: false,
                autoread: false,
                soloParaJid: false, 
                status: 0
            };
        }

        const user = global.db.data.users[senderJid];
        const chat = global.db.data.chats[chatJid];
        const settings = global.db.data.settings[settingsJid];

        const detectwhat = m.sender.includes('@lid') ? '@lid' : '@s.whatsapp.net';
        const isROwner = global.owner.map(([number]) => number.replace(/[^0-9]/g, '') + detectwhat).includes(senderJid);
        const isOwner = isROwner || m.fromMe;

        if (m.isBaileys || opts['nyimak']) return;
        if (!isROwner && opts['self']) return;
        if (opts['swonly'] && m.chat !== 'status@broadcast') return;
        if (typeof m.text !== 'string') m.text = '';

        async function getLidFromJid(id, conn) {
            if (id.endsWith('@lid')) return id;
            const res = await conn.onWhatsApp(id).catch(() => []);
            return res[0]?.lid || id;
        }
        const senderLid = await getLidFromJid(m.sender, this);
        const botLid = await getLidFromJid(this.user.jid, this);
        const botJid = this.user.jid;
        const groupMetadata = m.isGroup ? ((this.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {};
        const participants = m.isGroup ? (groupMetadata.participants || []) : [];
        const user2 = participants.find(p => p.id === senderLid || p.jid === senderJid) || {};
        const bot = participants.find(p => p.id === botLid || p.id === botJid) || {};
        const isRAdmin = user2?.admin === "superadmin";
        const isAdmin = isRAdmin || user2?.admin === "admin";
        const isBotAdmin = !!bot?.admin;


        const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins');
        let usedPrefix = '';

        for (let name in global.plugins) {
            let plugin = global.plugins[name];
            if (!plugin || plugin.disabled) continue;

            const __filename = join(___dirname, name);
            if (typeof plugin.all === 'function') {
                try {
                    await plugin.all.call(this, m, {
                        chatUpdate,
                        __dirname: ___dirname,
                        __filename,
                        conn: this,
                        m: m
                    });
                } catch (e) {
                    console.error(e);
                }
            }

            if (!opts['restrict'] && plugin.tags && plugin.tags.includes('admin')) {
                continue;
            }

            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
            let _prefix = plugin.customPrefix ? plugin.customPrefix : this.prefix ? this.prefix : global.prefix;

            const match = (_prefix instanceof RegExp ? 
                [[_prefix.exec(m.text), _prefix]] :
                Array.isArray(_prefix) ?
                _prefix.map(p => {
                    const re = p instanceof RegExp ? p : new RegExp(str2Regex(p));
                    return [re.exec(m.text), re];
                }) :
                typeof _prefix === 'string' ?
                [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
                [[[], new RegExp()]]
            ).find(p => p[0]);

            if (typeof plugin.before === 'function') {
                if (await plugin.before.call(this, m, { match, conn: this, participants, groupMetadata, user, isROwner, isOwner, isRAdmin, isAdmin, isBotAdmin, chatUpdate, __dirname: ___dirname, __filename })) {
                    continue;
                }
            }

            if (typeof plugin !== 'function') continue;

            if (match) {
                usedPrefix = match[0][0];
                let noPrefix = m.text.replace(usedPrefix, '');
                let [command, ...args] = noPrefix.trim().split(/\s+/).filter(v => v);
                let text = args.join(' ');
                command = (command || '').toLowerCase();

                const fail = plugin.fail || global.dfail;
                const isAccept = plugin.command instanceof RegExp ? 
                    plugin.command.test(command) :
                    Array.isArray(plugin.command) ?
                    plugin.command.some(cmd => cmd instanceof RegExp ? cmd.test(command) : cmd === command) :
                    typeof plugin.command === 'string' ? 
                    plugin.command === command :
                    false;

                global.comando = command;

                const settings = global.db.data.settings[this.user.jid];
                if (settings.soloParaJid && m.sender !== settings.soloParaJid) {
                    continue; 
                }

                const chatID = m.chat;
                const ID_GRUPO_RESTRINGIDO = '120363421094353744@g.us';
                const comandosPermitidos = ['code', 'qr', 'welcome', 'detect', 'kick', 'tag'];

                if (chatID === ID_GRUPO_RESTRINGIDO) {
                    const isComandoPermitido = comandosPermitidos.includes(command);
                    if (!isComandoPermitido) {
                        continue; 
                    }
                }

                if (!isAccept) continue;

                m.plugin = name;

                if (chat?.isBanned && !isROwner) return;

                if (chat?.modoadmin && !isOwner && !isROwner && m.isGroup && !isAdmin) return;

                const checkPermissions = (perm) => {
                    const permissions = {
                        rowner: isROwner,
                        owner: isOwner,
                        group: m.isGroup,
                        botAdmin: isBotAdmin,
                        admin: isAdmin,
                        private: !m.isGroup,
                        restrict: !opts['restrict']
                    };
                    return permissions[perm];
                };

                const requiredPerms = ['rowner', 'owner', 'mods', 'premium', 'group', 'botAdmin', 'admin', 'private', 'restrict'];
                for (const perm of requiredPerms) {
                    if (plugin[perm] && !checkPermissions(perm)) {
                        fail(perm, m, this);
                        return;
                    }
                }

                m.isCommand = true;
                const xp = 'exp' in plugin ? parseInt(plugin.exp) : 10;
                m.exp += xp;

                const extra = {
                    match, usedPrefix, noPrefix, args, command, text, conn: this, participants, groupMetadata, user, isROwner, isOwner, isRAdmin, isAdmin, isBotAdmin, chatUpdate, __dirname: ___dirname, __filename
                };

                try {
                    await plugin.call(this, m, extra);
                } catch (e) {
                    m.error = e;
                    console.error(e);
                    const errorText = format(e).replace(new RegExp(Object.values(global.APIKeys || {}).join('|'), 'g'), 'Administrador');
                    m.reply(errorText);
                } finally {
                    if (typeof plugin.after === 'function') {
                        try {
                            await plugin.after.call(this, m, extra);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }
            }
        }

    } catch (e) {
        console.error(e);
    } finally {
        if (m) {
            const user = global.db.data.users[m.sender];
            if (user && user.muto) {
                await this.sendMessage(m.chat, { delete: m.key });
            }
            if (user) {
                user.exp += m.exp;
                user.coin -= m.coin * 1;
            }
            if (m.plugin) {
                const stats = global.db.data.stats;
                const now = Date.now();
                if (!stats[m.plugin]) {
                    stats[m.plugin] = { total: 0, success: 0, last: 0, lastSuccess: 0 };
                }
                const stat = stats[m.plugin];
                stat.total += 1;
                stat.last = now;
                if (!m.error) {
                    stat.success += 1;
                    stat.lastSuccess = now;
                }
            }
        }
    }
}


let file = global.__filename(import.meta.url, true);
watchFile(file, async () => {
    unwatchFile(file);
    console.log(chalk.magenta("Se actualizo 'handler.js'"));
    if (global.conns && global.conns.length > 0) {
        const users = global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED);
        for (const user of users) {
            // Se asume que 'subreloadHandler' es una función que existe en el objeto de conexión
            // y que está bien definida para no causar el error.
            if (typeof user.subreloadHandler === 'function') {
                 user.subreloadHandler(false);
            }
        }
    }
});

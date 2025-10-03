import { smsg } from './lib/simple.js';
import { format } from 'util'; 
import { fileURLToPath, pathToFileURL } from 'url';
import { platform } from 'process';
import path, { join } from 'path';
import { unwatchFile, watchFile } from 'fs';
import chalk from 'chalk';
import ws from 'ws';
import { createRequire } from 'module';

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
};
global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true));
};
global.__require = function require(dir = import.meta.url) {
  return createRequire(dir);
};

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

export async function subBotHandler(chatUpdate) {
    this.uptime = this.uptime || Date.now();
    const subConn = this;
    let m; 

    if (!chatUpdate || !chatUpdate.messages || chatUpdate.messages.length === 0) {
        return;
    }

    let subM = chatUpdate.messages[chatUpdate.messages.length - 1];
    if (!subM) return;

    subM = smsg(this, subM) || subM;
    if (!subM) return;

    this.processedMessages = this.processedMessages || new Map();
    const now = Date.now();
    const lifeTime = 9000;

    for (let [msgId, time] of this.processedMessages) {
        if (now - time > lifeTime) {
            this.processedMessages.delete(msgId);
        }
    }

    const subId = subM.key.id;
    if (this.processedMessages.has(subId)) return;
    this.processedMessages.set(subId, now);

    try {
        m = smsg(this, subM); 
        if (!m) return;

        await this.readMessages([m.key]);

        if (global.db.data == null) {
            await global.loadDatabase();
        }

        m.exp = 0;
        m.coin = false;

        const subSenderJid = m.sender;
        if (!global.db.data.users[subSenderJid]) {
            global.db.data.users[subSenderJid] = {
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

        const subChatJid = m.chat;
        if (!global.db.data.chats[subChatJid]) {
            global.db.data.chats[subChatJid] = {
                isBanned: false, 
                subbotDisabled: false, 
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

        const subSettingsJid = subConn.user.jid;
        if (!global.db.data.settings[subSettingsJid]) {
            global.db.data.settings[subSettingsJid] = {
                self: false,
                restrict: true,
                jadibotmd: true,
                antiPrivate: false,
                autoread: false,
                soloParaJid: false, 
                status: 0
            };
        }

        const subUser = global.db.data.users[subSenderJid];
        const subChat = global.db.data.chats[subChatJid];
        const subSettings = global.db.data.settings[subSettingsJid];

        const subDetectwhat = m.sender.includes('@lid') ? '@lid' : '@s.whatsapp.net';
        const isROwner = global.owner.map(([number]) => number.replace(/[^0-9]/g, '') + subDetectwhat).includes(subSenderJid);
        const isOwner = isROwner || m.fromMe;

        if (m.isBaileys || opts['nyimak']) return;
        if (!isROwner && opts['self']) return;
        if (opts['swonly'] && m.chat !== 'status@broadcast') return;
        if (typeof m.text !== 'string') m.text = '';

        async function getLidFromJid(id, connection) {
            if (id.endsWith('@lid')) return id;
            const res = await connection.onWhatsApp(id).catch(() => []);
            return res[0]?.lid || id;
        }
        const subSenderLid = await getLidFromJid(m.sender, subConn);
        const subBotLid = await getLidFromJid(subConn.user.jid, subConn);
        const subBotJid = subConn.user.jid;
        const subGroupMetadata = m.isGroup ? ((subConn.chats[m.chat] || {}).metadata || await subConn.groupMetadata(m.chat).catch(_ => null)) : {};
        const subParticipants = m.isGroup ? (subGroupMetadata.participants || []) : [];
        const subUser2 = subParticipants.find(p => p.id === subSenderLid || p.jid === subSenderJid) || {};
        const subBot = subParticipants.find(p => p.id === subBotLid || p.id === subBotJid) || {};
        const isRAdmin = subUser2?.admin === "superadmin";
        const isAdmin = isRAdmin || subUser2?.admin === "admin";
        const isBotAdmin = !!subBot?.admin;

        
        const subDirname = path.join(path.dirname(global.__filename(import.meta.url, true)), './plugins');
        let subUsedPrefix = '';

        for (let name in global.plugins) {
            let plugin = global.plugins[name];
            if (!plugin || plugin.disabled) continue;

            const subFilename = join(subDirname, name);
            if (typeof plugin.all === 'function') {
                try {
                    const subExtraAll = { chatUpdate, __dirname: subDirname, __filename: subFilename, conn: this, m };
                    await plugin.all.call(this, m, subExtraAll);
                } catch (e) {
                    console.error(e);
                }
            }

            if (!opts['restrict'] && plugin.tags && plugin.tags.includes('admin')) {
                continue;
            }

            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
            let _prefix = plugin.customPrefix ? plugin.customPrefix : this.prefix ? this.prefix : global.prefix;

            const subMatch = (_prefix instanceof RegExp ? 
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
                const subExtraBefore = { subMatch, subConn: this, subParticipants, subGroupMetadata, subUser, isROwner, isOwner, isRAdmin, isAdmin, isBotAdmin, chatUpdate, __dirname: subDirname, __filename: subFilename, conn: this, m };
                if (await plugin.before.call(this, m, subExtraBefore)) {
                    continue;
                }
            }

            if (typeof plugin !== 'function') continue;

            if (subMatch) {
                subUsedPrefix = subMatch[0][0];
                let subNoPrefix = m.text.replace(subUsedPrefix, '');
                let [subCommand, ...subArgs] = subNoPrefix.trim().split(/\s+/).filter(v => v);
                let subText = subArgs.join(' ');
                subCommand = (subCommand || '').toLowerCase();
                
                if (subCommand === 'bansub' || subCommand === 'unbansub') {
                    if (!isOwner) {
                        global.dfail('owner', m, this);
                        return;
                    }
                    if (!m.isGroup) {
                        global.dfail('group', m, this);
                        return;
                    }
                    
                    if (subCommand === 'bansub') {
                        subChat.subbotDisabled = true;
                        this.reply(m.chat, `
╔═════╸━━━╸═════╗
║ ⚜️ *SUB-BOT INACTIVO* ⚜️ 
║ 
║ 🛡️ Este Sub-Bot ha sido *DESHABILITADO* ║    para responder CUALQUIER comando en este 
║    grupo de forma PERMANENTE hasta que se 
║    use *!unbansub* por el creador.
╚═════╸━━━╸═════╝`, m);
                        return;
                    }

                    if (subCommand === 'unbansub') {
                        subChat.subbotDisabled = false;
                        this.reply(m.chat, `
╔═════╸━━━╸═════╗
║ 🚀 *SUB-BOT ACTIVO* 🚀 
║ 
║ ✅ Este Sub-Bot ha sido *HABILITADO* ║    para responder comandos con normalidad.
╚═════╸━━━╸═════╝`, m);
                        return;
                    }
                }
                
                if (m.isGroup && subChat.subbotDisabled) return;

                const subFail = plugin.fail || global.dfail;

                const subIsAccept = plugin.command instanceof RegExp ? 
                    plugin.command.test(subCommand) :
                    Array.isArray(plugin.command) ?
                    plugin.command.some(cmd => cmd instanceof RegExp ? cmd.test(subCommand) : cmd === subCommand) :
                    typeof plugin.command === 'string' ? 
                    plugin.command === subCommand :
                    false;

                global.comando = subCommand;

                const subSettings = global.db.data.settings[subConn.user.jid];
                if (subSettings.soloParaJid && m.sender !== subSettings.soloParaJid) {
                    continue; 
                }

                if (!subIsAccept) continue;

                m.plugin = name;

                if (subChat?.isBanned && !isROwner) return;

                if (subChat?.modoadmin && !isOwner && !isROwner && m.isGroup && !isAdmin) return;

                const checkPermissions = (perm) => {
                    const permissions = {
                        rowner: isROwner,
                        owner: isOwner,
                        mods: false,
                        premium: false,
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
                        subFail(perm, m, this);
                        return;
                    }
                }

                m.isCommand = true;
                const subXp = 'exp' in plugin ? parseInt(plugin.exp) : 10;
                m.exp += subXp;

                const subExtra = {
                    subMatch, subUsedPrefix, subNoPrefix, subArgs, subCommand, subText, subConn: this, subParticipants, subGroupMetadata, subUser, isROwner, isOwner, isRAdmin, isAdmin, isBotAdmin, chatUpdate, __dirname: subDirname, __filename,
                    fail: subFail,
                    conn: this,
                    m
                };

                try {
                    await plugin.call(this, m, subExtra);
                } catch (e) {
                    m.error = e;
                    console.error(e);
                    const errorText = format(e).replace(new RegExp(Object.values(global.APIKeys || {}).join('|'), 'g'), 'Administrador');
                    this.reply(m.chat, errorText, m);
                } finally {
                    if (typeof plugin.after === 'function') {
                        try {
                            await plugin.after.call(this, m, subExtra);
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
            const subUser = global.db.data.users[m.sender];
            if (subUser && subUser.muto) {
                await this.sendMessage(m.chat, { delete: m.key });
            }
            if (subUser) {
                subUser.exp += m.exp;
                subUser.coin -= m.coin * 1;
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


let subFile = global.__filename(import.meta.url, true);
watchFile(subFile, async () => {
    unwatchFile(subFile);
    console.log(chalk.magenta("Se actualizó 'sub-handler.js' para sub-bots."));
    if (global.conns && global.conns.length > 0) {
        const users = global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED);
        for (const user of users) {
            user.subreloadHandler(false); 
        }
    }
});

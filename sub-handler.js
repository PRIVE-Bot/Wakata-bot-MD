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

export async function subBotHandler(chatUpdate) {
    this.uptime = this.uptime || Date.now();
    const subConn = this;

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
        subM = smsg(this, subM);
        if (!subM) return;

        await this.readMessages([subM.key]);

        if (global.db.data == null) {
            await global.loadDatabase();
        }

        subM.exp = 0;
        subM.coin = false;

        const subSenderJid = subM.sender;
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
                name: subM.name,
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

        const subChatJid = subM.chat;
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

        const subDetectwhat = subM.sender.includes('@lid') ? '@lid' : '@s.whatsapp.net';
        const isROwner = global.owner.map(([number]) => number.replace(/[^0-9]/g, '') + subDetectwhat).includes(subSenderJid);
        const isOwner = isROwner || subM.fromMe;

        if (subM.isBaileys || opts['nyimak']) return;
        if (!isROwner && opts['self']) return;
        if (opts['swonly'] && subM.chat !== 'status@broadcast') return;
        if (typeof subM.text !== 'string') subM.text = '';

        async function getLidFromJid(id, connection) {
            if (id.endsWith('@lid')) return id;
            const res = await connection.onWhatsApp(id).catch(() => []);
            return res[0]?.lid || id;
        }
        const subSenderLid = await getLidFromJid(subM.sender, subConn);
        const subBotLid = await getLidFromJid(subConn.user.jid, subConn);
        const subBotJid = subConn.user.jid;
        const subGroupMetadata = subM.isGroup ? ((subConn.chats[subM.chat] || {}).metadata || await subConn.groupMetadata(subM.chat).catch(_ => null)) : {};
        const subParticipants = subM.isGroup ? (subGroupMetadata.participants || []) : [];
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
                    await plugin.all.call(this, subM, {
                        chatUpdate,
                        __dirname: subDirname,
                        __filename: subFilename
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

            const subMatch = (_prefix instanceof RegExp ? 
                [[_prefix.exec(subM.text), _prefix]] :
                Array.isArray(_prefix) ?
                _prefix.map(p => {
                    const re = p instanceof RegExp ? p : new RegExp(str2Regex(p));
                    return [re.exec(subM.text), re];
                }) :
                typeof _prefix === 'string' ?
                [[new RegExp(str2Regex(_prefix)).exec(subM.text), new RegExp(str2Regex(_prefix))]] :
                [[[], new RegExp()]]
            ).find(p => p[0]);

            if (typeof plugin.before === 'function') {
                const subExtra = { subMatch, subConn: this, subParticipants, subGroupMetadata, subUser, isROwner, isOwner, isRAdmin, isAdmin, isBotAdmin, chatUpdate, __dirname: subDirname, __filename: subFilename };
                if (await plugin.before.call(this, subM, subExtra)) {
                    continue;
                }
            }

            if (typeof plugin !== 'function') continue;

            if (subMatch) {
                subUsedPrefix = subMatch[0][0];
                let subNoPrefix = subM.text.replace(subUsedPrefix, '');
                let [subCommand, ...subArgs] = subNoPrefix.trim().split(/\s+/).filter(v => v);
                let subText = subArgs.join(' ');
                subCommand = (subCommand || '').toLowerCase();
                
                // Lógica de !bansub y !unbansub
                if (subCommand === 'bansub' || subCommand === 'unbansub') {
                    if (!isOwner) {
                        global.dfail('owner', subM, this);
                        return;
                    }
                    if (!subM.isGroup) {
                        global.dfail('group', subM, this);
                        return;
                    }
                    
                    if (subCommand === 'bansub') {
                        subChat.subbotDisabled = true;
                        this.reply(subM.chat, `
╔═════╸━━━╸═════╗
║ ⚜️ *SUB-BOT INACTIVO* ⚜️ 
║ 
║ 🛡️ Este Sub-Bot ha sido *DESHABILITADO* ║    para responder CUALQUIER comando en este 
║    grupo de forma PERMANENTE hasta que se 
║    use *!unbansub* por el creador.
╚═════╸━━━╸═════╝`, subM);
                        return;
                    }

                    if (subCommand === 'unbansub') {
                        subChat.subbotDisabled = false;
                        this.reply(subM.chat, `
╔═════╸━━━╸═════╗
║ 🚀 *SUB-BOT ACTIVO* 🚀 
║ 
║ ✅ Este Sub-Bot ha sido *HABILITADO* ║    para responder comandos con normalidad.
╚═════╸━━━╸═════╝`, subM);
                        return;
                    }
                }
                
                // Si el subbot está deshabilitado, sale de la ejecución
                if (subM.isGroup && subChat.subbotDisabled) return;

                const subFail = plugin.fail || global.dfail; // Usa global.dfail

                const subIsAccept = plugin.command instanceof RegExp ? 
                    plugin.command.test(subCommand) :
                    Array.isArray(plugin.command) ?
                    plugin.command.some(cmd => cmd instanceof RegExp ? cmd.test(subCommand) : cmd === subCommand) :
                    typeof plugin.command === 'string' ? 
                    plugin.command === subCommand :
                    false;

                global.comando = subCommand;

                const subSettings = global.db.data.settings[subConn.user.jid];
                if (subSettings.soloParaJid && subM.sender !== subSettings.soloParaJid) {
                    continue; 
                }

                if (!subIsAccept) continue;

                subM.plugin = name;

                if (subChat?.isBanned && !isROwner) return;

                if (subChat?.modoadmin && !isOwner && !isROwner && subM.isGroup && !isAdmin) return;

                const checkPermissions = (perm) => {
                    const permissions = {
                        rowner: isROwner,
                        owner: isOwner,
                        mods: false,
                        premium: false,
                        group: subM.isGroup,
                        botAdmin: isBotAdmin,
                        admin: isAdmin,
                        private: !subM.isGroup,
                        restrict: !opts['restrict']
                    };
                    return permissions[perm];
                };

                const requiredPerms = ['rowner', 'owner', 'mods', 'premium', 'group', 'botAdmin', 'admin', 'private', 'restrict'];
                for (const perm of requiredPerms) {
                    if (plugin[perm] && !checkPermissions(perm)) {
                        subFail(perm, subM, this);
                        return;
                    }
                }

                subM.isCommand = true;
                const subXp = 'exp' in plugin ? parseInt(plugin.exp) : 10;
                subM.exp += subXp;

                const subExtra = {
                    subMatch, subUsedPrefix, subNoPrefix, subArgs, subCommand, subText, subConn: this, subParticipants, subGroupMetadata, subUser, isROwner, isOwner, isRAdmin, isAdmin, isBotAdmin, chatUpdate, __dirname: subDirname, __filename,
                    fail: subFail // <-- Pasamos la función como 'fail' para plugins
                };

                try {
                    await plugin.call(this, subM, subExtra);
                } catch (e) {
                    subM.error = e;
                    console.error(e);
                    const errorText = format(e).replace(new RegExp(Object.values(global.APIKeys || {}).join('|'), 'g'), 'Administrador');
                    this.reply(subM.chat, errorText, subM);
                } finally {
                    if (typeof plugin.after === 'function') {
                        try {
                            await plugin.after.call(this, subM, subExtra);
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
        if (subM) {
            const subUser = global.db.data.users[subM.sender];
            if (subUser && subUser.muto) {
                await this.sendMessage(subM.chat, { delete: subM.key });
            }
            if (subUser) {
                subUser.exp += subM.exp;
                subUser.coin -= subM.coin * 1;
            }
            if (subM.plugin) {
                const stats = global.db.data.stats;
                const now = Date.now();
                if (!stats[subM.plugin]) {
                    stats[subM.plugin] = { total: 0, success: 0, last: 0, lastSuccess: 0 };
                }
                const stat = stats[subM.plugin];
                stat.total += 1;
                stat.last = now;
                if (!subM.error) {
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

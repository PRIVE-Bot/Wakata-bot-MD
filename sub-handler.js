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
    const subConn = this; // Renombrado a subConn

    if (!chatUpdate || !chatUpdate.messages || chatUpdate.messages.length === 0) {
        return;
    }

    let subM = chatUpdate.messages[chatUpdate.messages.length - 1]; // Renombrado a subM
    if (!subM) return;

    subM = smsg(this, subM) || subM;
    if (!subM) return;

    // if (!subM.isGroup) return; // Línea comentada, descomentar si solo se quieren grupos

    this.processedMessages = this.processedMessages || new Map();
    const now = Date.now();
    const lifeTime = 9000;

    for (let [msgId, time] of this.processedMessages) {
        if (now - time > lifeTime) {
            this.processedMessages.delete(msgId);
        }
    }

    const subId = subM.key.id; // Renombrado a subId
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

        const subSenderJid = subM.sender; // Renombrado a subSenderJid
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
                name: subM.name, // Usando subM
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

        const subChatJid = subM.chat; // Renombrado a subChatJid
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

        const subSettingsJid = subConn.user.jid; // Usando subConn
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

        const subUser = global.db.data.users[subSenderJid]; // Renombrado a subUser
        const subChat = global.db.data.chats[subChatJid];   // Renombrado a subChat
        const subSettings = global.db.data.settings[subSettingsJid]; // Renombrado a subSettings

        const subDetectwhat = subM.sender.includes('@lid') ? '@lid' : '@s.whatsapp.net';
        const isROwner = global.owner.map(([number]) => number.replace(/[^0-9]/g, '') + subDetectwhat).includes(subSenderJid);
        const isOwner = isROwner || subM.fromMe; // Usando subM

        if (subM.isBaileys || opts['nyimak']) return; // Usando subM
        if (!isROwner && opts['self']) return;
        if (opts['swonly'] && subM.chat !== 'status@broadcast') return; // Usando subM
        if (typeof subM.text !== 'string') subM.text = ''; // Usando subM

        async function getLidFromJid(id, connection) { // Renombrado conn a connection
            if (id.endsWith('@lid')) return id;
            const res = await connection.onWhatsApp(id).catch(() => []);
            return res[0]?.lid || id;
        }
        const subSenderLid = await getLidFromJid(subM.sender, subConn); // Usando subM y subConn
        const subBotLid = await getLidFromJid(subConn.user.jid, subConn); // Usando subConn
        const subBotJid = subConn.user.jid; // Usando subConn
        const subGroupMetadata = subM.isGroup ? ((subConn.chats[subM.chat] || {}).metadata || await subConn.groupMetadata(subM.chat).catch(_ => null)) : {}; // Usando subM y subConn
        const subParticipants = subM.isGroup ? (subGroupMetadata.participants || []) : []; // Renombrado a subParticipants
        const subUser2 = subParticipants.find(p => p.id === subSenderLid || p.jid === subSenderJid) || {}; // Renombrado a subUser2
        const subBot = subParticipants.find(p => p.id === subBotLid || p.id === subBotJid) || {}; // Renombrado a subBot
        const isRAdmin = subUser2?.admin === "superadmin"; // Usando subUser2
        const isAdmin = isRAdmin || subUser2?.admin === "admin"; // Usando subUser2
        const isBotAdmin = !!subBot?.admin; // Usando subBot

        if (subM.isGroup && subChat.subbotDisabled) { // Usando subM y subChat
            const subCommandText = subM.text.toLowerCase().split(' ')[0]; // Usando subM
            const subIsUnbanCommand = subCommandText === '!unbansub';

            if (!subIsUnbanCommand) {
                return;
            }

            if (subIsUnbanCommand) {
                if (isOwner || isROwner) {
                    subChat.subbotDisabled = false;
                    this.reply(subM.chat, `
╔═════╸━━━╸═════╗
║ 🚀 *SUB-BOT ACTIVO* 🚀 
║ 
║ ✅ Este Sub-Bot ha sido *HABILITADO* ║    para responder comandos con normalidad.
╚═════╸━━━╸═════╝`, subM);
                } else {
                    global.dfail('owner', subM, this); // Usando subM
                }
                return; 
            }
        }

        const subDirname = path.join(path.dirname(global.__filename(import.meta.url, true)), './plugins'); // Renombrado a subDirname
        let subUsedPrefix = ''; // Renombrado a subUsedPrefix

        for (let name in global.plugins) {
            let plugin = global.plugins[name];
            if (!plugin || plugin.disabled) continue;

            const subFilename = join(subDirname, name); // Usando subDirname
            if (typeof plugin.all === 'function') {
                try {
                    await plugin.all.call(this, subM, { // Usando subM
                        chatUpdate,
                        __dirname: subDirname, // Usando subDirname
                        __filename: subFilename // Usando subFilename
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
                [[_prefix.exec(subM.text), _prefix]] : // Usando subM
                Array.isArray(_prefix) ?
                _prefix.map(p => {
                    const re = p instanceof RegExp ? p : new RegExp(str2Regex(p));
                    return [re.exec(subM.text), re]; // Usando subM
                }) :
                typeof _prefix === 'string' ?
                [[new RegExp(str2Regex(_prefix)).exec(subM.text), new RegExp(str2Regex(_prefix))]] : // Usando subM
                [[[], new RegExp()]]
            ).find(p => p[0]); // Renombrado a subMatch

            if (typeof plugin.before === 'function') {
                const subExtra = { subMatch, subConn: this, subParticipants, subGroupMetadata, subUser, isROwner, isOwner, isRAdmin, isAdmin, isBotAdmin, chatUpdate, __dirname: subDirname, __filename: subFilename }; // Renombrado a subExtra
                if (await plugin.before.call(this, subM, subExtra)) { // Usando subM
                    continue;
                }
            }

            if (typeof plugin !== 'function') continue;

            if (subMatch) { // Usando subMatch
                subUsedPrefix = subMatch[0][0]; // Usando subMatch
                let subNoPrefix = subM.text.replace(subUsedPrefix, ''); // Renombrado y usando subM, subUsedPrefix
                let [subCommand, ...subArgs] = subNoPrefix.trim().split(/\s+/).filter(v => v); // Renombrado
                let subText = subArgs.join(' '); // Renombrado
                subCommand = (subCommand || '').toLowerCase(); // Usando subCommand


                if (subCommand === 'bansub') { // Usando subCommand
                    if (!isOwner) {
                        global.dfail('owner', subM, this);
                        return;
                    }
                    if (!subM.isGroup) {
                        global.dfail('group', subM, this);
                        return;
                    }

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

                if (subCommand === 'subtest') { // Usando subCommand
                    this.reply(subM.chat, `
┏━━━━━━━◥◣ ◆ ◢◤━━━━━━━┓
┃ ✨ *POTENCIA SUBORDINADA ACTIVA* ✨
┃ 
┃ ⚙️ *Estado:* Operacional y aislado.
┃ 🔑 *Comando único:* *${subCommand}* ejecutado.
┃ 👤 *Usuario:* ${subM.name}
┗━━━━━━━◢◤ ◆ ◥◣━━━━━━━┛`, subM);
                    return;
                }


                const subFail = plugin.fail || global.dfail; // Renombrado a subFail
                const subIsAccept = plugin.command instanceof RegExp ? 
                    plugin.command.test(subCommand) : // Usando subCommand
                    Array.isArray(plugin.command) ?
                    plugin.command.some(cmd => cmd instanceof RegExp ? cmd.test(subCommand) : cmd === subCommand) : // Usando subCommand
                    typeof plugin.command === 'string' ? 
                    plugin.command === subCommand : // Usando subCommand
                    false; // Renombrado a subIsAccept

                global.comando = subCommand; // Usando subCommand

                const subSettings = global.db.data.settings[subConn.user.jid]; // Usando subConn
                if (subSettings.soloParaJid && subM.sender !== subSettings.soloParaJid) { // Usando subM y subSettings
                    continue; 
                }

                if (!subIsAccept) continue; // Usando subIsAccept

                subM.plugin = name; // Usando subM

                if (subChat?.isBanned && !isROwner) return; // Usando subChat

                if (subChat?.modoadmin && !isOwner && !isROwner && subM.isGroup && !isAdmin) return; // Usando subChat y subM

                const checkPermissions = (perm) => {
                    const permissions = {
                        rowner: isROwner,
                        owner: isOwner,
                        mods: false,
                        premium: false,
                        group: subM.isGroup, // Usando subM
                        botAdmin: isBotAdmin,
                        admin: isAdmin,
                        private: !subM.isGroup, // Usando subM
                        restrict: !opts['restrict']
                    };
                    return permissions[perm];
                };

                const requiredPerms = ['rowner', 'owner', 'mods', 'premium', 'group', 'botAdmin', 'admin', 'private', 'restrict'];
                for (const perm of requiredPerms) {
                    if (plugin[perm] && !checkPermissions(perm)) {
                        subFail(perm, subM, this); // Usando subFail y subM
                        return;
                    }
                }

                subM.isCommand = true; // Usando subM
                const subXp = 'exp' in plugin ? parseInt(plugin.exp) : 10; // Renombrado a subXp
                subM.exp += subXp; // Usando subM y subXp

                const subExtra = { // Renombrado a subExtra
                    subMatch, subUsedPrefix, subNoPrefix, subArgs, subCommand, subText, subConn: this, subParticipants, subGroupMetadata, subUser, isROwner, isOwner, isRAdmin, isAdmin, isBotAdmin, chatUpdate, __dirname: subDirname, __filename: subFilename
                };

                try {
                    await plugin.call(this, subM, subExtra); // Usando subM y subExtra
                } catch (e) {
                    subM.error = e; // Usando subM
                    console.error(e);
                    const errorText = format(e).replace(new RegExp(Object.values(global.APIKeys || {}).join('|'), 'g'), 'Administrador');
                    this.reply(subM.chat, errorText, subM); // Usando subM
                } finally {
                    if (typeof plugin.after === 'function') {
                        try {
                            await plugin.after.call(this, subM, subExtra); // Usando subM y subExtra
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
        if (subM) { // Usando subM
            const subUser = global.db.data.users[subM.sender]; // Usando subM
            if (subUser && subUser.muto) { // Usando subUser
                await this.sendMessage(subM.chat, { delete: subM.key }); // Usando subM
            }
            if (subUser) { // Usando subUser
                subUser.exp += subM.exp; // Usando subM
                subUser.coin -= subM.coin * 1; // Usando subM
            }
            if (subM.plugin) { // Usando subM
                const stats = global.db.data.stats;
                const now = Date.now();
                if (!stats[subM.plugin]) { // Usando subM
                    stats[subM.plugin] = { total: 0, success: 0, last: 0, lastSuccess: 0 };
                }
                const stat = stats[subM.plugin];
                stat.total += 1;
                stat.last = now;
                if (!subM.error) { // Usando subM
                    stat.success += 1;
                    stat.lastSuccess = now;
                }
            }
        }
    }
}

global.dfail = (type, subM, subConn) => { // Renombrado a subM y subConn
    const messages = {
        rowner: `
╔═════╸━━━╸═════╗
║ 🚫 *ACCESO DENEGADO* 🚫
║ 
║ 👑 *Comando:* ${global.comando}
║ ⚠️ *Razón:* Solo para el Creador Principal.
║ 
║ 💡 _Este sub-bot es potente, ¡pero no es tuyo!_
╚═════╸━━━╸═════╝`,
        owner: `
╔═════╸━━━╸═════╗
║ 🔒 *FUNCIÓN RESTRINGIDA* 🔒
║ 
║ 🛠️ *Comando:* ${global.comando}
║ 🚨 *Razón:* Exclusivo del Dueño del Sub-Bot.
║ 
║ ⚙️ _Necesitas ser el usuario vinculado para usarlo._
╚═════╸━━━╸═════╝`,
        group: `
╔═════╸━━━╸═════╗
║ 👥 *ENTORNO INCORRECTO* 👥
║ 
║ ➡️ *Comando:* ${global.comando}
║ 🌎 *Razón:* Solo puede ejecutarse en Grupos.
╚═════╸━━━╸═════╝`,
        private: `
╔═════╸━━━╸═════╗
║ 🤫 *MODO PRIVADO* 🤫
║ 
║ 💬 *Comando:* ${global.comando}
║ 👤 *Razón:* Solo en conversación privada.
╚═════╸━━━╸═════╝`,
        admin: `
╔═════╸━━━╸═════╗
║ ⚔️ *REQUIERE RANGO ADMIN* ⚔️
║ 
║ 📢 *Comando:* ${global.comando}
║ 🛡️ *Razón:* Necesitas ser Administrador del Grupo.
╚═════╸━━━╸═════╝`,
        botAdmin: `
╔═════╸━━━╸═════╗
║ 🤖 *NECESITO PERMISO* 🤖
║ 
║ 💥 *Comando:* ${global.comando}
║ ✨ *Razón:* El sub-bot debe ser Admin para funcionar.
╚═════╸━━━╸═════╝`,
        restrict: `
╔═════╸━━━╸═════╗
║ 🛑 *FUNCIÓN BLOQUEADA* 🛑
║ 
║ ❌ *Comando:* ${global.comando}
║ ⚙️ *Razón:* Restricción de configuración del Sub-Bot.
╚═════╸━━━╸═════╝`
    };
    if (messages[type]) {
        subConn.reply(subM.chat, messages[type], subM, rcanal); // Usando subConn y subM
    }
};

let subFile = global.__filename(import.meta.url, true); // Renombrado a subFile
watchFile(subFile, async () => { // Usando subFile
    unwatchFile(subFile); // Usando subFile
    console.log(chalk.magenta("Se actualizó 'sub-handler.js' para sub-bots."));
    if (global.conns && global.conns.length > 0) {
        const users = global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED);
        for (const user of users) {
            user.subreloadHandler(false); 
        }
    }
});

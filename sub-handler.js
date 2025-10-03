import { smsg } from './lib/simple.js';
import { format } from 'util'; 
import { fileURLToPath } from 'url';
import path, { join } from 'path';
import { unwatchFile, watchFile } from 'fs';
import chalk from 'chalk';
import ws from 'ws';

const { proto } = (await import('@whiskeysockets/baileys')).default;
const isNumber = x => typeof x === 'number' && !isNaN(x);
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
    clearTimeout(this);
}, ms));

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
        const senderLid = await getLidFromJid(m.sender, conn);
        const botLid = await getLidFromJid(conn.user.jid, conn);
        const botJid = conn.user.jid;
        const groupMetadata = m.isGroup ? ((conn.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {};
        const participants = m.isGroup ? (groupMetadata.participants || []) : [];
        const user2 = participants.find(p => p.id === senderLid || p.jid === senderJid) || {};
        const bot = participants.find(p => p.id === botLid || p.id === botJid) || {};
        const isRAdmin = user2?.admin === "superadmin";
        const isAdmin = isRAdmin || user2?.admin === "admin";
        const isBotAdmin = !!bot?.admin;

        if (m.isGroup && chat.subbotDisabled && !isROwner && !m.fromMe) return;

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

                
                if (command === 'bansub' || command === 'unbansub') {
                    if (!isOwner) {
                        dfail('owner', m, this);
                        return;
                    }
                    if (!m.isGroup) {
                        dfail('group', m, this);
                        return;
                    }

                    if (command === 'bansub') {
                        chat.subbotDisabled = true;
                        this.reply(m.chat, `
╔═════╸━━━╸═════╗
║ ⚜️ *SUB-BOT INACTIVO* ⚜️ 
║ 
║ 🛡️ Este Sub-Bot ha sido *DESHABILITADO* ║    para responder comandos en este grupo.
║    Solo responderá a su creador.
╚═════╸━━━╸═════╝`, m);
                    } else if (command === 'unbansub') {
                        chat.subbotDisabled = false;
                        this.reply(m.chat, `
╔═════╸━━━╸═════╗
║ 🚀 *SUB-BOT ACTIVO* 🚀 
║ 
║ ✅ Este Sub-Bot ha sido *HABILITADO* ║    para responder comandos con normalidad.
╚═════╸━━━╸═════╝`, m);
                    }
                    return;
                }
                
                
                if (command === 'subtest') {
                    this.reply(m.chat, `
┏━━━━━━━◥◣ ◆ ◢◤━━━━━━━┓
┃ ✨ *POTENCIA SUBORDINADA ACTIVA* ✨
┃ 
┃ ⚙️ *Estado:* Operacional y aislado.
┃ 🔑 *Comando único:* *${command}* ejecutado.
┃ 👤 *Usuario:* ${m.name}
┗━━━━━━━◢◤ ◆ ◥◣━━━━━━━┛`, m);
                    return;
                }
                
               
                
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
                    const errorText = format(e).replace(new RegExp(Object.values(global.APIKeys).join('|'), 'g'), 'Administrador');
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

global.dfail = (type, m, conn) => {
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
        conn.reply(m.chat, messages[type], m, rcanal);
    }
};

let file = global.__filename(import.meta.url, true);
watchFile(file, async () => {
    unwatchFile(file);
    console.log(chalk.magenta("Se actualizó 'sub-handler.js' para sub-bots."));
    if (global.conns && global.conns.length > 0) {
        const users = global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED);
        for (const user of users) {
            user.subreloadHandler(false); 
        }
    }
});

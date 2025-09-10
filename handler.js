
/*import { smsg } from './lib/simple.js';
import { format } from 'util';
import { fileURLToPath } from 'url';
import path, { join } from 'path';
import { unwatchFile, watchFile } from 'fs';
import chalk from 'chalk';
import fetch from 'node-fetch';
const { proto } = (await import('@whiskeysockets/baileys')).default;
const isNumber = x => typeof x === 'number' && !isNaN(x);
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
    clearTimeout(this);
    resolve();
}, ms));
const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins');
const prefijosArabes = ['966', '213', '973', '974', '20', '971', '964', '962', '965', '961', '218', '212', '222', '968', '970', '963', '249', '216', '967'];

export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || [];
    this.uptime = this.uptime || Date.now();
    if (!chatUpdate || !chatUpdate.messages || chatUpdate.messages.length === 0) return;
    this.pushMessage(chatUpdate.messages).catch(console.error);

    let m = chatUpdate.messages[chatUpdate.messages.length - 1];
    if (!m) return;

    this.processedMessages = this.processedMessages || new Map();
    const id = m.key.id;
    const now = Date.now();
    const lifeTime = 9000;
    for (let [msgId, time] of this.processedMessages) {
        if (now - time > lifeTime) {
            this.processedMessages.delete(msgId);
        }
    }
    if (this.processedMessages.has(id)) return;
    this.processedMessages.set(id, now);

    if (global.db.data == null) await global.loadDatabase();

    const senderNumber = m.sender?.split('@')[0];
    if (senderNumber) {
        const isArabPrefix = prefijosArabes.some(prefix => senderNumber.startsWith(prefix));
        if (isArabPrefix) {
            await this.updateBlockStatus(m.sender, 'block');
            if (m.isGroup) {
                await this.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
            } else if (m.isPrivate) {
                await this.sendMessage(m.chat, { text: 'Tu número de teléfono está bloqueado y no puedes usar este bot.' });
            }
            return;
        }
    }

    try {
        m = smsg(this, m) || m;
        if (!m) return;

        m.exp = 0;
        m.coin = false;

        try {
            let user = global.db.data.users[m.sender];
            if (typeof user !== 'object') global.db.data.users[m.sender] = {};
            global.db.data.users[m.sender] = {
                exp: user?.exp ?? 0,
                coin: user?.coin ?? 10,
                joincount: user?.joincount ?? 1,
                diamond: user?.diamond ?? 3,
                lastadventure: user?.lastadventure ?? 0,
                lastclaim: user?.lastclaim ?? 0,
                health: user?.health ?? 100,
                crime: user?.crime ?? 0,
                lastcofre: user?.lastcofre ?? 0,
                lastdiamantes: user?.lastdiamantes ?? 0,
                lastpago: user?.lastpago ?? 0,
                lastcode: user?.lastcode ?? 0,
                lastcodereg: user?.lastcodereg ?? 0,
                lastduel: user?.lastduel ?? 0,
                lastmining: user?.lastmining ?? 0,
                muto: user?.muto ?? false,
                premium: user?.premium ?? false,
                premiumTime: user?.premiumTime ?? 0,
                registered: user?.registered ?? false,
                genre: user?.genre ?? '',
                birth: user?.birth ?? '',
                marry: user?.marry ?? '',
                description: user?.description ?? '',
                packstickers: user?.packstickers ?? null,
                name: user?.name ?? m.name,
                age: isNumber(user?.age) ? user.age : -1,
                regTime: isNumber(user?.regTime) ? user.regTime : -1,
                afk: isNumber(user?.afk) ? user.afk : -1,
                afkReason: user?.afkReason ?? '',
                role: user?.role ?? 'Nuv',
                banned: user?.banned ?? false,
                useDocument: user?.useDocument ?? false,
                level: user?.level ?? 0,
                bank: user?.bank ?? 0,
                warn: user?.warn ?? 0,
            };
            let chat = global.db.data.chats[m.chat];
            if (typeof chat !== 'object') global.db.data.chats[m.chat] = {};
            global.db.data.chats[m.chat] = {
                isBanned: chat?.isBanned ?? false,
                sAutoresponder: chat?.sAutoresponder ?? '',
                welcome: chat?.welcome ?? true,
                autolevelup: chat?.autolevelup ?? false,
                autoAceptar: chat?.autoAceptar ?? false,
                autosticker: chat?.autosticker ?? false,
                autoRechazar: chat?.autoRechazar ?? false,
                autoresponder: chat?.autoresponder ?? false,
                autoresponder2: chat?.autoresponder2 ?? false,
                detect: chat?.detect ?? true,
                antiBot: chat?.antiBot ?? false,
                antiBot2: chat?.antiBot2 ?? true,
                modoadmin: chat?.modoadmin ?? false,
                antiLink: chat?.antiLink ?? true,
                reaction: chat?.reaction ?? false,
                nsfw: chat?.nsfw ?? false,
                antifake: chat?.antifake ?? false,
                delete: chat?.delete ?? false,
                expired: isNumber(chat?.expired) ? chat.expired : 0,
                antiLag: chat?.antiLag ?? false,
                per: chat?.per ?? [],
            };
            let settings = global.db.data.settings[this.user.jid];
            if (typeof settings !== 'object') global.db.data.settings[this.user.jid] = {};
            global.db.data.settings[this.user.jid] = {
                self: settings?.self ?? false,
                restrict: settings?.restrict ?? true,
                jadibotmd: settings?.jadibotmd ?? true,
                antiPrivate: settings?.antiPrivate ?? false,
                autoread: settings?.autoread ?? false,
                soloParaJid: settings?.soloParaJid ?? false,
                status: isNumber(settings?.status) ? settings.status : 0,
            };
        } catch (e) {
            console.error(e);
        }

        let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender];
        const conn = this;

        const detectwhat = m.sender.includes('@lid') ? '@lid' : '@s.whatsapp.net';
        const isROwner = [...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender);
        const isOwner = isROwner || m.fromMe;
        const isMods = isROwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender);
        const isPrems = isROwner || global.prems.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender) || _user?.premium;

        if (m.isBaileys) return;
        if (opts.nyimak) return;
        if (!isROwner && opts.self) return;
        if (opts.swonly && m.chat !== 'status@broadcast') return;

        if (opts.queque && m.text && !(isMods || isPrems)) {
            let queque = this.msgqueque, time = 1000 * 5;
            const previousID = queque[queque.length - 1];
            queque.push(m.id || m.key.id);
            setInterval(async function () {
                if (queque.indexOf(previousID) === -1) clearInterval(this);
                await delay(time);
            }, time);
        }

        m.exp += Math.ceil(Math.random() * 10);

        let usedPrefix;
                async function getLidFromJid(id, conn) {
            if (id.endsWith('@lid')) return id;
            const res = await conn.onWhatsApp(id).catch(() => []);
            return res[0]?.lid || id;
        }
        const senderLid = await getLidFromJid(m.sender, conn);
        const botLid = await getLidFromJid(conn.user.jid, conn);
        const senderJid = m.sender;
        const botJid = conn.user.jid;
        const groupMetadata = m.isGroup ? ((conn.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {};
        const participants = m.isGroup ? (groupMetadata.participants || []) : [];
        const user = participants.find(p => p.id === senderLid || p.jid === senderJid) || {};
        const bot = participants.find(p => p.id === botLid || p.id === botJid) || {};
        const isRAdmin = user?.admin === "superadmin";
        const isAdmin = isRAdmin || user?.admin === "admin";
        const isBotAdmin = !!bot?.admin;

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

            if (!opts.restrict && plugin.tags && plugin.tags.includes('admin')) {
                continue;
            }

            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
            let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix;
            let match = (_prefix instanceof RegExp ?
                [[_prefix.exec(m.text), _prefix]] :
                Array.isArray(_prefix) ?
                _prefix.map(p => {
                    let re = p instanceof RegExp ?
                        p :
                        new RegExp(str2Regex(p));
                    return [re.exec(m.text), re];
                }) :
                typeof _prefix === 'string' ?
                [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
                [[[], new RegExp]]
            ).find(p => p[1]);

            if (typeof plugin.before === 'function') {
                if (await plugin.before.call(this, m, {
                    match,
                    conn,
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
                })) continue;
            }

            if (typeof plugin !== 'function') continue;
            if ((usedPrefix = (match?.[0]?.[0] || ''))) {
                let noPrefix = (m.text || '').replace(usedPrefix, '');
                let [command, ...args] = (noPrefix.trim() || '').split` `.filter(v => v);
                let text = args.join` `;
                command = (command || '').toLowerCase();
                let fail = plugin.fail || global.dfail;
                let isAccept = plugin.command instanceof RegExp ?
                    plugin.command.test(command) :
                    Array.isArray(plugin.command) ?
                    plugin.command.some(cmd => cmd instanceof RegExp ?
                        cmd.test(command) :
                        cmd === command) :
                    typeof plugin.command === 'string' ?
                    plugin.command === command :
                    false;

                global.comando = command;

                if (m.id.startsWith('NJX-') || (m.id.startsWith('BAE5') && m.id.length === 16) || (m.id.startsWith('B24E') && m.id.length === 20)) return;

                const settings = global.db.data.settings[this.user.jid];
                if (settings?.soloParaJid && m.sender !== settings.soloParaJid) continue;

                if (!isAccept) continue;
                m.plugin = name;

                let chat = global.db.data.chats[m.chat];
                let _user = global.db.data.users[m.sender];
                let setting = global.db.data.settings[this.user.jid];

                if (chat?.isBanned && !isROwner && !['grupo-unbanchat.js', 'owner-exec.js', 'owner-exec2.js', 'grupo-delete.js'].includes(name)) return;
                if (_user?.banned && !isROwner) {
                    m.reply(`《✦》Estás baneado/a, no puedes usar comandos en este bot!\n\n${_user.bannedReason ? `✰ *Motivo:* ${_user.bannedReason}` : '✰ *Motivo:* Sin Especificar'}\n\n> ✧ Si este Bot es cuenta oficial y tiene evidencia que respalde que este mensaje es un error, puedes exponer tu caso con un moderador.`);
                    return;
                }

                let adminMode = chat?.modoadmin;
                let mini = `${plugin.botAdmin || plugin.admin || plugin.group || noPrefix || usedPrefix || m.text.slice(0, 1) == usedPrefix || plugin.command}`;
                if (adminMode && !isOwner && !isROwner && m.isGroup && !isAdmin && mini) return;
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
                let xp = 'exp' in plugin ? parseInt(plugin.exp) : 10;
                m.exp += xp;
                let extra = {
                    match,
                    usedPrefix,
                    noPrefix,
                    args,
                    command,
                    text,
                    conn,
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
                    if (!isPrems)
                        m.coin = m.coin || plugin.coin || false;
                } catch (e) {
                    m.error = e;
                    console.error(e);
                    if (e) {
                        let text = format(e);
                        for (let key of Object.values(global.APIKeys))
                            text = text.replace(new RegExp(key, 'g'), 'Administrador');
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
                    if (m.coin)
                        conn.reply(m.chat, `❮✦❯ Utilizaste ${+m.coin} ${moneda}`, m);
                }
                break;
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        if (opts.queque && m.text) {
            const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id);
            if (quequeIndex !== -1)
                this.msgqueque.splice(quequeIndex, 1);
        }
        let user, stats = global.db.data.stats;
        if (m) {
            let utente = global.db.data.users[m.sender];
            if (utente?.muto) {
                await conn.sendMessage(m.chat, { delete: m.key });
            }
            if (m.sender && (user = global.db.data.users[m.sender])) {
                user.exp += m.exp;
                user.coin -= m.coin * 1;
            }

            let stat;
            if (m.plugin) {
                let now = +new Date;
                if (m.plugin in stats) {
                    stat = stats[m.plugin];
                    if (!isNumber(stat.total)) stat.total = 1;
                    if (!isNumber(stat.success)) stat.success = m.error != null ? 0 : 1;
                    if (!isNumber(stat.last)) stat.last = now;
                    if (!isNumber(stat.lastSuccess)) stat.lastSuccess = m.error != null ? 0 : now;
                } else {
                    stat = stats[m.plugin] = {
                        total: 1,
                        success: m.error != null ? 0 : 1,
                        last: now,
                        lastSuccess: m.error != null ? 0 : now
                    };
                }
                stat.total += 1;
                stat.last = now;
                if (m.error == null) {
                    stat.success += 1;
                    stat.lastSuccess = now;
                }
            }
        }

        try {
            if (!opts.noprint) await (await import(`./lib/print.js`)).default(m, this);
        } catch (e) {
            console.log(m, m.quoted, e);
        }
        if (opts.autoread) await this.readMessages([m.key]);
    }
}

global.dfail = (type, m, conn) => {
    const msg = {
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
        mods: `
┏━━━━━━━━━━━━━╮
┃ *〘 ${global.comando} 〙*
┃ ➣ 𝑆𝑜𝑙𝑜 𝑝𝑎𝑟𝑎 𝑀𝑜𝑑𝑒𝑟𝑎𝑑𝑒𝑟𝑒𝑠 ↷
┃ » ¿𝐸𝑟𝑒𝑠 𝑢𝑛𝑜? 𝑁𝑜 𝑙𝑜 𝑐𝑟𝑒𝑜...
┗━━━━━━━━━┉━━━╯
`,
        premium: `
┏━━━━━━━━━━━━━╮
┃  *〘 ${global.comando} 〙*
┃ ➣ 𝐿𝑢𝑗𝑜 𝑑𝑒 𝑃𝑟𝑒𝑚𝑖𝑢𝑚 ↷
┃ »ʕ˖͜͡˖ʔ𝑇ú 𝑎𝑢𝑛 𝑛𝑜 𝑒𝑠𝑡á𝑠 𝑎 𝑒𝑠𝑒 𝑛𝑖𝑣𝑒𝑙...
┗━━━━━━━━━━━━━╯`,
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
    }[type];

    if (msg) conn.reply(m.chat, msg, m, fake).then(_ => m.react('✖️'));
};


let file = global.__filename(import.meta.url, true);
watchFile(file, async () => {
    unwatchFile(file);
    console.log(chalk.magenta("Se actualizo 'handler.js'"));

    if (global.conns && global.conns.length > 0 ) {
        const users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])];
        for (const userr of users) {
            userr.subreloadHandler(false);
        }}});*/






import { smsg } from './lib/simple.js';
import { format } from 'util';
import { fileURLToPath } from 'url';
import path, { join } from 'path';
import { unwatchFile, watchFile, readFileSync, writeFileSync } from 'fs';
import chalk from 'chalk';
import fetch from 'node-fetch';
import ws from 'ws'; // Necesario para verificar el estado del socket
const { proto } = (await import('@whiskeysockets/baileys')).default;
const isNumber = x => typeof x === 'number' && !isNaN(x);
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
    clearTimeout(this);
    resolve();
}, ms));
const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins');
const prefijosArabes = ['966', '213', '973', '974', '20', '971', '964', '962', '965', '961', '218', '212', '222', '968', '970', '963', '249', '216', '967'];

const prefixesFilePath = path.join(___dirname, '../prefixes.json');
let prefixesData = {};

try {
    prefixesData = JSON.parse(readFileSync(prefixesFilePath, 'utf-8'));
    if (!prefixesData.default || !prefixesData.bots) {
        throw new Error("Formato de prefixes.json incorrecto. Se creará uno nuevo.");
    }
} catch (e) {
    console.error(chalk.red("No se encontró o el formato de 'prefixes.json' es incorrecto. Creando uno nuevo..."));
    prefixesData = { default: ['.', '!', '/'], bots: {} };
    writeFileSync(prefixesFilePath, JSON.stringify(prefixesData, null, 2));
}

const plugins = new Map();

async function loadPlugins() {
    const pluginsDir = path.join(___dirname, '../plugins');
    const files = await unwatchFile(pluginsDir); // Usamos la misma lógica para evitar errores.
    for (const file of files) {
        if (file.endsWith('.js')) {
            const plugin = require(path.join(pluginsDir, file));
            plugins.set(plugin.name, plugin);
        }
    }
}
loadPlugins();

export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || [];
    this.uptime = this.uptime || Date.now();
    if (!chatUpdate || !chatUpdate.messages || chatUpdate.messages.length === 0) return;
    this.pushMessage(chatUpdate.messages).catch(console.error);

    let m = chatUpdate.messages[chatUpdate.messages.length - 1];
    if (!m) return;

    this.processedMessages = this.processedMessages || new Map();
    const id = m.key.id;
    const now = Date.now();
    const lifeTime = 9000;
    for (let [msgId, time] of this.processedMessages) {
        if (now - time > lifeTime) {
            this.processedMessages.delete(msgId);
        }
    }
    if (this.processedMessages.has(id)) return;
    this.processedMessages.set(id, now);

    if (global.db.data == null) await global.loadDatabase();

    const senderNumber = m.sender?.split('@')[0];
    if (senderNumber) {
        const isArabPrefix = prefijosArabes.some(prefix => senderNumber.startsWith(prefix));
        if (isArabPrefix) {
            await this.updateBlockStatus(m.sender, 'block');
            if (m.isGroup) {
                await this.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
            } else if (m.isPrivate) {
                await this.sendMessage(m.chat, { text: 'Tu número de teléfono está bloqueado y no puedes usar este bot.' });
            }
            return;
        }
    }

    try {
        m = smsg(this, m) || m;
        if (!m) return;

        m.exp = 0;
        m.coin = false;

        try {
            let user = global.db.data.users[m.sender];
            if (typeof user !== 'object') global.db.data.users[m.sender] = {};
            global.db.data.users[m.sender] = {
                exp: user?.exp ?? 0,
                coin: user?.coin ?? 10,
                joincount: user?.joincount ?? 1,
                diamond: user?.diamond ?? 3,
                lastadventure: user?.lastadventure ?? 0,
                lastclaim: user?.lastclaim ?? 0,
                health: user?.health ?? 100,
                crime: user?.crime ?? 0,
                lastcofre: user?.lastcofre ?? 0,
                lastdiamantes: user?.lastdiamantes ?? 0,
                lastpago: user?.lastpago ?? 0,
                lastcode: user?.lastcode ?? 0,
                lastcodereg: user?.lastcodereg ?? 0,
                lastduel: user?.lastduel ?? 0,
                lastmining: user?.lastmining ?? 0,
                muto: user?.muto ?? false,
                premium: user?.premium ?? false,
                premiumTime: user?.premiumTime ?? 0,
                registered: user?.registered ?? false,
                genre: user?.genre ?? '',
                birth: user?.birth ?? '',
                marry: user?.marry ?? '',
                description: user?.description ?? '',
                packstickers: user?.packstickers ?? null,
                name: user?.name ?? m.name,
                age: isNumber(user?.age) ? user.age : -1,
                regTime: isNumber(user?.regTime) ? user.regTime : -1,
                afk: isNumber(user?.afk) ? user.afk : -1,
                afkReason: user?.afkReason ?? '',
                role: user?.role ?? 'Nuv',
                banned: user?.banned ?? false,
                useDocument: user?.useDocument ?? false,
                level: user?.level ?? 0,
                bank: user?.bank ?? 0,
                warn: user?.warn ?? 0,
            };
            let chat = global.db.data.chats[m.chat];
            if (typeof chat !== 'object') global.db.data.chats[m.chat] = {};
            global.db.data.chats[m.chat] = {
                isBanned: chat?.isBanned ?? false,
                sAutoresponder: chat?.sAutoresponder ?? '',
                welcome: chat?.welcome ?? true,
                autolevelup: chat?.autolevelup ?? false,
                autoAceptar: chat?.autoAceptar ?? false,
                autosticker: chat?.autosticker ?? false,
                autoRechazar: chat?.autoRechazar ?? false,
                autoresponder: chat?.autoresponder ?? false,
                autoresponder2: chat?.autoresponder2 ?? false,
                detect: chat?.detect ?? true,
                antiBot: chat?.antiBot ?? false,
                antiBot2: chat?.antiBot2 ?? true,
                modoadmin: chat?.modoadmin ?? false,
                antiLink: chat?.antiLink ?? true,
                reaction: chat?.reaction ?? false,
                nsfw: chat?.nsfw ?? false,
                antifake: chat?.antifake ?? false,
                delete: chat?.delete ?? false,
                expired: isNumber(chat?.expired) ? chat.expired : 0,
                antiLag: chat?.antiLag ?? false,
                per: chat?.per ?? [],
            };
            let settings = global.db.data.settings[this.user.jid];
            if (typeof settings !== 'object') global.db.data.settings[this.user.jid] = {};
            global.db.data.settings[this.user.jid] = {
                self: settings?.self ?? false,
                restrict: settings?.restrict ?? true,
                jadibotmd: settings?.jadibotmd ?? true,
                antiPrivate: settings?.antiPrivate ?? false,
                autoread: settings?.autoread ?? false,
                soloParaJid: settings?.soloParaJid ?? false,
                status: isNumber(settings?.status) ? settings.status : 0,
            };
        } catch (e) {
            console.error(e);
        }

        let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender];
        const conn = this;

        const detectwhat = m.sender.includes('@lid') ? '@lid' : '@s.whatsapp.net';
        const isROwner = [...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender);
        const isOwner = isROwner || m.fromMe;
        const isMods = isROwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender);
        const isPrems = isROwner || global.prems.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender) || _user?.premium;

        if (m.isBaileys) return;
        if (opts.nyimak) return;
        if (!isROwner && opts.self) return;
        if (opts.swonly && m.chat !== 'status@broadcast') return;

        if (opts.queque && m.text && !(isMods || isPrems)) {
            let queque = this.msgqueque, time = 1000 * 5;
            const previousID = queque[queque.length - 1];
            queque.push(m.id || m.key.id);
            setInterval(async function () {
                if (queque.indexOf(previousID) === -1) clearInterval(this);
                await delay(time);
            }, time);
        }

        m.exp += Math.ceil(Math.random() * 10);

        let usedPrefix;
        async function getLidFromJid(id, conn) {
            if (id.endsWith('@lid')) return id;
            const res = await conn.onWhatsApp(id).catch(() => []);
            return res[0]?.lid || id;
        }
        const senderLid = await getLidFromJid(m.sender, conn);
        const botLid = await getLidFromJid(conn.user.jid, conn);
        const senderJid = m.sender;
        const botJid = conn.user.jid;
        const groupMetadata = m.isGroup ? ((conn.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {};
        const participants = m.isGroup ? (groupMetadata.participants || []) : [];
        const user = participants.find(p => p.id === senderLid || p.jid === senderJid) || {};
        const bot = participants.find(p => p.id === botLid || p.id === botJid) || {};
        const isRAdmin = user?.admin === "superadmin";
        const isAdmin = isRAdmin || user?.admin === "admin";
        const isBotAdmin = !!bot?.admin;

        const activeBotJid = this.user.jid;
        const prefixes = prefixesData.bots[activeBotJid] || prefixesData.default;
        
        conn.prefix = prefixes;

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

            if (!opts.restrict && plugin.tags && plugin.tags.includes('admin')) {
                continue;
            }

            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
            // Usar el prefijo dinámico del sub-bot
            let _prefix = plugin.customPrefix ? plugin.customPrefix : prefixes;
            let match = (_prefix instanceof RegExp ?
                [[_prefix.exec(m.text), _prefix]] :
                Array.isArray(_prefix) ?
                _prefix.map(p => {
                    let re = p instanceof RegExp ?
                        p :
                        new RegExp(str2Regex(p));
                    return [re.exec(m.text), re];
                }) :
                typeof _prefix === 'string' ?
                [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
                [[[], new RegExp]]
            ).find(p => p[1]);

            if (typeof plugin.before === 'function') {
                if (await plugin.before.call(this, m, {
                    match,
                    conn,
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
                })) continue;
            }

            if (typeof plugin !== 'function') continue;
            if ((usedPrefix = (match?.[0]?.[0] || ''))) {
                let noPrefix = (m.text || '').replace(usedPrefix, '');
                let [command, ...args] = (noPrefix.trim() || '').split` `.filter(v => v);
                let text = args.join` `;
                command = (command || '').toLowerCase();
                let fail = plugin.fail || global.dfail;
                let isAccept = plugin.command instanceof RegExp ?
                    plugin.command.test(command) :
                    Array.isArray(plugin.command) ?
                    plugin.command.some(cmd => cmd instanceof RegExp ?
                        cmd.test(command) :
                        cmd === command) :
                    typeof plugin.command === 'string' ?
                    plugin.command === command :
                    false;

                global.comando = command;

                if (m.id.startsWith('NJX-') || (m.id.startsWith('BAE5') && m.id.length === 16) || (m.id.startsWith('B24E') && m.id.length === 20)) return;

                const settings = global.db.data.settings[this.user.jid];
                if (settings?.soloParaJid && m.sender !== settings.soloParaJid) continue;

                if (!isAccept) continue;
                m.plugin = name;

                let chat = global.db.data.chats[m.chat];
                let _user = global.db.data.users[m.sender];
                let setting = global.db.data.settings[this.user.jid];

                if (chat?.isBanned && !isROwner && !['grupo-unbanchat.js', 'owner-exec.js', 'owner-exec2.js', 'grupo-delete.js'].includes(name)) return;
                if (_user?.banned && !isROwner) {
                    m.reply(`《✦》Estás baneado/a, no puedes usar comandos en este bot!\n\n${_user.bannedReason ? `✰ *Motivo:* ${_user.bannedReason}` : '✰ *Motivo:* Sin Especificar'}\n\n> ✧ Si este Bot es cuenta oficial y tiene evidencia que respalde que este mensaje es un error, puedes exponer tu caso con un moderador.`);
                    return;
                }

                let adminMode = chat?.modoadmin;
                let mini = `${plugin.botAdmin || plugin.admin || plugin.group || noPrefix || usedPrefix || m.text.slice(0, 1) == usedPrefix || plugin.command}`;
                if (adminMode && !isOwner && !isROwner && m.isGroup && !isAdmin && mini) return;
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
                let xp = 'exp' in plugin ? parseInt(plugin.exp) : 10;
                m.exp += xp;
                let extra = {
                    match,
                    usedPrefix,
                    noPrefix,
                    args,
                    command,
                    text,
                    conn,
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
                    __filename,
                    prefixesData 
                };
                try {
                    await plugin.call(this, m, extra);
                    if (!isPrems)
                        m.coin = m.coin || plugin.coin || false;
                } catch (e) {
                    m.error = e;
                    console.error(e);
                    if (e) {
                        let text = format(e);
                        for (let key of Object.values(global.APIKeys))
                            text = text.replace(new RegExp(key, 'g'), 'Administrador');
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
                    if (m.coin)
                        conn.reply(m.chat, `❮✦❯ Utilizaste ${+m.coin} ${moneda}`, m);
                }
                break;
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        if (opts.queque && m.text) {
            const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id);
            if (quequeIndex !== -1)
                this.msgqueque.splice(quequeIndex, 1);
        }
        let user, stats = global.db.data.stats;
        if (m) {
            let utente = global.db.data.users[m.sender];
            if (utente?.muto) {
                await conn.sendMessage(m.chat, { delete: m.key });
            }
            if (m.sender && (user = global.db.data.users[m.sender])) {
                user.exp += m.exp;
                user.coin -= m.coin * 1;
            }

            let stat;
            if (m.plugin) {
                let now = +new Date;
                if (m.plugin in stats) {
                    stat = stats[m.plugin];
                    if (!isNumber(stat.total)) stat.total = 1;
                    if (!isNumber(stat.success)) stat.success = m.error != null ? 0 : 1;
                    if (!isNumber(stat.last)) stat.last = now;
                    if (!isNumber(stat.lastSuccess)) stat.lastSuccess = m.error != null ? 0 : now;
                } else {
                    stat = stats[m.plugin] = {
                        total: 1,
                        success: m.error != null ? 0 : 1,
                        last: now,
                        lastSuccess: m.error != null ? 0 : now
                    };
                }
                stat.total += 1;
                stat.last = now;
                if (m.error == null) {
                    stat.success += 1;
                    stat.lastSuccess = now;
                }
            }
        }

        try {
            if (!opts.noprint) await (await import(`./lib/print.js`)).default(m, this);
        } catch (e) {
            console.log(m, m.quoted, e);
        }
        if (opts.autoread) await this.readMessages([m.key]);
    }
}

global.dfail = (type, m, conn) => {
    const msg = {
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
        mods: `
┏━━━━━━━━━━━━━╮
┃ *〘 ${global.comando} 〙*
┃ ➣ 𝑆𝑜𝑙𝑜 𝑝𝑎𝑟𝑎 𝑀𝑜𝑑𝑒𝑟𝑎𝑑𝑒𝑟𝑒𝑠 ↷
┃ » ¿𝐸𝑟𝑒𝑠 𝑢𝑛𝑜? 𝑁𝑜 𝑙𝑜 𝑐𝑟𝑒𝑜...
┗━━━━━━━━━┉━━━╯
`,
        premium: `
┏━━━━━━━━━━━━━╮
┃  *〘 ${global.comando} 〙*
┃ ➣ 𝐿𝑢𝑗𝑜 𝑑𝑒 𝑃𝑟𝑒𝑚𝑖𝑢𝑚 ↷
┃ »ʕ˖͜͡˖ʔ𝑇ú 𝑎𝑢𝑛 𝑛𝑜 𝑒𝑠𝑡á𝑠 𝑎 𝑒𝑠𝑒 𝑛𝑖𝑣𝑒𝑙...
┗━━━━━━━━━━━━━╯`,
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
    }[type];

    if (msg) conn.reply(m.chat, msg, m, fake).then(_ => m.react('✖️'));
};


let file = global.__filename(import.meta.url, true);
watchFile(file, async () => {
    unwatchFile(file);
    console.log(chalk.magenta("Se actualizo 'handler.js'"));

    if (global.conns && global.conns.length > 0 ) {
        const users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])];
        for (const userr of users) {
            userr.subreloadHandler(false);
        }}});

import { smsg } from './lib/simple.js';
import { format } from 'util';
import path, { join } from 'path';
import { unwatchFile, watchFile } from 'fs';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import ws from 'ws';

const { proto } = (await import('@whiskeysockets/baileys')).default;
const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins');
const lifeTime = 9000;
const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
const isNumber = x => typeof x === 'number' && !isNaN(x);
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(resolve, ms));

const jidCache = new Map();
let errorNotified = false;
const processedMessages = new Set();
const messageQueue = [];
let isProcessingQueue = false;

async function getJidType(id, conn) {
    if (jidCache.has(id)) return jidCache.get(id);

    try {
        const res = await conn.onWhatsApp(id).catch(() => []);
        const jidType = res[0]?.lid ? '@lid' : '@s.whatsapp.net';
        jidCache.set(id, jidType);
        return jidType;
    } catch (e) {
        return '@s.whatsapp.net';
    }
}

async function getLidFromJid(id, conn) {
    if (id.endsWith('@lid')) return id;
    const res = await conn.onWhatsApp(id).catch(() => []);
    return res[0]?.lid || id;
}

export async function handler(chatUpdate) {
    this.uptime = this.uptime || Date.now();

    if (!chatUpdate || !chatUpdate.messages || chatUpdate.messages.length === 0) return;

    let m = chatUpdate.messages[chatUpdate.messages.length - 1];
    if (!m) return;

    if (processedMessages.has(m.key.id)) return;
    processedMessages.add(m.key.id);
    setTimeout(() => processedMessages.delete(m.key.id), lifeTime);

    messageQueue.push({ conn: this, m });
    if (!isProcessingQueue) processQueue();
}

async function processQueue() {
    isProcessingQueue = true;
    while (messageQueue.length > 0) {
        const { conn, m: chatMessage } = messageQueue.shift();
        
        try {
            await handleMessage(conn, chatMessage);
        } catch (e) {
            console.error('Error procesando mensaje en cola:', e);
        }
    }
    isProcessingQueue = false;
}

async function handleMessage(conn, chatMessage) {
    let m = smsg(conn, chatMessage) || chatMessage;
    if (!m) return;

    if (!m.isGroup && m.fromMe) return;

    try {
        if (global.db.data === null) await global.loadDatabase();

        conn.readMessages([m.key]);

        const senderJid = m.sender;
        const chatJid = m.chat;
        const settingsJid = conn.user.jid;

        if (!global.db.data.users[senderJid]) {
            global.db.data.users[senderJid] = {
                exp: 0, coin: 10, joincount: 1, diamond: 3, lastadventure: 0, health: 100, lastclaim: 0, lastcofre: 0, lastdiamantes: 0, lastcode: 0, lastduel: 0, lastpago: 0, lastmining: 0, lastcodereg: 0, muto: false, registered: false, genre: '', birth: '', marry: '', description: '', packstickers: null, name: m.name, age: -1, regTime: -1, afk: -1, afkReason: '', banned: false, useDocument: false, bank: 0, level: 0, role: 'Nuv', premium: false, premiumTime: 0,
            };
        }

        if (!global.db.data.chats[chatJid]) {
            global.db.data.chats[chatJid] = {
                isBanned: false, sAutoresponder: '', welcome: true, autolevelup: false, autoresponder: false, delete: false, autoAceptar: false, autoRechazar: false, detect: true, antiBot: false, modoadmin: false, antiLink: true, nsfw: false, expired: 0, autoresponder2: false, per: [],
            };
        }

        if (!global.db.data.settings[settingsJid]) {
            global.db.data.settings[settingsJid] = {
                self: false, restrict: true, jadibotmd: true, antiPrivate: false, autoread: false, soloParaJid: false, status: 0
            };
        }

        const user = global.db.data.users[senderJid];
        const chat = global.db.data.chats[chatJid];
        const settings = global.db.data.settings[settingsJid];

        const jidType = await getJidType(senderJid, conn);
        const isROwner = global.owner.map(([number]) => number.replace(/[^0-9]/g, '') + jidType).includes(senderJid);
        const isOwner = isROwner || m.fromMe;

        if (m.isBaileys || opts['nyimak'] || (!isOwner && opts['self']) || (opts['swonly'] && m.chat !== 'status@broadcast')) return;
        if (typeof m.text !== 'string') m.text = '';

        let groupMetadata = m.isGroup ? conn.chats[m.chat]?.metadata || await conn.groupMetadata(m.chat).catch(_ => null) : {};
        let participants = m.isGroup ? (groupMetadata.participants || []) : [];
        let botJid = conn.user.jid;
        let botLid = await getLidFromJid(botJid, conn);
        let senderLid = await getLidFromJid(senderJid, conn);

        const user2 = participants.find(p => p.id === senderLid || p.jid === senderJid) || {};
        const bot = participants.find(p => p.id === botLid || p.id === botJid) || {};

        const isRAdmin = user2?.admin === 'superadmin';
        const isAdmin = isRAdmin || user2?.admin === 'admin';
        const isBotAdmin = !!bot?.admin;

        for (let name in global.plugins) {
            let plugin = global.plugins[name];
            if (!plugin || plugin.disabled) continue;

            const __filename = join(___dirname, name);

            if (typeof plugin.all === 'function') {
                try {
                    plugin.all.call(conn, m, { __dirname: ___dirname, __filename });
                } catch (e) {
                    console.error(`Error en plugin.all (${name}):`, e);
                }
            }

            if (!opts['restrict'] && plugin.tags && plugin.tags.includes('admin')) continue;

            let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix;
            
            const match = (_prefix instanceof RegExp ?
                [[_prefix.exec(m.text), _prefix]] :
                Array.isArray(_prefix) ?
                _prefix.map(p => {
                    const re = p instanceof RegExp ? p : new RegExp(str2Regex(p));
                    return [re.exec(m.text), re];
                }) :
                typeof _prefix === 'string' ?
                [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
                [[null, null]]
            ).find(p => p[0]);
            
            if (typeof plugin.before === 'function') {
                if (await plugin.before.call(conn, m, { match, conn, participants, groupMetadata, user, isROwner, isOwner, isRAdmin, isAdmin, isBotAdmin, __dirname: ___dirname, __filename })) continue;
            }
            
            if (typeof plugin !== 'function' || !match || !match[0]) continue;

            const usedPrefix = match[0][0];
            const noPrefix = m.text.replace(usedPrefix, '').trim();
            let [command, ...args] = noPrefix.split(/\s+/).filter(v => v);
            const text = args.join(' ');
            command = (command || '').toLowerCase();
            
            const fail = plugin.fail || global.dfail;
            
            const isAccept = plugin.command instanceof RegExp ? 
                plugin.command.test(command) :
                Array.isArray(plugin.command) ?
                plugin.command.some(cmd => cmd instanceof RegExp ? cmd.test(command) : cmd === command) :
                typeof plugin.command === 'string' ? 
                plugin.command === command :
                false;

            if (!isAccept) continue;
            
            global.comando = command;

            if (chat?.isBanned && !isROwner) return;
            if (chat?.modoadmin && !isOwner && !isROwner && m.isGroup && !isAdmin) return;
            if (settings.soloParaJid && m.sender !== settings.soloParaJid) return;

            const chatID = m.chat;
            const ID_GRUPO_RESTRINGIDO = '120363421094353744@g.us';
            const comandosPermitidos = new Set(['code', 'qr', 'welcome', 'detect', 'kick', 'tag']);

            if (chatID === ID_GRUPO_RESTRINGIDO && !comandosPermitidos.has(command)) return;

            const permissions = {
                rowner: isROwner,
                owner: isOwner,
                group: m.isGroup,
                botAdmin: isBotAdmin,
                admin: isAdmin,
                private: !m.isGroup,
                restrict: !opts['restrict']
            };

            const requiredPerms = ['rowner', 'owner', 'mods', 'premium', 'group', 'botAdmin', 'admin', 'private', 'restrict'];
            for (const perm of requiredPerms) {
                if (plugin[perm] && !permissions[perm]) {
                    fail(perm, m, conn);
                    return;
                }
            }

            m.plugin = name;
            m.isCommand = true;
            m.exp = 'exp' in plugin ? parseInt(plugin.exp) : 10;
            
            const extra = {
                match, usedPrefix, noPrefix, args, command, text, conn, participants, groupMetadata, user, isROwner, isOwner, isRAdmin, isAdmin, isBotAdmin, __dirname: ___dirname, __filename
            };

            try {
                await plugin.call(conn, m, extra);
            } catch (e) {
                m.error = e;
                const errorText = format(e).replace(new RegExp(Object.values(global.APIKeys || {}).join('|'), 'g'), 'Administrador');
                
                if (isOwner && !errorNotified) {
                    const ownerNumber = global.owner[0][0].replace(/[^0-9]/g, '') + jidType;
                    conn.reply(ownerNumber, `🚩 *ERROR EN EJECUCIÓN DEL PLUGIN* 🚩\n\n*Comando:* ${usedPrefix}${command}\n*Chat:* ${m.chat}\n*Mensaje:* ${m.text}\n\n*Detalles del Error (Para el Creador):*\n${errorText.substring(0, 1500)}`, null);
                    errorNotified = true;
                    setTimeout(() => { errorNotified = false; }, 60000); 
                }
                
                conn.reply(m.chat, `⚠️ *Ocurrió un error inesperado al ejecutar el comando.*`, m);
            } finally {
                if (typeof plugin.after === 'function') {
                    try {
                        await plugin.after.call(conn, m, extra);
                    } catch (e) {
                        console.error(`Error en plugin.after (${name}):`, e);
                    }
                }
            }
            break;
        }

    } catch (e) {
        if (!errorNotified) {
            const errorText = format(e).replace(new RegExp(Object.values(global.APIKeys || {}).join('|'), 'g'), 'Administrador');
            const ownerNumber = global.owner[0][0].replace(/[^0-9]/g, '') + await getJidType(conn.user.jid, conn);
            conn.reply(ownerNumber, `🚨 *ERROR GENERAL EN EL HANDLER (FUERA DE PLUGIN)* 🚨\n\n*Detalles del Error (Para el Creador):*\n${errorText.substring(0, 1500)}`, null);
            errorNotified = true;
            setTimeout(() => { errorNotified = false; }, 60000);
        }
        console.error('Error general en el Handler:', e);
    } finally {
        if (m && m.sender && global.db.data.users[m.sender]) {
            const user = global.db.data.users[m.sender];
            if (user.muto) await conn.sendMessage(m.chat, { delete: m.key });

            if (m.exp) user.exp += m.exp;
            if (m.coin) user.coin -= m.coin * 1;
        }

        if (m && m.plugin) {
            const stats = global.db.data.stats = global.db.data.stats || {};
            const now = Date.now();
            const stat = stats[m.plugin] = stats[m.plugin] || { total: 0, success: 0, last: 0, lastSuccess: 0 };
            
            stat.total += 1;
            stat.last = now;
            if (!m.error) {
                stat.success += 1;
                stat.lastSuccess = now;
            }
        }
    }
}

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
    if (messages[type]) conn.reply(m.chat, messages[type], m);
};

let file = global.__filename(import.meta.url, true);
watchFile(file, () => {
    unwatchFile(file);
    console.log(chalk.magenta("Se actualizo 'handler.js'"));
    if (global.conns && global.conns.length > 0) {
        const users = global.conns.filter(conn => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED);
        for (const user of users) {
            user.subreloadHandler(false);
        }
    }
});

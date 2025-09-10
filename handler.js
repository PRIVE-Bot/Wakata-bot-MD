import { smsg } from './lib/simple.js';
import { format } from 'util';
import { fileURLToPath } from 'url';
import path, { join } from 'path';
import { unwatchFile, watchFile } from 'fs';
import chalk from 'chalk';
import fetch from 'node-fetch';
const { proto } = (await import('@whiskeysockets/baileys')).default;
const isNumber = (x) => typeof x === 'number' && !isNaN(x);
const delay = (ms) => isNumber(ms) && new Promise((resolve) => setTimeout(function () {
    clearTimeout(this);
    resolve();
}, ms));
const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins');

const prefijosArabes = [
    '966', '213', '973', '974', '20', '971', '964', '962', '965', '961', '218', 
    '212', '222', '968', '970', '963', '249', '216', '967'
];

// Usamos un Set para una búsqueda de prefijos más rápida (O(1) en lugar de O(n)).
const prefijosArabesSet = new Set(prefijosArabes);

export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || [];
    this.uptime = this.uptime || Date.now();
    if (!chatUpdate || !chatUpdate.messages || chatUpdate.messages.length === 0) return;
    this.pushMessage(chatUpdate.messages).catch(console.error);

    const m = chatUpdate.messages[chatUpdate.messages.length - 1];
    if (!m) return;

    this.processedMessages = this.processedMessages || new Map();
    const id = m.key.id;
    const now = Date.now();
    const lifeTime = 9000;

    // Limpiamos mensajes procesados de forma más eficiente.
    const keysToDelete = [];
    for (const [msgId, time] of this.processedMessages) {
        if (now - time > lifeTime) {
            keysToDelete.push(msgId);
        }
    }
    for (const key of keysToDelete) {
        this.processedMessages.delete(key);
    }

    if (this.processedMessages.has(id)) return;
    this.processedMessages.set(id, now);

    if (global.db.data == null) await global.loadDatabase();

    const senderNumber = m.sender?.split('@')[0];
    if (senderNumber) {
        // Mejoramos la lógica para chequear los prefijos de forma más eficiente.
        const isArabPrefix = prefijosArabesSet.has(senderNumber.substring(0, 3));
        if (isArabPrefix) {
            try {
                await this.updateBlockStatus(m.sender, 'block');
                if (m.isGroup) {
                    await this.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
                } else if (m.isPrivate) {
                    await this.sendMessage(m.chat, { text: 'Tu número de teléfono está bloqueado y no puedes usar este bot.' });
                }
            } catch (e) {
                console.error('Error al manejar el prefijo árabe:', e);
            }
            return;
        }
    }

    try {
        const conn = this;
        let _user = global.db.data?.users?.[m.sender];

        // Inicializamos los datos del usuario y del chat solo si no existen.
        if (!_user) {
            _user = {
                exp: 0,
                coin: 10,
                joincount: 1,
                diamond: 3,
                lastadventure: 0,
                lastclaim: 0,
                health: 100,
                crime: 0,
                lastcofre: 0,
                lastdiamantes: 0,
                lastpago: 0,
                lastcode: 0,
                lastcodereg: 0,
                lastduel: 0,
                lastmining: 0,
                muto: false,
                premium: false,
                premiumTime: 0,
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
                role: 'Nuv',
                banned: false,
                useDocument: false,
                level: 0,
                bank: 0,
                warn: 0,
            };
            global.db.data.users[m.sender] = _user;
        }

        let chat = global.db.data?.chats?.[m.chat];
        if (!chat) {
            chat = {
                isBanned: false,
                sAutoresponder: '',
                welcome: true,
                autolevelup: false,
                autoAceptar: false,
                autosticker: false,
                autoRechazar: false,
                autoresponder: false,
                autoresponder2: false,
                detect: true,
                antiBot: false,
                antiBot2: true,
                modoadmin: false,
                antiLink: true,
                reaction: false,
                nsfw: false,
                antifake: false,
                delete: false,
                expired: 0,
                antiLag: false,
                per: [],
            };
            global.db.data.chats[m.chat] = chat;
        }

        let settings = global.db.data?.settings?.[conn.user.jid];
        if (!settings) {
            settings = {
                self: false,
                restrict: true,
                jadibotmd: true,
                antiPrivate: false,
                autoread: false,
                soloParaJid: false,
                status: 0,
            };
            global.db.data.settings[conn.user.jid] = settings;
        }

        m = smsg(conn, m) || m;
        if (!m) return;

        m.exp = m.exp || 0;
        m.coin = m.coin || false;

        const isROwner = [...global.owner.map(([number]) => number)].map((v) => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender);
        const isOwner = isROwner || m.fromMe;
        const isMods = isROwner || global.mods.map((v) => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender);
        const isPrems = isROwner || global.prems.map((v) => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender) || _user?.premium;

        if (m.isBaileys) return;
        if (opts.nyimak) return;
        if (!isROwner && opts.self) return;
        if (opts.swonly && m.chat !== 'status@broadcast') return;

        if (opts.queque && m.text && !(isMods || isPrems)) {
            let queque = this.msgqueque;
            const previousID = queque[queque.length - 1];
            queque.push(m.id || m.key.id);
            setInterval(async function () {
                if (queque.indexOf(previousID) === -1) clearInterval(this);
                await delay(5000);
            }, 5000);
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
        const groupMetadata = m.isGroup ? ((conn.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(() => null)) : {};
        const participants = m.isGroup ? (groupMetadata.participants || []) : [];
        const user = participants.find((p) => p.id === senderLid || p.jid === m.sender) || {};
        const bot = participants.find((p) => p.id === botLid || p.id === conn.user.jid) || {};
        const isRAdmin = user?.admin === 'superadmin';
        const isAdmin = isRAdmin || user?.admin === 'admin';
        const isBotAdmin = !!bot?.admin;

        for (const name in global.plugins) {
            const plugin = global.plugins[name];
            if (!plugin || plugin.disabled) continue;

            const __filename = join(___dirname, name);
            if (typeof plugin.all === 'function') {
                try {
                    await plugin.all.call(conn, m, { chatUpdate, __dirname: ___dirname, __filename });
                } catch (e) {
                    console.error(e);
                }
            }

            if (!opts.restrict && plugin.tags && plugin.tags.includes('admin')) {
                continue;
            }

            const str2Regex = (str) => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
            let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix;
            let match = (_prefix instanceof RegExp ?
                [[_prefix.exec(m.text), _prefix]] :
                Array.isArray(_prefix) ?
                _prefix.map((p) => {
                    let re = p instanceof RegExp ? p : new RegExp(str2Regex(p));
                    return [re.exec(m.text), re];
                }) :
                typeof _prefix === 'string' ?
                [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
                [[[], new RegExp]]
            ).find((p) => p[1]);

            if (typeof plugin.before === 'function') {
                if (
                    await plugin.before.call(conn, m, {
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
                        __filename,
                    })
                )
                    continue;
            }

            if (typeof plugin !== 'function') continue;
            if ((usedPrefix = match?.[0]?.[0] || '')) {
                let noPrefix = (m.text || '').replace(usedPrefix, '');
                let [command, ...args] = (noPrefix.trim() || '').split(' ').filter((v) => v);
                let text = args.join(' ');
                command = (command || '').toLowerCase();
                let fail = plugin.fail || global.dfail;
                let isAccept = plugin.command instanceof RegExp ?
                    plugin.command.test(command) :
                    Array.isArray(plugin.command) ?
                    plugin.command.some((cmd) => (cmd instanceof RegExp ? cmd.test(command) : cmd === command)) :
                    typeof plugin.command === 'string' ?
                    plugin.command === command :
                    false;

                global.comando = command;

                if (m.id.startsWith('NJX-') || (m.id.startsWith('BAE5') && m.id.length === 16) || (m.id.startsWith('B24E') && m.id.length === 20)) return;

                const settings = global.db.data.settings[conn.user.jid];
                if (settings?.soloParaJid && m.sender !== settings.soloParaJid) continue;

                if (!isAccept) continue;
                m.plugin = name;

                if (chat?.isBanned && !isROwner && !['grupo-unbanchat.js', 'owner-exec.js', 'owner-exec2.js', 'grupo-delete.js'].includes(name)) return;
                if (_user?.banned && !isROwner) {
                    m.reply(`《✦》Estás baneado/a, no puedes usar comandos en este bot!\n\n${_user.bannedReason ? `✰ *Motivo:* ${_user.bannedReason}` : '✰ *Motivo:* Sin Especificar'}\n\n> ✧ Si este Bot es cuenta oficial y tiene evidencia que respalde que este mensaje es un error, puedes exponer tu caso con un moderador.`);
                    return;
                }

                let adminMode = chat?.modoadmin;
                let mini = `${plugin.botAdmin || plugin.admin || plugin.group || noPrefix || usedPrefix || m.text.slice(0, 1) === usedPrefix || plugin.command}`;
                if (adminMode && !isOwner && !isROwner && m.isGroup && !isAdmin && mini) return;

                if (plugin.rowner && !isROwner) {
                    fail('rowner', m, conn);
                    continue;
                }
                if (plugin.owner && !isOwner) {
                    fail('owner', m, conn);
                    continue;
                }
                if (plugin.mods && !isMods) {
                    fail('mods', m, conn);
                    continue;
                }
                if (plugin.premium && !isPrems) {
                    fail('premium', m, conn);
                    continue;
                }
                if (plugin.group && !m.isGroup) {
                    fail('group', m, conn);
                    continue;
                } else if (plugin.botAdmin && !isBotAdmin) {
                    fail('botAdmin', m, conn);
                    continue;
                } else if (plugin.admin && !isAdmin) {
                    fail('admin', m, conn);
                    continue;
                }
                if (plugin.private && m.isGroup) {
                    fail('private', m, conn);
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
                };
                try {
                    await plugin.call(conn, m, extra);
                    if (!isPrems) m.coin = m.coin || plugin.coin || false;
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
                            await plugin.after.call(conn, m, extra);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                    if (m.coin) conn.reply(m.chat, `❮✦❯ Utilizaste ${+m.coin} ${moneda}`, m);
                }
                break;
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        if (opts.queque && m.text) {
            const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id);
            if (quequeIndex !== -1) this.msgqueque.splice(quequeIndex, 1);
        }
        let user,
            stats = global.db.data.stats;
        if (m) {
            let utente = global.db.data.users[m.sender];
            if (utente?.muto) {
                await conn.sendMessage(m.chat, { delete: m.key });
            }
            if (m.sender && (user = global.db.data.users[m.sender])) {
                user.exp += m.exp;
                user.coin -= m.coin * 1;
            }

            if (m.plugin) {
                let now = +new Date();
                let stat = stats[m.plugin] || (stats[m.plugin] = {
                    total: 0,
                    success: 0,
                    last: 0,
                    lastSuccess: 0,
                });
                stat.total += 1;
                stat.last = now;
                if (m.error == null) {
                    stat.success += 1;
                    stat.lastSuccess = now;
                }
            }
        }

        try {
            if (!opts.noprint) await (await import(`./lib/print.js`)).default(m, conn);
        } catch (e) {
            console.log(m, m.quoted, e);
        }
        if (opts.autoread) await conn.readMessages([m.key]);
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

    if (msg) conn.reply(m.chat, msg, m, fake).then((_) => m.react('✖️'));
};

let file = global.__filename(import.meta.url, true);
watchFile(file, async () => {
    unwatchFile(file);
    console.log(chalk.magenta("Se actualizo 'handler.js'"));
    if (global.conns && global.conns.length > 0) {
        const users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])];
        for (const userr of users) {
            userr.subreloadHandler(false);
        }
    }
});

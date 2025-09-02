import { smsg } from './lib/simple.js'
import { format } from 'util'
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile } from 'fs'
import ws from 'ws' 
import chalk from 'chalk'

const { proto } = (await import('@whiskeysockets/baileys')).default
const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
    clearTimeout(this)
    resolve()
}, ms))

export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || []
    if (!chatUpdate)
        return
    this.pushMessage(chatUpdate.messages).catch(console.error)
    let m = chatUpdate.messages[chatUpdate.messages.length - 1]
    if (!m)
        return
    if (global.db.data == null)
        await global.loadDatabase()
    try {
        m = smsg(this, m) || m
        if (!m)
            return
        m.exp = 0
        m.estrellas = false
        try {
            global.db.data.users[m.sender] = global.db.data.users[m.sender] || {}
let user = global.db.data.users[m.sender]
if (typeof user !== 'object') {
    user = global.db.data.users[m.sender] = {
        exp: 0,
        estrellas: 10,
        coin: 50,
        lastmiming: 0,
        lastclaim: 0,
        registered: false,
        name: m.name,
        age: -1,
        regTime: -1,
        afk: -1,
        afkReason: '',
        banned: false,
        warn: 0,
        level: 0,
        role: 'Novato',
        autolevelup: false,
        chatbot: false,
    }
}
            let chat = global.db.data.chats[m.chat]
            if (typeof chat !== 'object')
                global.db.data.chats[m.chat] = {}
            if (chat) {
                if (!('isBanned' in chat))
                    chat.isBanned = false
                if (!('welcome' in chat))
                    chat.welcome = false
                if (!('detect' in chat))
                    chat.detect = false
                if (!('sWelcome' in chat))
                    chat.sWelcome = ''
                if (!('sBye' in chat))
                    chat.sBye = ''
                if (!('sPromote' in chat))
                    chat.sPromote = ''
                if (!('sDemote' in chat))
                    chat.sDemote = ''
                if (!('delete' in chat))
                    chat.delete = true
                if (!('antiLink' in chat))
                    chat.antiLink = false
                if (!('viewonce' in chat))
                    chat.viewonce = false
                if (!('autoresponder' in chat))
chat.autoresponder = false
                if (!('onlyLatinos' in chat))
                    chat.onlyLatinos = false
                 if (!('nsfw' in chat))
                     chat.nsfw = false
                 if (!('antiLag' in chat))
                    chat.antiLag = false
                if (!('allantilink' in chat))
                    chat.allantilink = false
                if (!('per' in chat))
                    chat.per = []
                if (!isNumber(chat.expired))
                    chat.expired = 0
            } else
                global.db.data.chats[m.chat] = {
                    isBanned: false,
                    antiLag: false,
                    per: [],
                    welcome: false,
                    detect: false,
                    sWelcome: '',
                    sBye: '',
                    sPromote: '',
                    sDemote: '',
                    delete: true,
                    autoresponder: false,
                    antiLink: false,
                    viewonce: false,
                    useDocument: true,
                    onlyLatinos: false,
                    nsfw: false, 
                    allantilink: false,
                    expired: 0,
                }
            let settings = global.db.data.settings[this.user.jid]
            if (typeof settings !== 'object') global.db.data.settings[this.user.jid] = {}
            if (settings) {
                if (!('self' in settings)) settings.self = false
                if (!('autoread' in settings)) settings.autoread = false
                if (!('restrict' in settings)) settings.restrict = false
                if (!('actives' in settings)) settings.actives = []
                if (!('status' in settings)) settings.status = 0
                if (!('noprefix' in settings)) settings.noprefix = false
                if (!('logo' in settings)) settings.logo = null
            } else global.db.data.settings[this.user.jid] = {
                self: false,
                autoread: false,
                restrict: false, 
                actives: [],
                status: 0,
                noprefix: false,
                logo: "",
            }
        } catch (e) {
            console.error(e)
        }
        /*
let isActive = global.db.data.settings[this.user.jid].actives.includes(m.sender)
       if (!m.fromMe && !isActive)
           return
           */
const mainBot = global.conn.user.jid
const chat = global.db.data.chats[m.chat] || {}
const isSubbs = chat.antiLag === true
const allowedBots = chat.per || []
if (!allowedBots.includes(mainBot)) allowedBots.push(mainBot)
const isAllowed = allowedBots.includes(this.user.jid)
       if (isSubbs && !isAllowed) 
            return
        if (opts['nyimak'])
            return
        if (m.isBaileys) 
            return
        if (!m.fromMe && opts['self'])
            return
        if (opts['pconly'] && m.chat.endsWith('g.us'))
            return
        if (opts['gconly'] && !m.chat.endsWith('g.us'))
            return
        if (opts['swonly'] && m.chat !== 'status@broadcast')
            return
        if (typeof m.text !== 'string')
            m.text = ''

        const sendNum = m.sender.replace(/[^0-9]/g, '')
const isROwner = [conn.decodeJid(global.conn.user.id), ...global.owner.map(([number]) => number)]
  .map(v => v.replace(/[^0-9]/g, ''))
  .includes(sendNum || m.key.remoteJid)

const isPremSubs = global.db.data.users[m.sender]?.token === true && global.conns
.map(c => conn.decodeJid(c.user?.id || ''))
.map(v => v.replace(/[^0-9]/g, ''))
.includes((sendNum || m.sender || '').replace(/[^0-9]/g, ''));

        const isOwner = isROwner      
        const isMods = isOwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
        const isPrems = isROwner || global.prems.map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)

        if (opts['queque'] && m.text && !(isMods || isPrems)) {
            let queque = this.msgqueque, time = 1000 * 5
            const previousID = queque[queque.length - 1]
            queque.push(m.id || m.key.id)
            setInterval(async function () {
                if (queque.indexOf(previousID) === -1) clearInterval(this)
                await delay(time)
            }, time)
        }

        if (m.isBaileys)
            return
        m.exp += Math.ceil(Math.random() * 10)
        let usedPrefix
        let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]

// Fix isRAdmin y isBotAdmin >> Destroy y WillZek 
async function getLidFromJid(id, conn) {
if (id.endsWith('@lid')) return id
const res = await conn.onWhatsApp(id).catch(() => [])
return res[0]?.lid || id
}
const senderLid = await getLidFromJid(m.sender, conn)
const botLid = await getLidFromJid(conn.user.jid, conn)
const senderJid = m.sender
const botJid = conn.user.jid
const groupMetadata = m.isGroup ? ((conn.chats[m.chat] || {}).metadata || await this.groupMetadata(m.chat).catch(_ => null)) : {}
const participants = m.isGroup ? (groupMetadata.participants || []) : []
const user = participants.find(p => p.lid === senderLid || p.id === senderJid) || {}
const bot = participants.find(p => p.id === botLid || p.id === botJid) || {}
const isRAdmin = user?.admin === "superadmin"
const isAdmin = isRAdmin || user?.admin === "admin"
const isBotAdmin = !!bot?.admin

        const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')
        for (let name in global.plugins) {
            let plugin = global.plugins[name]
            if (!plugin)
                continue
            if (plugin.disabled)
                continue
            const __filename = join(___dirname, name)
            if (typeof plugin.all === 'function') {
                try {
                    await plugin.all.call(this, m, {
                        chatUpdate,
                        __dirname: ___dirname,
                        __filename
                    })
                } catch (e) {
                    // if (typeof e === 'string') continue
                    console.error(e)
                }
            }
            if (!opts['restrict'])
                if (plugin.tags && plugin.tags.includes('admin')) {
                    // global.dfail('restrict', m, this)
                    continue
                }
            const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
            let _prefix = plugin.customPrefix ? plugin.customPrefix : global.db.data.settings[this?.user?.jid].noprefix ? "" : conn.prefix ? conn.prefix : global.prefix
            let match = (_prefix instanceof RegExp ? // RegExp Mode?
                [[_prefix.exec(m.text), _prefix]] :
                Array.isArray(_prefix) ? // Array?
                    _prefix.map(p => {
                        let re = p instanceof RegExp ? // RegExp in Array?
                            p :
                            new RegExp(str2Regex(p))
                        return [re.exec(m.text), re]
                    }) :
                    typeof _prefix === 'string' ? // String?
                        [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
                        [[[], new RegExp]]
            ).find(p => p[1])
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
                }))
                    continue
            }
            if (typeof plugin !== 'function')
                continue
        if ((usedPrefix = (match && match[0]) || (global.db.data.settings[this.user.jid].noprefix && ''))) {
                let noPrefix = m.text.replace(usedPrefix, '')
                let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
                args = args || []
                let _args = noPrefix.trim().split` `.slice(1)
                let text = _args.join` `
                command = (command || '').toLowerCase()
                let fail = plugin.fail || global.dfail // When failed
                let isAccept = plugin.command instanceof RegExp ? // RegExp Mode?
                    plugin.command.test(command) :
                    Array.isArray(plugin.command) ? // Array?
                        plugin.command.some(cmd => cmd instanceof RegExp ? // RegExp in Array?
                            cmd.test(command) :
                            cmd === command
                        ) :
                        typeof plugin.command === 'string' ? // String?
                            plugin.command === command :
                            false

                if (!isAccept)
                    continue
                m.plugin = name
                if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
                    let chat = global.db.data.chats[m.chat]
                    let user = global.db.data.users[m.sender]
                    if (name != 'owner-unbanchat.js' && chat?.isBanned)
                        return // Except this
                    if (name != 'owner-unbanuser.js' && user?.banned)
                        return
                }
                if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { // Both Owner
                    fail('owner', m, this)
                    continue
                }
                if (plugin.rowner && !isROwner) { // Real Owner
                    fail('rowner', m, this)
                    continue
                }
                if (plugin.owner && !isOwner) { // Number Owner
                    fail('owner', m, this)
                    continue
                }
                if (plugin.premsub && !isPremSubs) { // Premium Subbots
                    fail('premsubs', m, this)
                    continue
                }
                if (plugin.mods && !isMods) { // Moderator
                    fail('mods', m, this)
                    continue
                }
                if (plugin.premium && !isPrems) { // Premium
                    fail('premium', m, this)
                    continue
                }
                if (plugin.group && !m.isGroup) { // Group Only
                    fail('group', m, this)
                    continue
                } else if (plugin.botAdmin && !isBotAdmin) { // You Admin
                    fail('botAdmin', m, this)
                    continue
                } else if (plugin.admin && !isAdmin) { // User Admin
                    fail('admin', m, this)
                    continue
                }
                if (plugin.private && m.isGroup) { // Private Chat Only
                    fail('private', m, this)
                    continue
                }
                if (plugin.register == true && _user.registered == false) { // Butuh daftar?
                    fail('unreg', m, this)
                    continue
                }
                m.isCommand = true
                let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17 // XP Earning per command
                if (xp > 200)
                    m.reply('chirrido -_-') // Hehehe
                else
                    m.exp += xp
                if (!isPrems && plugin.estrellas && global.db.data.users[m.sender].estrellas < plugin.estrellas * 1) {
                    this.reply(m.chat, `🌟 Tus *Estrellas* se agotaron\nUse #regalo para obtener más, gratis.`, m)
                    continue // Limit habis
                }
                if (plugin.level > _user.level) {
                    this.reply(m.chat, `🪐 nivel requerido ${plugin.level} para usar este comando. \nTu nivel ${_user.level}`, m)
                    continue // If the level has not been reached
                }
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
                    isPremSubs,
                    isOwner,
                    isRAdmin,
                    isAdmin,
                    isBotAdmin,
                    isPrems,
                    chatUpdate,
                    __dirname: ___dirname,
                    __filename
                }
                try {
                    await plugin.call(this, m, extra)
                    if (!isPrems)
                        m.estrellas = m.estrellas || plugin.estrellas || false
                } catch (e) {
                    // Error occured
                    m.error = e
                    console.error(e)
                    if (e) {
                        let text = format(e)
                        for (let key of Object.values(global.APIKeys))
                            text = text.replace(new RegExp(key, 'g'), '#HIDDEN#')
                        m.reply(text)
                    }
                } finally {
                    // m.reply(util.format(_user))
                    if (typeof plugin.after === 'function') {
                        try {
                            await plugin.after.call(this, m, extra)
                        } catch (e) {
                            console.error(e)
                        }
                    }
                    if (m.estrellas)
                        m.reply(`Utilizaste *${+m.estrellas}* 🌟`)
                }
                break
            }
        }
    } catch (e) {
        console.error(e)
    } finally {
        if (opts['queque'] && m.text) {
            const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
            if (quequeIndex !== -1)
                this.msgqueque.splice(quequeIndex, 1)
        }
        //console.log(global.db.data.users[m.sender])
        let user, stats = global.db.data.stats
        if (m) {
            if (m.sender && (user = global.db.data.users[m.sender])) {
                user.exp += m.exp
                user.estrellas -= m.estrellas * 1
            }

            let stat
            if (m.plugin) {
                let now = +new Date
                if (m.plugin in stats) {
                    stat = stats[m.plugin]
                    if (!isNumber(stat.total))
                        stat.total = 1
                    if (!isNumber(stat.success))
                        stat.success = m.error != null ? 0 : 1
                    if (!isNumber(stat.last))
                        stat.last = now
                    if (!isNumber(stat.lastSuccess))
                        stat.lastSuccess = m.error != null ? 0 : now
                } else
                    stat = stats[m.plugin] = {
                        total: 1,
                        success: m.error != null ? 0 : 1,
                        last: now,
                        lastSuccess: m.error != null ? 0 : now
                    }
                stat.total += 1
                stat.last = now
                if (m.error == null) {
                    stat.success += 1
                    stat.lastSuccess = now
                }
            }
        }

        try {
            if (!opts['noprint']) await (await import(`./lib/print.js`)).default(m, this)
        } catch (e) {
            console.log(m, m.quoted, e)
        }
        if (opts['autoread'])
            await this.chatRead(m.chat, m.isGroup ? m.sender : undefined, m.id || m.key.id).catch(() => { })
    }
}

export async function participantsUpdate({ id, participants, action }) {
    if (opts['self'])
        return
    // if (id in conn.chats) return // First login will spam
    if (this.isInit)
        return
    if (global.db.data == null)
        await loadDatabase()
    let chat = global.db.data.chats[id] || {}
    let text = ''
    switch (action) {
        case 'add':
        case 'remove':
            if (chat.welcome) {
                let groupMetadata = await this.groupMetadata(id) || (conn.chats[id] || {}).metadata
                for (let user of participants) {
text = (action === 'add' ? (chat.sWelcome || this.welcome || conn.welcome || 'Bienvenido, @user').replace('@group', await this.getName(id)).replace('@desc', groupMetadata.desc?.toString() || 'Desconocido') :
                            (chat.sBye || this.bye || conn.bye || 'Adiós, @user')).replace('@user', '@' + user.split('@')[0])
let pp = global.db.data.settings[this.user.jid].logo || await this.profilePictureUrl(user, "image").catch(_ => logo)
this.sendFile(id, action === 'add' ? pp : pp, 'pp.jpg', text, null, false, { mentions: [user] })
                    }
                }

            break
        case 'promote':
            text = (chat.sPromote || this.spromote || conn.spromote || '@user ahora es administrador')
        case 'demote':
            let pp = await this.profilePictureUrl(participants[0], 'image').catch(_ => logo) 
            if (!text)
                text = (chat.sDemote || this.sdemote || conn.sdemote || '@user ya no es administrador')
            text = text.replace('@user', '@' + participants[0].split('@')[0])
            if (chat.detect)    
            this.sendFile(id, pp, 'pp.jpg', text, null, false, { mentions: this.parseMention(text) })
            //this.sendMessage(id, { text, mentions: this.parseMention(text) })
            break
    }
}

export async function groupsUpdate(groupsUpdate) {
    if (opts['self'])
        return
    for (const groupUpdate of groupsUpdate) {
        const id = groupUpdate.id
        if (!id) continue
        let chats = global.db.data.chats[id], text = ''
        if (!chats?.detect) continue
        if (groupUpdate.desc) text = (chats.sDesc || this.sDesc || conn.sDesc || 'Descripción cambiada a \n@desc').replace('@desc', groupUpdate.desc)
        if (groupUpdate.subject) text = (chats.sSubject || this.sSubject || conn.sSubject || 'El nombre del grupo cambió a \n@group').replace('@group', groupUpdate.subject)
        if (groupUpdate.icon) text = (chats.sIcon || this.sIcon || conn.sIcon || 'El icono del grupo cambió a').replace('@icon', groupUpdate.icon)
        if (groupUpdate.revoke) text = (chats.sRevoke || this.sRevoke || conn.sRevoke || 'El enlace del grupo cambia a\n@revoke').replace('@revoke', groupUpdate.revoke)
        if (!text) continue
        await this.sendMessage(id, { text, mentions: this.parseMention(text) })
    }
}

export async function deleteUpdate(message) {
    try {
        const { fromMe, id, participant } = message
        if (fromMe)
            return
        let msg = this.serializeM(this.loadMessage(id))
        if (!msg)
            return
        let chat = global.db.data.chats[msg.chat] || {}
        if (chat.delete)
            return
        this.reply(msg.chat, `
_@${participant.split`@`[0]} eliminó un mensaje._
*✧ Para desactivar esta función escribe:*
*.on delete*
          
*✧ Para eliminar los mensajes del bot escribe:*
*.delete*`, msg)
        this.copyNForward(msg.chat, msg).catch(e => console.log(e, msg))
    } catch (e) {
        console.error(e)
    }
}

global.dfail = async (type, m, conn, usedPrefix) => { 
const msg = {
rowner: '《★》Esta función solo puede ser usada por mi creador',
premsubs: '《★》Esta función solo puede ser usada por subbots premiums.', 
owner: '《★》Esta función solo puede ser usada por mi desarrollador.', 
mods: '《★》Esta función solo puede ser usada por los moderadores del bot', 
premium: '《★》Esta función solo es para usuarios Premium.', 
group: '《★》Esta funcion solo puede ser ejecutada en grupos.', 
private: '《★》Esta función solo puede ser usada en chat privado.', 
admin: '《★》Este comando solo puede ser usado por admins.', 
botAdmin: '《★》Para usar esta función debo ser admin.',
unreg: `《★》No te encuentras registrado, registrese para usar esta función\n*/reg nombre.edad*\n\n*Ejemplo* : */reg Crow.18*`,
restrict: '《★》Esta característica esta desactivada.'
}[type];
if (msg) return conn.reply(m.chat, msg, m).then(_ => m.react('✖️'))}

let file = global.__filename(import.meta.url, true)
watchFile(file, async () => {
    unwatchFile(file)
    console.log(chalk.magenta("✅  Se actualizo 'handler.js'"))
    if (global.reloadHandler) console.log(await global.reloadHandler())
})






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

export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || [];
    this.uptime = this.uptime || Date.now();
    if (!chatUpdate)
        return;
    this.pushMessage(chatUpdate.messages).catch(console.error);


    let m = chatUpdate.messages[chatUpdate.messages.length - 1];
    if (!m)
        return;

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


    if (global.db.data == null)
        await global.loadDatabase(); 
          const prefijosArabes = ['966', '213', '973', '974', '20', '971', '964', '962', '965', '961', '218', '212', '222', '968', '970', '963', '249', '216', '967'];
    
    if (m.sender) {
        const senderNumber = m.sender.split('@')[0];
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
        if (!m)
            return;
        m.exp = 0;
        m.coin = false;
        try {
            let user = global.db.data.users[m.sender];
            if (typeof user !== 'object')  
                global.db.data.users[m.sender] = {};
            if (user) {
                if (!isNumber(user.exp))
                    user.exp = 0;
                if (!isNumber(user.coin))
                    user.coin = 10;
                if (!isNumber(user.joincount))
                    user.joincount = 1;
                if (!isNumber(user.diamond))
                    user.diamond = 3;
                if (!isNumber(user.lastadventure))
                    user.lastadventure = 0;
                if (!isNumber(user.lastclaim))
                    user.lastclaim = 0;
                if (!isNumber(user.health))
                    user.health = 100;
                if (!isNumber(user.crime))
                    user.crime = 0;
                if (!isNumber(user.lastcofre))
                    user.lastcofre = 0;
                if (!isNumber(user.lastdiamantes))
                    user.lastdiamantes = 0;
                if (!isNumber(user.lastpago))
                    user.lastpago = 0;
                if (!isNumber(user.lastcode))
                    user.lastcode = 0;
                if (!isNumber(user.lastcodereg))
                    user.lastcodereg = 0;
                if (!isNumber(user.lastduel))
                    user.lastduel = 0;
                if (!isNumber(user.lastmining))
                    user.lastmining = 0;
                if (!('muto' in user))
                    user.muto = false;
                if (!('premium' in user))
                    user.premium = false;
                if (!user.premium)
                    user.premiumTime = 0;
                if (!('registered' in user))
                    user.registered = false;
                if (!('genre' in user))
                    user.genre = '';
                if (!('birth' in user))
                    user.birth = '';
                if (!('marry' in user))
                    user.marry = '';
                if (!('description' in user))
                    user.description = '';
                if (!('packstickers' in user))
                    user.packstickers = null;
                if (!user.registered) {
                    if (!('name' in user))
                        user.name = m.name;
                    if (!isNumber(user.age))
                        user.age = -1;
                    if (!isNumber(user.regTime))
                        user.regTime = -1;
                }
                if (!isNumber(user.afk))
                    user.afk = -1;
                if (!('afkReason' in user))
                    user.afkReason = '';
                if (!('role' in user))
                    user.role = 'Nuv';
                if (!('banned' in user))
                    user.banned = false;
                if (!('useDocument' in user))
                    user.useDocument = false;
                if (!isNumber(user.level))
                    user.level = 0;
                if (!isNumber(user.bank))
                    user.bank = 0;
                if (!isNumber(user.warn))
                    user.warn = 0;
            } else
                global.db.data.users[m.sender] = {
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
            let chat = global.db.data.chats[m.chat];
            if (typeof chat !== 'object')
                global.db.data.chats[m.chat] = {};
            if (chat) {
                if (!('isBanned' in chat))
                    chat.isBanned = false;
                if (!('sAutoresponder' in chat))
                    chat.sAutoresponder = '';
                if (!('welcome' in chat))
                    chat.welcome = true;
                if (!('autolevelup' in chat))
                    chat.autolevelup = false;
                if (!('autoAceptar' in chat))
                    chat.autoAceptar = false;
                if (!('autosticker' in chat))
                    chat.autosticker = false;
                if (!('autoRechazar' in chat))
                    chat.autoRechazar = false;
                if (!('autoresponder' in chat))
                    chat.autoresponder = false;
                if (!('autoresponder2' in chat))
                    chat.autoresponder2 = false;
                if (!('detect' in chat))
                    chat.detect = true;
                if (!('antiBot' in chat))
                    chat.antiBot = false;
                if (!('antiBot2' in chat))
                    chat.antiBot2 = false;
                if (!('modoadmin' in chat))
                    chat.modoadmin = false;   
                if (!('antiLink' in chat))
                    chat.antiLink = true;
                if (!('reaction' in chat))
                    chat.reaction = false;
                if (!('nsfw' in chat))
                    chat.nsfw = false;
                if (!('antifake' in chat))
                    chat.antifake = false;
                if (!('delete' in chat))
                    chat.delete = false;
                if (!isNumber(chat.expired))
                    chat.expired = 0;
            } else
                global.db.data.chats[m.chat] = {
                    isBanned: false,
                    sAutoresponder: '',
                    welcome: true,
                    autolevelup: false,
                    autoresponder: false,
                    autoresponder2: false,
                    delete: false,
                    autoAceptar: false,
                    autoRechazar: false,
                    detect: true,
                    antiBot: false,
                    antiBot2: false,
                    modoadmin: false,
                    antiLink: true,
                    antifake: false,
                    reaction: false,
                    nsfw: false,
                    expired: 0, 
                    antiLag: false,
                    per: [],
                };
            var settings = global.db.data.settings[this.user.jid];
            if (typeof settings !== 'object') global.db.data.settings[this.user.jid] = {};
            if (settings) {
                if (!('self' in settings)) settings.self = false;
                if (!('restrict' in settings)) settings.restrict = true;
                if (!('jadibotmd' in settings)) settings.jadibotmd = true;
                if (!('antiPrivate' in settings)) settings.antiPrivate = false;
                if (!('autoread' in settings)) settings.autoread = false;
                
                if (!('soloParaJid' in settings)) settings.soloParaJid = false;
            } else global.db.data.settings[this.user.jid] = {
                self: false,
                restrict: true,
                jadibotmd: true,
                antiPrivate: false,
                autoread: false,
                soloParaJid: false, 
                status: 0
            };
        } catch (e) {
            console.error(e);
        }

        let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender];

        const detectwhat = m.sender.includes('@lid') ? '@lid' : '@s.whatsapp.net';
        const isROwner = [...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + detectwhat).includes(m.sender);
        const isOwner = isROwner || m.fromMe;
        const isMods = isROwner || global.mods.map(v => v.replace(/[^0-9]/g, '') + detectwhat).includes(m.sender);
        const isPrems = isROwner || global.prems.map(v => v.replace(/[^0-9]/g, '') + detectwhat).includes(m.sender) || _user.premium == true;

        if (m.isBaileys) return;
        if (opts['nyimak'])  return;
        if (!isROwner && opts['self']) return;
        if (opts['swonly'] && m.chat !== 'status@broadcast')  return;
        if (typeof m.text !== 'string')
            m.text = '';

        if (opts['queque'] && m.text && !(isMods || isPrems)) {
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

        const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins');
        for (let name in global.plugins) {
            let plugin = global.plugins[name];
            if (!plugin)
                continue;
            if (plugin.disabled)
                continue;
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
                }}
            if (!opts['restrict'])
                if (plugin.tags && plugin.tags.includes('admin')) {
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
                }))
                    continue;
            }
            if (typeof plugin !== 'function')
                continue;
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
                    plugin.command.some(cmd => cmd instanceof RegExp ? 
                        cmd.test(command) :
                        cmd === command) :
                    typeof plugin.command === 'string' ? 
                    plugin.command === command :
                    false;

                global.comando = command;

                if ((m.id.startsWith('NJX-') || (m.id.startsWith('BAE5') && m.id.length === 16) || (m.id.startsWith('B24E') && m.id.length === 20))) return;

                
                const settings = global.db.data.settings[this.user.jid];
                if (settings.soloParaJid && m.sender !== settings.soloParaJid) {
                    continue; 
                }
                

                if (!isAccept) {
                    continue;
                }
                m.plugin = name;
                if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
                    let chat = global.db.data.chats[m.chat];
                    let user = global.db.data.users[m.sender];
                    if (!['grupo-unbanchat.js'].includes(name) && chat && chat.isBanned && !isROwner) return;
                    if (name != 'grupo-unbanchat.js' && name != 'owner-exec.js' && name != 'owner-exec2.js' && name != 'grupo-delete.js' && chat?.isBanned && !isROwner) return;
                    if (m.text && user.banned && !isROwner) {
                        m.reply(`《✦》Estas baneado/a, no puedes usar comandos en este bot!\n\n${user.bannedReason ? `✰ *Motivo:* ${user.bannedReason}` : '✰ *Motivo:* Sin Especificar'}\n\n> ✧ Si este Bot es cuenta oficial y tiene evidencia que respalde que este mensaje es un error, puedes exponer tu caso con un moderador.`);
                        return;
                    }

                    if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
                        let chat = global.db.data.chats[m.chat];
                        let user = global.db.data.users[m.sender];
                        let setting = global.db.data.settings[this.user.jid];
                        if (name != 'grupo-unbanchat.js' && chat?.isBanned)
                            return; 
                        if (name != 'owner-unbanuser.js' && user?.banned)
                            return;
                    }}

                let hl = _prefix; 
                let adminMode = global.db.data.chats[m.chat].modoadmin;
                let mini = `${plugins.botAdmin || plugins.admin || plugins.group || plugins || noPrefix || hl ||  m.text.slice(0, 1) == hl || plugins.command}`;
                if (adminMode && !isOwner && !isROwner && m.isGroup && !isAdmin && mini) return;   
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
                let xp = 'exp' in plugin ? parseInt(plugin.exp) : 10;
                m.exp += xp;
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
                        }}
                    if (m.coin)
                        conn.reply(m.chat, `❮✦❯ Utilizaste ${+m.coin} ${moneda}`, m);
                }
                break;
            }}
    } catch (e) {
        console.error(e);
    } finally {
        if (opts['queque'] && m.text) {
            const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id);
            if (quequeIndex !== -1)
                this.msgqueque.splice(quequeIndex, 1);
        }
        let user, stats = global.db.data.stats;
        if (m) { let utente = global.db.data.users[m.sender];
            if (utente.muto == true) {
                let bang = m.key.id;
                let cancellazzione = m.key.participant;
                await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: cancellazzione }});
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
                    if (!isNumber(stat.total))
                        stat.total = 1;
                    if (!isNumber(stat.success))
                        stat.success = m.error != null ? 0 : 1;
                    if (!isNumber(stat.last))
                        stat.last = now;
                    if (!isNumber(stat.lastSuccess))
                        stat.lastSuccess = m.error != null ? 0 : now;
                } else
                    stat = stats[m.plugin] = {
                        total: 1,
                        success: m.error != null ? 0 : 1,
                        last: now,
                        lastSuccess: m.error != null ? 0 : now
                    };
                stat.total += 1;
                stat.last = now;
                if (m.error == null) {
                    stat.success += 1;
                    stat.lastSuccess = now;
                }}}

        try {
            if (!opts['noprint']) await (await import(`./lib/print.js`)).default(m, this);
        } catch (e) { 
            console.log(m, m.quoted, e);}
        let settingsREAD = global.db.data.settings[this.user.jid] || {};  
        if (opts['autoread']) await this.readMessages([m.key]);

        function pickRandom(list) { return list[Math.floor(Math.random() * list.length)];}
    }}

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




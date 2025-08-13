
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';
import './config.js';
import { setupMaster } from 'cluster';
import cfonts from 'cfonts';
import { fileURLToPath, pathToFileURL } from 'url';
import { platform } from 'process';
import * as ws from 'ws';
import fs, { watch } from 'fs';
import { readdirSync, statSync, unlinkSync, existsSync, mkdirSync, readFileSync, rmSync } from 'fs';
import yargs from 'yargs';
import { spawn } from 'child_process';
import lodash from 'lodash';
import { JadiBot } from './plugins/jadibot-serbot.js';
import chalk from 'chalk';
import syntaxerror from 'syntax-error';
import { tmpdir } from 'os';
import { format } from 'util';
import { makeWASocket, protoType, serialize } from './lib/simple.js';
import { Low, JSONFile } from 'lowdb';
import { mongoDB, mongoDBV2 } from './lib/mongoDB.js';
import store from './lib/store.js';
import pkg from 'google-libphonenumber';
import { DisconnectReason, useMultiFileAuthState, makeCacheableSignalKeyStore, jidNormalizedUser, Browsers, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import readline from 'readline';
import NodeCache from 'node-cache';
import path, { join } from 'path';

const { PhoneNumberUtil } = pkg;
const phoneUtil = PhoneNumberUtil.getInstance();
const { chain } = lodash;
const { createRequire } = await import('module');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;
const sessionsDir = 'sessions'; 
const jadiDir = 'jadi';         
const filterStrings = ["Q2xvc2luZyBzdGFsZSBvcGVu", "Q2xvc2luZyBvcGVuIHNlc3Npb24=", "RmFpbGVkIHRvIGRlY3J5cHQ=", "U2Vzc2lvbiBlcnJvcg==", "RXJyb3I6IEJhZCBNQUM=", "RGVjcnlwdGVkIG1lc3NhZ2U="];
const lidCache = new NodeCache({ stdTTL: 3600 }); // Un jutsu de memoria temporal para LIDs


function initialize() {
    cfonts.say('Naruto-Bot-MD', { font: 'simple', align: 'left', gradient: ['green', 'white'] });
    cfonts.say('developed by Deylin', { font: 'console', align: 'center', colors: ['cyan', 'magenta', 'yellow'] });
    protoType();
    serialize();

    global.__filename = (pathURL = import.meta.url, rmPrefix = platform !== 'win32') => rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
    global.__dirname = (pathURL) => path.dirname(global.__filename(pathURL, true));
    global.__require = (dir = import.meta.url) => createRequire(dir);

    global.timestamp = { start: new Date() };
    global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
    global.prefix = new RegExp('^[#!./]');

    global.db = new Low(/https?:\/\//.test(global.opts['db'] || '') ? new cloudDBAdapter(global.opts['db']) : new JSONFile('database.json'));
    global.loadDatabase();

    const { state, saveState, saveCreds } = useMultiFileAuthState(sessionsDir);
    global.conn = createWASocket(state, saveCreds);

    if (global.opts['autocleartmp']) {
        setInterval(() => {
            spawn('find', [tmpdir(), '-amin', '3', '-type', 'f', '-delete']);
        }, 180000); 
    }
}


async function handleLoginMethods() {
    const methodCodeQR = process.argv.includes("qr");
    const methodCode = !!global.botNumber || process.argv.includes("code");
    const methodMobile = process.argv.includes("mobile");

    let loginOption;
    if (methodCodeQR) {
        loginOption = '1';
    } else if (!methodCodeQR && !methodCode && !fs.existsSync(`./${sessionsDir}/creds.json`)) {
        do {
            loginOption = await askQuestion(chalk.blueBright(`\n┏━━━ 『 Modos de conexión 』━━━━\n┃  1. Código QR (jutsu de escaneo)\n┃  2. Código de texto de 8 dígitos (jutsu de sincronización)\n┗━━━━━━━━━━━━━\n\n➜ Elige tu camino ninja: `));
            if (!/^[1-2]$/.test(loginOption)) {
                console.log(chalk.bold.redBright(`ム No es un jutsu válido. Elige 1 o 2.`));
            }
        } while (loginOption !== '1' && loginOption !== '2');
    } else {
        loginOption = methodCode ? '2' : '1';
    }
    
    return { loginOption, methodCodeQR, methodCode, methodMobile };
}

async function askQuestion(text) {
    return new Promise((resolve) => rl.question(text, resolve));
}

async function createWASocket(state, saveCreds) {
    const { version } = await fetchLatestBaileysVersion();
    const { loginOption, methodCodeQR, methodCode, methodMobile } = await handleLoginMethods();

    const connectionOptions = {
        logger: pino({ level: 'silent' }),
        printQRInTerminal: loginOption === '1' || methodCodeQR,
        mobile: methodMobile,
        browser: loginOption === '1' ? Browsers.macOS("Desktop") : Browsers.macOS("Chrome"),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
        },
        generateHighQualityLinkPreview: true,
        version: version,
        keepAliveIntervalMs: 55000,
        getMessage: async (key) => store.loadMessage(jidNormalizedUser(key.remoteJid), key.id) || '',
        msgRetryCounterCache: new NodeCache({ stdTTL: 0, checkperiod: 0 }),
        userDevicesCache: new NodeCache({ stdTTL: 0, checkperiod: 0 }),
    };

    const conn = makeWASocket(connectionOptions);

    if (loginOption === '2' || methodCode) {
        if (!conn.authState.creds.registered) {
            const phoneNumber = global.botNumber || await askQuestion(chalk.greenBright(`[ 👑 ] Ingresa tu número de Shinobi (con código de país):\n➜ `));
            const addNumber = phoneNumber.replace(/\D/g, '');
            if (!isValidPhoneNumber(addNumber)) {
                console.log(chalk.bold.red(`¡Ese no es un número ninja válido!`));
                process.exit();
            }
            rl.close();
            const codeBot = await conn.requestPairingCode(addNumber);
            console.log(chalk.bold.white(chalk.bgMagenta(`[ JUTSU DE CÓDIGO ]`)), chalk.bold.white(chalk.white(codeBot.match(/.{1,4}/g)?.join("-"))));
        }
    }

    conn.isInit = false;
    return conn;
}


function redefineConsoleMethod(methodName) {
    const originalConsoleMethod = console[methodName];
    console[methodName] = function() {
        const message = arguments[0];
        if (typeof message === 'string' && filterStrings.some(filterString => message.includes(atob(filterString)))) {
            arguments[0] = '';
        }
        originalConsoleMethod.apply(console, arguments);
    };
}
['log', 'warn', 'error'].forEach(redefineConsoleMethod);

async function connectionUpdate(update) {
    const { connection, lastDisconnect, isNewLogin } = update;
    global.stopped = connection;
    if (isNewLogin) global.conn.isInit = true;

    const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;

    if (connection === 'close') {
        const message = `[ JUTSU DE DESCONEXIÓN ] Tu conexión ha fallado. Razón: ${reason}`;
        console.log(chalk.bold.red(message));

        if (reason === DisconnectReason.loggedOut) {
            console.log(chalk.bold.cyan(`Borra la sesión y vuelve a conectarte.`));
            fs.rmSync(`./${sessionsDir}/creds.json`, { recursive: true, force: true });
        }
        await global.reloadHandler(true).catch(console.error);
    } else if (connection === 'open') {
        const userJid = jidNormalizedUser(global.conn.user.id);
        const userName = global.conn.user.name || 'Shinobi Desconocido';
        console.log(chalk.green.bold(`[ ☊ ] Conectado al Hokage: ${userName}`));
    }
}

async function reloadHandler(restatConn) {
    try {
        const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error);
        if (Object.keys(Handler || {}).length) handler = Handler;
    } catch (e) {
        console.error(e);
    }
    
    if (restatConn) {
        const oldChats = global.conn.chats;
        try { global.conn.ws.close(); } catch {}
        global.conn.ev.removeAllListeners();
        global.conn = createWASocket(global.conn.authState, global.conn.credsUpdate, oldChats);
        global.conn.isInit = true;
    }

    if (!global.conn.isInit) {
        global.conn.ev.off('messages.upsert', global.conn.handler);
        global.conn.ev.off('connection.update', global.conn.connectionUpdate);
        global.conn.ev.off('creds.update', global.conn.credsUpdate);
    }

    global.conn.handler = handler.handler.bind(global.conn);
    global.conn.connectionUpdate = connectionUpdate.bind(global.conn);
    global.conn.credsUpdate = global.conn.saveCreds.bind(global.conn, true);
    global.conn.ev.on('messages.upsert', global.conn.handler);
    global.conn.ev.on('connection.update', global.conn.connectionUpdate);
    global.conn.ev.on('creds.update', global.conn.credsUpdate);
    global.conn.isInit = false;
}

function clearTmp() {
    const tmpDir = join(__dirname, 'tmp');
    if (existsSync(tmpDir)) {
        readdirSync(tmpDir).forEach(file => unlinkSync(join(tmpDir, file)));
    }
}

function purgeOldFiles() {
    const directories = [`./${sessionsDir}/`, `./${jadiDir}/`];
    directories.forEach(dir => {
        if (!existsSync(dir)) return;
        readdirSync(dir).forEach(file => {
            if (file !== 'creds.json' && file !== '.gitignore') { // Proteger archivos importantes
                unlinkSync(join(dir, file));
            }
        });
    });
    console.log(chalk.bold.cyanBright(`\n⌦ Archivos no necesarios han sido eliminados.`));
}

function purgePreKeys(dir) {
    if (!existsSync(dir)) return;
    const dirsToClean = readdirSync(dir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => join(dir, dirent.name));

    if (dirsToClean.length > 0) {
        dirsToClean.forEach(subdir => {
            readdirSync(subdir).forEach(file => {
                if (file.startsWith('pre-key-') && file !== 'creds.json') {
                    unlinkSync(join(subdir, file));
                }
            });
        });
        console.log(chalk.bold.cyanBright(`\n⌦ Archivos de pre-key obsoletos eliminados.`));
    } else {
        console.log(chalk.bold.green(`\n⍰ No hay archivos obsoletos para eliminar en ${dir}.`));
    }
}

async function isValidPhoneNumber(number) {
    try {
        const parsedNumber = phoneUtil.parseAndKeepRawInput(number.startsWith('+') ? number : `+${number}`);
        return phoneUtil.isValidNumber(parsedNumber);
    } catch (error) {
        return false;
    }
}

async function main() {
    initialize();
    global.reloadHandler(false);

    
    setInterval(() => {
        if (global.stopped === 'close' || !global.conn || !global.conn.user) return;
        clearTmp();
        purgePreKeys(join(__dirname, sessionsDir));
        purgePreKeys(join(__dirname, jadiDir));
        purgeOldFiles();
    }, 600000);

    
    setInterval(() => {
        console.log(chalk.bold.cyan('[ ↻ ] Reiniciando el bot para estar en óptimas condiciones.'));
        process.exit(0);
    }, 10800000); 

    
    if (global.Jadibts) {
        const rutaJadiBot = join(__dirname, jadiDir);
        if (!existsSync(rutaJadiBot)) {
            mkdirSync(rutaJadiBot, { recursive: true });
        }
        readdirSync(rutaJadiBot).forEach(botDir => {
            const botPath = join(rutaJadiBot, botDir);
            if (statSync(botPath).isDirectory() && existsSync(join(botPath, 'creds.json'))) {
                JadiBot({ pathJadiBot: botPath, m: null, conn: global.conn, args: '', usedPrefix: '/', command: 'serbot' });
            }
        });
    }

    // Cargando jutsus (plugins)
    const pluginFolder = join(__dirname, './plugins/');
    const pluginFilter = (filename) => /\.js$/.test(filename);
    global.plugins = {};
    const files = readdirSync(pluginFolder).filter(pluginFilter);
    for (const file of files) {
        try {
            const module = await import(join(pluginFolder, file));
            global.plugins[file] = module.default || module;
        } catch (e) {
            console.error(`Error al cargar el jutsu '${file}':`, e);
        }
    }
    
    // Jutsu de vigilancia de jutsus nuevos
    watch(pluginFolder, (event, filename) => {
        if (pluginFilter(filename)) {
            global.reloadHandler(true);
        }
    });

    // Validando herramientas ninja
    await Promise.all([
        spawn('ffmpeg'), spawn('ffprobe'), spawn('ffmpeg', ['-f', 'webp', '-']), spawn('convert'),
        spawn('magick'), spawn('gm'), spawn('find', ['--version'])
    ].map(p => new Promise((resolve, reject) => {
        p.on('close', code => resolve(code !== 127));
        p.on('error', () => reject(false));
    }))).then(results => {
        global.support = {
            ffmpeg: results[0], ffprobe: results[1], ffmpegWebp: results[2],
            convert: results[3], magick: results[4], gm: results[5], find: results[6]
        };
    }).catch(console.error);

    // Manejador de errores para que el bot no caiga
    process.on('uncaughtException', console.error);
}

main();





/*process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
import './config.js'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile } from 'fs'
import cfonts from 'cfonts'
import { createRequire } from 'module'
import { fileURLToPath, pathToFileURL } from 'url'
import { platform } from 'process'
import * as ws from 'ws'
import fs, { readdirSync, statSync, unlinkSync, existsSync, mkdirSync, readFileSync, rmSync, watch } from 'fs'
import yargs from 'yargs'
import { spawn, execSync } from 'child_process'
import lodash from 'lodash'
import { JadiBot } from './plugins/jadibot-serbot.js'
import chalk from 'chalk'
import syntaxerror from 'syntax-error'
import { tmpdir } from 'os'
import { format } from 'util'
import boxen from 'boxen'
import P from 'pino'
import pino from 'pino'
import Pino from 'pino'
import path, { join, dirname } from 'path'
import { Boom } from '@hapi/boom'
import { makeWASocket, protoType, serialize } from './lib/simple.js'
import { Low, JSONFile } from 'lowdb'
import { mongoDB, mongoDBV2 } from './lib/mongoDB.js'
import store from './lib/store.js'
const { proto } = (await import('@whiskeysockets/baileys')).default
import pkg from 'google-libphonenumber'
const { PhoneNumberUtil } = pkg
const phoneUtil = PhoneNumberUtil.getInstance()
const { DisconnectReason, useMultiFileAuthState, MessageRetryMap, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidNormalizedUser, Browsers } = await import('@whiskeysockets/baileys')
import readline, { createInterface } from 'readline'
import NodeCache from 'node-cache'
const { CONNECTING } = ws
const { chain } = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

let { say } = cfonts
console.log(chalk.magentaBright('\n Iniciando...'))
say('Naruto-Bot-MD', {
font: 'simple',
align: 'left',
gradient: ['green', 'white']
})
say('developed by Deylin ', {
font: 'console',
align: 'center',
colors: ['cyan', 'magenta', 'yellow']
})
protoType()
serialize()

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
}; global.__dirname = function dirname(pathURL) {
return path.dirname(global.__filename(pathURL, true))
}; global.__require = function require(dir = import.meta.url) {
return createRequire(dir)
}

global.timestamp = {start: new Date}
const __dirname = global.__dirname(import.meta.url)
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.prefix = new RegExp('^[#!./]')

global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : new JSONFile('database.json'))
global.DATABASE = global.db; 
global.loadDatabase = async function loadDatabase() {
if (global.db.READ) {
return new Promise((resolve) => setInterval(async function() {
if (!global.db.READ) {
clearInterval(this);
resolve(global.db.data == null ? global.loadDatabase() : global.db.data)
}}, 1 * 1000))
}
if (global.db.data !== null) return
global.db.READ = true
await global.db.read().catch(console.error)
global.db.READ = null
global.db.data = {
users: {},
chats: {},
stats: {},
msgs: {},
sticker: {},
settings: {},
...(global.db.data || {}),
}
global.db.chain = chain(global.db.data)
}
loadDatabase()

const {state, saveState, saveCreds} = await useMultiFileAuthState(global.sessions)
const msgRetryCounterMap = new Map()
const msgRetryCounterCache = new NodeCache({ stdTTL: 0, checkperiod: 0 })
const userDevicesCache = new NodeCache({ stdTTL: 0, checkperiod: 0 })
const { version } = await fetchLatestBaileysVersion()
let phoneNumber = global.botNumber
const methodCodeQR = process.argv.includes("qr")
const methodCode = !!phoneNumber || process.argv.includes("code")
const MethodMobile = process.argv.includes("mobile")
const colors = chalk.bold.white
const qrOption = chalk.blueBright
const textOption = chalk.cyan
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (texto) => new Promise((resolver) => rl.question(texto, resolver))
let opcion
if (methodCodeQR) {
opcion = '1'
}
if (!methodCodeQR && !methodCode && !fs.existsSync(`./${sessions}/creds.json`)) {
do {
opcion = await question(colors("┏╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⚃\n┇ ╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈╾\n┇ ┆Seleccione una opción:\n┇") + qrOption(" ┆1. Con código QR\n┇") + textOption(" ┆2. Con código de texto de 8 dígitos\n┇ ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╾\n┗╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⚃\n\n❑➙➔ "))
if (!/^[1-2]$/.test(opcion)) {
console.log(chalk.bold.redBright(`ム ʕ˖͜͡˖ʔ No se permiten numeros que no sean 1 o 2, tampoco letras o símbolos especiales.`))
}} while (opcion !== '1' && opcion !== '2' || fs.existsSync(`./${sessions}/creds.json`))
} 

const filterStrings = [
"Q2xvc2luZyBzdGFsZSBvcGVu", // "Closing stable open"
"Q2xvc2luZyBvcGVuIHNlc3Npb24=", // "Closing open session"
"RmFpbGVkIHRvIGRlY3J5cHQ=", // "Failed to decrypt"
"U2Vzc2lvbiBlcnJvcg==", // "Session error"
"RXJyb3I6IEJhZCBNQUM=", // "Error: Bad MAC" 
"RGVjcnlwdGVkIG1lc3NhZ2U=" // "Decrypted message" 
]

console.info = () => { }
console.debug = () => { }
['log', 'warn', 'error'].forEach(methodName => redefineConsoleMethod(methodName, filterStrings))

const connectionOptions = {
logger: pino({ level: 'silent' }),
printQRInTerminal: opcion == '1' ? true : methodCodeQR ? true : false,
mobile: MethodMobile, 
browser: opcion == '1' ? Browsers.macOS("Desktop") : methodCodeQR ? Browsers.macOS("Desktop") : Browsers.macOS("Chrome"), 
auth: {
creds: state.creds,
keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" }).child({ level: "fatal" })),
},
markOnlineOnConnect: false, 
generateHighQualityLinkPreview: true, 
syncFullHistory: false,
getMessage: async (key) => {
try {
let jid = jidNormalizedUser(key.remoteJid);
let msg = await store.loadMessage(jid, key.id)
return msg?.message || ""
} catch (error) {
return ""
}},
msgRetryCounterCache: msgRetryCounterCache || new Map(),
userDevicesCache: userDevicesCache || new Map(),
defaultQueryTimeoutMs: undefined,
cachedGroupMetadata: (jid) => globalThis.conn.chats[jid] ?? {},
version: version, 
keepAliveIntervalMs: 55000, 
maxIdleTimeMs: 60000, 
}

global.conn = makeWASocket(connectionOptions)
if (!fs.existsSync(`./${sessions}/creds.json`)) {
if (opcion === '2' || methodCode) {
opcion = '2'
if (!conn.authState.creds.registered) {
let addNumber
if (!!phoneNumber) {
addNumber = phoneNumber.replace(/[^0-9]/g, '')
} else {
do {
phoneNumber = await question(chalk.bgBlack(chalk.bold.greenBright(`[ ♛ ]  Por favor, Ingrese el número de WhatsApp.\n${chalk.bold.magentaBright('---> ')}`)))
phoneNumber = phoneNumber.replace(/\D/g,'')
if (!phoneNumber.startsWith('+')) {
phoneNumber = `+${phoneNumber}`
}} while (!await isValidPhoneNumber(phoneNumber))
rl.close()
addNumber = phoneNumber.replace(/\D/g, '')
setTimeout(async () => {
let codeBot = await conn.requestPairingCode(addNumber)
codeBot = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot
console.log(chalk.bold.white(chalk.bgMagenta(`[ ʕ˖͜͡˖ʔ ]  Código:`)), chalk.bold.white(chalk.white(codeBot)))
}, 3000)
}}}}
conn.isInit = false
conn.well = false
conn.logger.info(`[ ⌨ ]  H E C H O\n`)
if (!opts['test']) {
if (global.db) setInterval(async () => {
if (global.db.data) await global.db.write()
if (opts['autocleartmp'] && (global.support || {}).find) (tmp = [os.tmpdir(), 'tmp', `${jadi}`], tmp.forEach((filename) => cp.spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete'])))
}, 30 * 1000)
}

async function resolveLidToRealJid(lidJid, groupJid, maxRetries = 3, retryDelay = 1000) {
if (!lidJid?.endsWith("@lid") || !groupJid?.endsWith("@g.us")) return lidJid?.includes("@") ? lidJid : `${lidJid}@s.whatsapp.net`
const cached = lidCache.get(lidJid);
if (cached) return cached;
const lidToFind = lidJid.split("@")[0];
let attempts = 0
while (attempts < maxRetries) {
try {
const metadata = await conn.groupMetadata(groupJid)
if (!metadata?.participants) throw new Error("No se obtuvieron participantes")
for (const participant of metadata.participants) {
try {
if (!participant?.jid) continue
const contactDetails = await conn.onWhatsApp(participant.jid)
if (!contactDetails?.[0]?.lid) continue
const possibleLid = contactDetails[0].lid.split("@")[0]
if (possibleLid === lidToFind) {
lidCache.set(lidJid, participant.jid)
return participant.jid
}} catch (e) {
continue
}}
lidCache.set(lidJid, lidJid)
return lidJid
} catch (e) {
attempts++
if (attempts >= maxRetries) {
lidCache.set(lidJid, lidJid)
return lidJid
}
await new Promise(resolve => setTimeout(resolve, retryDelay))
}}
return lidJid
}

async function extractAndProcessLids(text, groupJid) {
if (!text) return text
const lidMatches = text.match(/\d+@lid/g) || []
let processedText = text
for (const lid of lidMatches) {
try {
const realJid = await resolveLidToRealJid(lid, groupJid);
processedText = processedText.replace(new RegExp(lid, 'g'), realJid)
} catch (e) {
console.error(`Error procesando LID ${lid}:`, e)
}}
return processedText
}

async function processLidsInMessage(message, groupJid) {
if (!message || !message.key) return message
try {
const messageCopy = {
key: {...message.key},
message: message.message ? {...message.message} : undefined,
...(message.quoted && {quoted: {...message.quoted}}),
...(message.mentionedJid && {mentionedJid: [...message.mentionedJid]})
}
const remoteJid = messageCopy.key.remoteJid || groupJid
if (messageCopy.key?.participant?.endsWith('@lid')) { messageCopy.key.participant = await resolveLidToRealJid(messageCopy.key.participant, remoteJid) }
if (messageCopy.message?.extendedTextMessage?.contextInfo?.participant?.endsWith('@lid')) { messageCopy.message.extendedTextMessage.contextInfo.participant = await resolveLidToRealJid( messageCopy.message.extendedTextMessage.contextInfo.participant, remoteJid ) }
if (messageCopy.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
const mentionedJid = messageCopy.message.extendedTextMessage.contextInfo.mentionedJid
if (Array.isArray(mentionedJid)) {
for (let i = 0; i < mentionedJid.length; i++) {
if (mentionedJid[i]?.endsWith('@lid')) {
mentionedJid[i] = await resolveLidToRealJid(mentionedJid[i], remoteJid)
}}}}
if (messageCopy.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.contextInfo?.mentionedJid) {
const quotedMentionedJid = messageCopy.message.extendedTextMessage.contextInfo.quotedMessage.extendedTextMessage.contextInfo.mentionedJid;
if (Array.isArray(quotedMentionedJid)) {
for (let i = 0; i < quotedMentionedJid.length; i++) {
if (quotedMentionedJid[i]?.endsWith('@lid')) {
quotedMentionedJid[i] = await resolveLidToRealJid(quotedMentionedJid[i], remoteJid)
}}}}
if (messageCopy.message?.conversation) { messageCopy.message.conversation = await extractAndProcessLids(messageCopy.message.conversation, remoteJid) }
if (messageCopy.message?.extendedTextMessage?.text) { messageCopy.message.extendedTextMessage.text = await extractAndProcessLids(messageCopy.message.extendedTextMessage.text, remoteJid) }
if (messageCopy.message?.extendedTextMessage?.contextInfo?.participant && !messageCopy.quoted) {
const quotedSender = await resolveLidToRealJid( messageCopy.message.extendedTextMessage.contextInfo.participant, remoteJid );
messageCopy.quoted = { sender: quotedSender, message: messageCopy.message.extendedTextMessage.contextInfo.quotedMessage }
}
return messageCopy
} catch (e) {
console.error('Error en processLidsInMessage:', e)
return message
}}

async function connectionUpdate(update) {
const {connection, lastDisconnect, isNewLogin} = update
global.stopped = connection
if (isNewLogin) conn.isInit = true
const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
await global.reloadHandler(true).catch(console.error);
global.timestamp.connect = new Date
}
if (global.db.data == null) loadDatabase()
if (update.qr != 0 && update.qr != undefined || methodCodeQR) {
if (opcion == '1' || methodCodeQR) {
console.log(chalk.green.bold(`[ ꗇ ]  Escanea este código QR`))}
}
if (connection === "open") {
const userJid = jidNormalizedUser(conn.user.id)
const userName = conn.user.name || conn.user.verifiedName || "Desconocido"
console.log(chalk.green.bold(`[ ☊ ]  Conectado a: ${userName}`))
}
let reason = new Boom(lastDisconnect?.error)?.output?.statusCode
if (connection === 'close') {
if (reason === DisconnectReason.badSession) {
console.log(chalk.bold.cyanBright(`\n⚠︎ Sin conexión, borra la session principal del Bot, y conectate nuevamente.`))
} else if (reason === DisconnectReason.connectionClosed) {
console.log(chalk.bold.magentaBright(`\n♻ Reconectando la conexión del Bot...`))
await global.reloadHandler(true).catch(console.error)
} else if (reason === DisconnectReason.connectionLost) {
console.log(chalk.bold.blueBright(`\n⚠︎ Conexión perdida con el servidor, reconectando el Bot...`))
await global.reloadHandler(true).catch(console.error)
} else if (reason === DisconnectReason.connectionReplaced) {
console.log(chalk.bold.yellowBright(`\nꗇ La conexión del Bot ha sido reemplazada.`))
} else if (reason === DisconnectReason.loggedOut) {
console.log(chalk.bold.redBright(`\n⚠︎ Sin conexión, borra la session principal del Bot, y conectate nuevamente.`))
await global.reloadHandler(true).catch(console.error)
} else if (reason === DisconnectReason.restartRequired) {
console.log(chalk.bold.cyanBright(`\n♻ Conectando el Bot con el servidor...`))
await global.reloadHandler(true).catch(console.error)
} else if (reason === DisconnectReason.timedOut) {
console.log(chalk.bold.yellowBright(`\n♻ Conexión agotada, reconectando el Bot...`))
await global.reloadHandler(true).catch(console.error)
} else {
console.log(chalk.bold.redBright(`\n⚠︎ Conexión cerrada, conectese nuevamente.`))
}}}
process.on('uncaughtException', console.error)
let isInit = true
let handler = await import('./handler.js')
global.reloadHandler = async function(restatConn) {
try {
const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error);
if (Object.keys(Handler || {}).length) handler = Handler
} catch (e) {
console.error(e);
}
if (restatConn) {
const oldChats = global.conn.chats
try {
global.conn.ws.close()
} catch { }
conn.ev.removeAllListeners()
global.conn = makeWASocket(connectionOptions, {chats: oldChats})
isInit = true
}
if (!isInit) {
conn.ev.off('messages.upsert', conn.handler)
conn.ev.off('connection.update', conn.connectionUpdate)
conn.ev.off('creds.update', conn.credsUpdate)
}
conn.handler = handler.handler.bind(global.conn)
conn.connectionUpdate = connectionUpdate.bind(global.conn)
conn.credsUpdate = saveCreds.bind(global.conn, true)
const currentDateTime = new Date()
const messageDateTime = new Date(conn.ev)
if (currentDateTime >= messageDateTime) {
const chats = Object.entries(conn.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0])
} else {
const chats = Object.entries(conn.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0])
}
conn.ev.on('messages.upsert', conn.handler)
conn.ev.on('connection.update', conn.connectionUpdate)
conn.ev.on('creds.update', conn.credsUpdate)
isInit = false
return true
}
setInterval(() => {
console.log('[ ↻ ]  Reiniciando...');
process.exit(0)
}, 10800000)
let rtU = join(__dirname, `./${jadi}`)
if (!existsSync(rtU)) {
mkdirSync(rtU, { recursive: true }) 
}

global.rutaJadiBot = join(__dirname, `./${jadi}`)
if (global.Jadibts) {
if (!existsSync(global.rutaJadiBot)) {
mkdirSync(global.rutaJadiBot, { recursive: true }) 
console.log(chalk.bold.cyan(`⍰ La carpeta: ${jadi} se creó correctamente.`))
} else {
console.log(chalk.bold.cyan(`⍰ La carpeta: ${jadi} ya está creada.`)) 
}
const readRutaJadiBot = readdirSync(rutaJadiBot)
if (readRutaJadiBot.length > 0) {
const creds = 'creds.json'
for (const gjbts of readRutaJadiBot) {
const botPath = join(rutaJadiBot, gjbts)
const readBotPath = readdirSync(botPath)
if (readBotPath.includes(creds)) {
JadiBot({pathJadiBot: botPath, m: null, conn, args: '', usedPrefix: '/', command: 'serbot'})
}}}}

const pluginFolder = global.__dirname(join(__dirname, './plugins/index'))
const pluginFilter = (filename) => /\.js$/.test(filename)
global.plugins = {}
async function filesInit() {
for (const filename of readdirSync(pluginFolder).filter(pluginFilter)) {
try {
const file = global.__filename(join(pluginFolder, filename))
const module = await import(file)
global.plugins[filename] = module.default || module
} catch (e) {
conn.logger.error(e)
delete global.plugins[filename]
}}}
filesInit().then((_) => Object.keys(global.plugins)).catch(console.error)

global.reload = async (_ev, filename) => {
if (pluginFilter(filename)) {
const dir = global.__filename(join(pluginFolder, filename), true);
if (filename in global.plugins) {
if (existsSync(dir)) conn.logger.info(` updated plugin - '${filename}'`)
else {
conn.logger.warn(`deleted plugin - '${filename}'`)
return delete global.plugins[filename]
}} else conn.logger.info(`new plugin - '${filename}'`)
const err = syntaxerror(readFileSync(dir), filename, {
sourceType: 'module',
allowAwaitOutsideFunction: true,
});
if (err) conn.logger.error(`syntax error while loading '${filename}'\n${format(err)}`)
else {
try {
const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`));
global.plugins[filename] = module.default || module;
} catch (e) {
conn.logger.error(`error require plugin '${filename}\n${format(e)}'`)
} finally {
global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
}}}}
Object.freeze(global.reload)
watch(pluginFolder, global.reload)
await global.reloadHandler()
async function _quickTest() {
const test = await Promise.all([
spawn('ffmpeg'),
spawn('ffprobe'),
spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
spawn('convert'),
spawn('magick'),
spawn('gm'),
spawn('find', ['--version']),
].map((p) => {
return Promise.race([
new Promise((resolve) => {
p.on('close', (code) => {
resolve(code !== 127);
});
}),
new Promise((resolve) => {
p.on('error', (_) => resolve(false))
})])
}))
const [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test;
const s = global.support = {ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find};
Object.freeze(global.support);
}
function clearTmp() {
const tmpDir = join(__dirname, 'tmp')
const filenames = readdirSync(tmpDir)
filenames.forEach(file => {
const filePath = join(tmpDir, file)
unlinkSync(filePath)})
}

function purgeSession() {
let prekey = []
let directorio = readdirSync(`./${sessions}`)
let filesFolderPreKeys = directorio.filter(file => {
return file.startsWith('pre-key-')
})
prekey = [...prekey, ...filesFolderPreKeys]
filesFolderPreKeys.forEach(files => {
unlinkSync(`./${sessions}/${files}`)
})
} 

function purgeSessionSB() {
try {
const listaDirectorios = readdirSync(`./${jadi}/`);
let SBprekey = [];
listaDirectorios.forEach(directorio => {
if (statSync(`./${jadi}/${directorio}`).isDirectory()) {
const DSBPreKeys = readdirSync(`./${jadi}/${directorio}`).filter(fileInDir => {
return fileInDir.startsWith('pre-key-')
})
SBprekey = [...SBprekey, ...DSBPreKeys];
DSBPreKeys.forEach(fileInDir => {
if (fileInDir !== 'creds.json') {
unlinkSync(`./${jadi}/${directorio}/${fileInDir}`)
}})
}})
if (SBprekey.length === 0) {
console.log(chalk.bold.green(`\n⍰ No hay archivos en ${jadi} para eliminar.`))
} else {
console.log(chalk.bold.cyanBright(`\n⌦ Archivos de la carpeta ${jadi} han sido eliminados correctamente.`))
}} catch (err) {
console.log(chalk.bold.red(`\n⚠︎ Error para eliminar archivos de la carpeta ${jadi}.\n` + err))
}}

function purgeOldFiles() {
const directories = [`./${sessions}/`, `./${jadi}/`]
directories.forEach(dir => {
readdirSync(dir, (err, files) => {
if (err) throw err
files.forEach(file => {
if (file !== 'creds.json') {
const filePath = path.join(dir, file);
unlinkSync(filePath, err => {
if (err) {
console.log(chalk.bold.red(`\n⚠︎ El archivo ${file} no se logró borrar.\n` + err))
} else {
console.log(chalk.bold.green(`\n⌦ El archivo ${file} se ha borrado correctamente.`))
} }) }
}) }) }) }
function redefineConsoleMethod(methodName, filterStrings) {
const originalConsoleMethod = console[methodName]
console[methodName] = function() {
const message = arguments[0]
if (typeof message === 'string' && filterStrings.some(filterString => message.includes(atob(filterString)))) {
arguments[0] = ""
}
originalConsoleMethod.apply(console, arguments)
}}
setInterval(async () => {
if (stopped === 'close' || !conn || !conn.user) return
await clearTmp()
console.log(chalk.bold.cyanBright(`\n⌦ Archivos de la carpeta TMP no necesarios han sido eliminados del servidor.`))}, 1000 * 60 * 4)
setInterval(async () => {
if (stopped === 'close' || !conn || !conn.user) return
await purgeSession()
console.log(chalk.bold.cyanBright(`\n⌦ Archivos de la carpeta ${global.sessions} no necesario han sido eliminados del servidor.`))}, 1000 * 60 * 10)
setInterval(async () => {
if (stopped === 'close' || !conn || !conn.user) return
await purgeSessionSB()}, 1000 * 60 * 10) 
setInterval(async () => {
if (stopped === 'close' || !conn || !conn.user) return
await purgeOldFiles()
console.log(chalk.bold.cyanBright(`\n⌦ Archivos no necesario han sido eliminados del servidor.`))}, 1000 * 60 * 10)
_quickTest().catch(console.error)
async function isValidPhoneNumber(number) {
try {
number = number.replace(/\s+/g, '')
if (number.startsWith('+521')) {
number = number.replace('+521', '+52');
} else if (number.startsWith('+52') && number[4] === '1') {
number = number.replace('+52 1', '+52');
}
const parsedNumber = phoneUtil.parseAndKeepRawInput(number)
return phoneUtil.isValidNumber(parsedNumber)
} catch (error) {
return false
}}*/
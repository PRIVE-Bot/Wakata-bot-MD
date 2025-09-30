process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';

import { watchFile, unwatchFile, readdirSync, statSync, unlinkSync, existsSync, mkdirSync, readFileSync, watch } from 'fs';
import { createRequire } from 'module';
import { fileURLToPath, pathToFileURL } from 'url';
import { platform, tmpdir } from 'process';
import { spawn } from 'child_process';
import path, { join } from 'path';
import readline from 'readline';
import ws from 'ws';
import './config.js';
import yargs from 'yargs';
import lodash from 'lodash';
import chalk from 'chalk';
import syntaxerror from 'syntax-error';
import { format } from 'util';
import cfonts from 'cfonts';
import { Boom } from '@hapi/boom';
import { makeWASocket, protoType, serialize } from './lib/simple.js';
import { Low, JSONFile } from 'lowdb';
import store from './lib/store.js';
import pkg from 'google-libphonenumber';
import NodeCache from 'node-cache';
import pino from 'pino';
import { JadiBot } from './plugins/jadibot-serbot.js';

const { proto } = (await import('@whiskeysockets/baileys')).default;
const { PhoneNumberUtil } = pkg;
const phoneUtil = PhoneNumberUtil.getInstance();
const { DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidNormalizedUser, Browsers } = await import('@whiskeysockets/baileys');
const { chain } = lodash;
const { CONNECTING } = ws;
const { say } = cfonts;
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (texto) => new Promise((resolver) => rl.question(texto, resolver));
const __filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
    return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
};
const __dirname = function dirname(pathURL) {
    return path.dirname(__filename(pathURL, true));
};

global.__filename = __filename;
global.__dirname = __dirname;
global.__require = function require(dir = import.meta.url) {
    return createRequire(dir);
};

global.timestamp = { start: new Date };
const CURRENT_DIR = global.__dirname(import.meta.url);
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
global.prefix = new RegExp('^[#!./]');

const lidCache = new Map();

console.info = () => {};
console.debug = () => {};
const filterStrings = [
  "Q2xvc2luZyBzdGFsZSBvcGVu",
  "Q2xvc2luZyBvcGVuIHNlc3Npb24=",
  "RmFpbGVkIHRvIGRlY3J5cHQ=",
  "U2Vzc2lvbiBlcnJvcg==",
  "RXJyb3I6IEJhZCBNQUM=",
  "RGVjcnlwdGVkIG1lc3NhZ2U="
];
['log', 'warn', 'error'].forEach(methodName => redefineConsoleMethod(methodName, filterStrings));

function redefineConsoleMethod(methodName, filterStrings) {
  const originalConsoleMethod = console[methodName];
  console[methodName] = function() {
    const message = arguments[0];
    if (typeof message === 'string' && filterStrings.some(filterString => message.includes(atob(filterString)))) {
      arguments[0] = "";
    }
    originalConsoleMethod.apply(console, arguments);
  };
}

global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : new JSONFile('database.json'));
global.DATABASE = global.db;

global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) {
    return new Promise((resolve) => setInterval(async function() {
      if (!global.db.READ) {
        clearInterval(this);
        resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
      }
    }, 1000));
  }
  if (global.db.data !== null) return;
  global.db.READ = true;
  await global.db.read().catch(() => {});
  global.db.READ = null;
  global.db.data = {
    users: {}, chats: {}, stats: {}, msgs: {}, sticker: {}, settings: {},
    ...(global.db.data || {}),
  };
  global.db.chain = chain(global.db.data);
};

loadDatabase();

const { state, saveState, saveCreds } = await useMultiFileAuthState(global.sessions);
const msgRetryCounterCache = new NodeCache({ stdTTL: 0, checkperiod: 0 });
const { version } = await fetchLatestBaileysVersion();
let phoneNumber = global.botNumber;
const methodCodeQR = process.argv.includes("qr");
const methodCode = !!phoneNumber || process.argv.includes("code");
const MethodMobile = process.argv.includes("mobile");

let opcion;
if (methodCodeQR) opcion = '1';
if (!methodCodeQR && !methodCode && !existsSync(`./${sessions}/creds.json`)) {
  do {
    const prompt = chalk.bold.white(`
┏╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⚃
┇ ╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈╾
┇ ┆Seleccione una opción:
┇ ┆1. Con código QR
┇ ┆2. Con código de texto de 8 dígitos
┇ ╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈╾
┗╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⚃
\n❑➙➔ `);
    opcion = await question(prompt);
    if (!/^[1-2]$/.test(opcion)) {
      console.log(chalk.bold.redBright(`ム ʕ˖͜͡˖ʔ Solo se permiten los números 1 o 2.`));
    }
  } while (opcion !== '1' && opcion !== '2');
}

const connectionOptions = {
  logger: pino({ level: 'silent' }), 
  printQRInTerminal: opcion === '1' || methodCodeQR,
  mobile: MethodMobile,
  browser: Browsers.macOS("Chrome"),
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
  },
  markOnlineOnConnect: false,
  generateHighQualityLinkPreview: false,
  syncFullHistory: false,
  getMessage: async (key) => {
    try {
      let jid = jidNormalizedUser(key.remoteJid);
      let msg = await store.loadMessage(jid, key.id);
      return msg?.message || "";
    } catch (error) {
      return "";
    }
  },
  msgRetryCounterCache,
  defaultQueryTimeoutMs: undefined,
  cachedGroupMetadata: (jid) => globalThis.conn.chats[jid] ?? {},
  version: version,
  keepAliveIntervalMs: 50000,
  maxIdleTimeMs: 60000 * 2,
};

global.conn = makeWASocket(connectionOptions);
protoType();
serialize();

if (!existsSync(`./${sessions}/creds.json`) && (opcion === '2' || methodCode)) {
  opcion = '2';
  if (!conn.authState.creds.registered) {
    let addNumber;
    if (!!phoneNumber) {
      addNumber = phoneNumber.replace(/[^0-9]/g, '');
    } else {
      let valid = false;
      do {
        phoneNumber = await question(chalk.bgBlack(chalk.bold.greenBright(`[ ♛ ] Ingrese el número de WhatsApp.\n${chalk.bold.magentaBright('---> ')}`)));
        phoneNumber = phoneNumber.replace(/\D/g, '');
        if (!phoneNumber.startsWith('+')) phoneNumber = `+${phoneNumber}`;
        valid = await isValidPhoneNumber(phoneNumber);
      } while (!valid);
      rl.close();
      addNumber = phoneNumber.replace(/\D/g, '');
      setTimeout(async () => {
        let codeBot = await conn.requestPairingCode(addNumber);
        codeBot = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot;
        console.log(chalk.bold.white(chalk.bgMagenta(`[ ʕ˖͜͡˖ʔ ] Código:`)), chalk.bold.white(chalk.white(codeBot)));
      }, 3000);
    }
  }
}

conn.isInit = false;
conn.well = false;
conn.logger.info(`[ ⌨ ] H E C H O\n`);

if (!opts['test']) {
  if (global.db) setInterval(async () => {
    if (global.db.data) await global.db.write();
    if (opts['autocleartmp'] && (global.support || {}).find) {
      try {
        const tmpDirs = [tmpdir(), join(CURRENT_DIR, 'tmp'), join(CURRENT_DIR, `${jadi}`)];
        tmpDirs.forEach((dir) => {
          spawn('find', [dir, '-amin', '3', '-type', 'f', '-delete'], { stdio: 'ignore' });
        });
      } catch (e) {}
    }
  }, 30000);
}

async function resolveLidToRealJid(lidJid, groupJid) {
    if (!lidJid?.endsWith("@lid")) return lidJid?.includes("@") ? lidJid : `${lidJid}@s.whatsapp.net`;
    const cached = lidCache.get(lidJid);
    if (cached) return cached;
    lidCache.set(lidJid, lidJid);
    return lidJid;
}

async function processLidsInMessage(message, groupJid) {
    if (!message || !message.key) return message;
    try {
        const remoteJid = message.key.remoteJid || groupJid;
        const msgCopy = { key: { ...message.key }, message: message.message ? { ...message.message } : undefined };

        if (msgCopy.key?.participant?.endsWith('@lid')) {
            msgCopy.key.participant = await resolveLidToRealJid(msgCopy.key.participant, remoteJid);
        }

        const contextInfo = msgCopy.message?.extendedTextMessage?.contextInfo || msgCopy.message?.ephemeralMessage?.message?.extendedTextMessage?.contextInfo;

        if (contextInfo?.participant?.endsWith('@lid')) {
            contextInfo.participant = await resolveLidToRealJid(contextInfo.participant, remoteJid);
        }
        return msgCopy;

    } catch (e) {
        return message;
    }
}

async function connectionUpdate(update) {
    const { connection, lastDisconnect, isNewLogin } = update;
    global.stopped = connection;
    if (isNewLogin) conn.isInit = true;

    const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
    if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
        await global.reloadHandler(true);
        global.timestamp.connect = new Date;
    }
    if (global.db.data == null) loadDatabase();
    
    if (connection === "open") {
        const userName = conn.user.name || conn.user.verifiedName || "Desconocido";
        console.log(chalk.green.bold(`[ ☊ ] Conectado a: ${userName}`));
    }
    
    let reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
    if (connection === 'close') {
        const errorMap = {
            [DisconnectReason.badSession]: `\n⚠︎ Sin conexión, borra la session principal del Bot, y conectate nuevamente.`,
            [DisconnectReason.connectionClosed]: `\n♻ Reconectando la conexión del Bot...`,
            [DisconnectReason.connectionLost]: `\n⚠︎ Conexión perdida con el servidor, reconectando el Bot...`,
            [DisconnectReason.connectionReplaced]: `\nꗇ La conexión del Bot ha sido reemplazada.`,
            [DisconnectReason.loggedOut]: `\n⚠︎ Sin conexión, borra la session principal del Bot, y conectate nuevamente.`,
            [DisconnectReason.restartRequired]: `\n♻ Conectando el Bot con el servidor...`,
            [DisconnectReason.timedOut]: `\n♻ Conexión agotada, reconectando el Bot...`,
        };
        const message = errorMap[reason] || `\n⚠︎ Conexión cerrada.`;
        console.log(chalk.bold.redBright(message));
        await global.reloadHandler(true);
    }
}

process.on('uncaughtException', console.error);
let isInit = true;
let handler = await import('./handler.js');

global.reloadHandler = async function(restatConn) {
    try {
        const Handler = await import(`./handler.js?update=${Date.now()}`).catch(() => {});
        if (Object.keys(Handler || {}).length) handler = Handler;
    } catch (e) {
    }

    if (restatConn) {
        const oldChats = global.conn.chats;
        try { global.conn.ws.close(); } catch {}
        conn.ev.removeAllListeners();
        global.conn = makeWASocket(connectionOptions, { chats: oldChats });
        isInit = true;
    }
    
    if (!isInit) {
        conn.ev.off('messages.upsert', conn.handler);
        conn.ev.off('connection.update', conn.connectionUpdate);
        conn.ev.off('creds.update', conn.credsUpdate);
    }

    conn.handler = handler.handler.bind(global.conn);
    conn.connectionUpdate = connectionUpdate.bind(global.conn);
    conn.credsUpdate = saveCreds.bind(global.conn, true);

    conn.ev.on('messages.upsert', conn.handler);
    conn.ev.on('connection.update', conn.connectionUpdate);
    conn.ev.on('creds.update', conn.credsUpdate);
    isInit = false;
    return true;
};

setInterval(() => {
    console.log('[ ↻ ] Reiniciando...');
    process.exit(0);
}, 10800000);

function clearTmp() {
    try {
        const tmpDir = join(CURRENT_DIR, 'tmp');
        if (!existsSync(tmpDir)) return;
        readdirSync(tmpDir).forEach(file => {
            const filePath = join(tmpDir, file);
            if (statSync(filePath).isFile()) unlinkSync(filePath);
        });
    } catch (e) {
    }
}

function purgeSession() {
    try {
        const sessionPath = join(CURRENT_DIR, global.sessions);
        readdirSync(sessionPath).forEach(file => {
            if (file.startsWith('pre-key-') || file.startsWith('session-') || file.startsWith('sender-key-')) {
                unlinkSync(join(sessionPath, file));
            }
        });
    } catch (e) {
    }
}

setInterval(async () => {
    if (global.stopped === 'close' || !conn || !conn.user) return;
    await clearTmp();
    console.log(chalk.bold.cyanBright(`\n⌦ Archivos de la carpeta TMP no necesarios han sido eliminados del servidor.`));
}, 1000 * 60 * 10);

setInterval(async () => {
    if (global.stopped === 'close' || !conn || !conn.user) return;
    await purgeSession();
    console.log(chalk.bold.cyanBright(`\n⌦ Archivos de la carpeta ${global.sessions} no necesario han sido eliminados del servidor.`));
}, 1000 * 60 * 10);

const pluginFolder = join(CURRENT_DIR, './plugins');
const pluginFilter = (filename) => /\.js$/.test(filename);
global.plugins = {};

async function readRecursive(folder) {
  for (const filename of readdirSync(folder)) {
    const file = join(folder, filename);
    const stats = statSync(file);

    if (stats.isDirectory()) {
      await readRecursive(file);
    } else if (pluginFilter(filename)) {
      try {
        const pluginPath = file.replace(pluginFolder + path.sep, '');
        const module = await import(global.__filename(file));
        global.plugins[pluginPath] = module.default || module;
      } catch (e) {
        delete global.plugins[filename];
      }
    }
  }
}

async function filesInit() {
  await readRecursive(pluginFolder);
}

filesInit().then((_) => Object.keys(global.plugins)).catch(() => {});

global.reload = async (_ev, filename) => {
  const pluginPath = filename.replace(pluginFolder + path.sep, '');
  if (pluginFilter(filename)) {
    const dir = global.__filename(join(pluginFolder, filename), true);
    if (pluginPath in global.plugins) {
      if (!existsSync(dir)) {
        return delete global.plugins[pluginPath];
      }
    }
    const err = syntaxerror(readFileSync(dir), filename, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true,
    });
    if (err) conn.logger.error(`syntax error while loading '${pluginPath}'\n${format(err)}`);
    else {
      try {
        const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`));
        global.plugins[pluginPath] = module.default || module;
      } catch (e) {
      } finally {
        global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)));
      }
    }
  }
};

Object.freeze(global.reload);
watch(pluginFolder, { recursive: true }, global.reload);
await global.reloadHandler();

async function isValidPhoneNumber(number) {
    try {
        const parsedNumber = phoneUtil.parseAndKeepRawInput(number.replace(/\s+/g, ''));
        return phoneUtil.isValidNumber(parsedNumber);
    } catch (error) {
        return false;
    }
}

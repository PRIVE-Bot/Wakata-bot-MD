
/*⚠ PROHIBIDO EDITAR ⚠
Este codigo fue modificado, adaptado y mejorado por
- ReyEndymion >> https://github.com/ReyEndymion
El codigo de este archivo esta inspirado en el codigo original de:
- Aiden_NotLogic >> https://github.com/ferhacks
*El archivo original del MysticBot-MD fue liberado en mayo del 2024 aceptando su liberacion*
El codigo de este archivo fue parchado en su momento por:
- BrunoSobrino >> https://github.com/BrunoSobrino
Contenido adaptado por:
- GataNina-Li >> https://github.com/GataNina-Li
- elrebelde21 >> https://github.com/elrebelde21
*/

/*const { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion} = (await import("@whiskeysockets/baileys"));
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import util from 'util' 
import * as ws from 'ws'
const { child, spawn, exec } = await import('child_process')
const { CONNECTING } = ws
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'
let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"
let drm1 = ""
let drm2 = ""
let rtx = "*⛩️✦ ↫ 𝐍𝐚𝐫𝐮𝐭𝐨 - 𝐁𝐨𝐭 - 𝐌𝐃 ↬ ✦⛩️*\n\n🍥 𝐌𝐨𝐝𝐨 𝐐𝐑 - 𝐒𝐮𝐛-𝐁𝐨𝐭 𝐓𝐞𝐦𝐩𝐨𝐫𝐚𝐥 🍥\n\n🔥 Escanea este código con otro celular o en tu PC para convertirte en un *Shinobi Sub-Bot* temporal.\n\n\`1\` » Haz clic en los tres puntos (⋮) arriba a la derecha\n\`2\` » Toca *Dispositivos vinculados*\n\`3\` » Escanea este código QR para iniciar sesión con el bot\n\n⚠️ ¡Este QR se autodestruirá en 45 segundos!\n> *sɪɢᴜᴇ ᴇʟ ᴄᴀɴᴀʟ ᴏғɪᴄɪᴀʟ:*\n> whatsapp.com/channel/0029VbAzn9GGU3BQw830eA0F"
let rtx2 = `┌─────────────── ⛩️🍃
│ 🍜 𝐍𝐚𝐫𝐮𝐭𝐨 - 𝐁𝐨𝐭 - 𝐌𝐃 🍥
└─────────────── ⛩️🍃

🎌 *𝐌𝐨𝐝𝐨 𝐂ó𝐝𝐢𝐠𝐨 - 𝐒𝐮𝐛-𝐁𝐨𝐭 𝐓𝐞𝐦𝐩𝐨𝐫𝐚𝐥* 🎯

📲 Usa este código ninja secreto para vincularte al sistema del Hokage:

➊ Ve a los tres puntos ⋮ en la esquina superior derecha  
➋ Toca *"Dispositivos vinculados"*  
➌ Elige *"Vincular con número de teléfono"*  
➍ Ingresa el código de conexión y prepárate para la acción

⚠️ *¡Alerta Shinobi!*  
Este código se desvanece como un clon de sombra en *5 segundos* ⏱️

🍃 *¡El camino del ninja comienza aquí, joven genin!* 💥
> *sɪɢᴜᴇ ᴇʟ ᴄᴀɴᴀʟ ᴏғɪᴄɪᴀʟ:*
> whatsapp.com/channel/0029VbAzn9GGU3BQw830eA0F`

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const JBOptions = {}
if (global.conns instanceof Array) console.log()
else global.conns = []
let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
if (!globalThis.db.data.settings[conn.user.jid].jadibotmd) return m.reply(`♡ Comando desactivado temporalmente.`)
let time = global.db.data.users[m.sender].Subs + 120000
//if (new Date - global.db.data.users[m.sender].Subs < 120000) return conn.reply(m.chat, `${emoji} Debes esperar ${msToTime(time - new Date())} para volver a vincular un *Sub-Bot.*`, m)
const subBots = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])]
const subBotsCount = subBots.length
if (subBotsCount === 20) {
return m.reply(`${emoji2} No se han encontrado espacios para *Sub-Bots* disponibles.`)
}
/*if (Object.values(global.conns).length === 30) {
return m.reply(`${emoji2} No se han encontrado espacios para *Sub-Bots* disponibles.`)
}*/
/*let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let id = `${who.split`@`[0]}`  //conn.getName(who)
let pathJadiBot = path.join(`./${jadi}/`, id)
if (!fs.existsSync(pathJadiBot)){
fs.mkdirSync(pathJadiBot, { recursive: true })
}
JBOptions.pathJadiBot = pathJadiBot
JBOptions.m = m
JBOptions.conn = conn
JBOptions.args = args
JBOptions.usedPrefix = usedPrefix
JBOptions.command = command
JBOptions.fromCommand = true
JadiBot(JBOptions)
global.db.data.users[m.sender].Subs = new Date * 1
} 
handler.help = ['qr', 'code']
handler.tags = ['serbot']
handler.command = ['qr', 'code']
export default handler 

export async function JadiBot(options) {
let { pathJadiBot, m, conn, args, usedPrefix, command } = options
if (command === 'code') {
command = 'qr'; 
args.unshift('code')}
const mcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : args[1] && /(--code|code)/.test(args[1].trim()) ? true : false
let txtCode, codeBot, txtQR
if (mcode) {
args[0] = args[0].replace(/^--code$|^code$/, "").trim()
if (args[1]) args[1] = args[1].replace(/^--code$|^code$/, "").trim()
if (args[0] == "") args[0] = undefined
}
const pathCreds = path.join(pathJadiBot, "creds.json")
if (!fs.existsSync(pathJadiBot)){
fs.mkdirSync(pathJadiBot, { recursive: true })}
try {
args[0] && args[0] != undefined ? fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : ""
} catch {
conn.reply(m.chat, `${emoji} Use correctamente el comando » ${usedPrefix + command} code`, m)
return
}

const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64")
exec(comb.toString("utf-8"), async (err, stdout, stderr) => {
const drmer = Buffer.from(drm1 + drm2, `base64`)

let { version, isLatest } = await fetchLatestBaileysVersion()
const msgRetry = (MessageRetryMap) => { }
const msgRetryCache = new NodeCache()
const { state, saveState, saveCreds } = await useMultiFileAuthState(pathJadiBot)

const connectionOptions = {
logger: pino({ level: "fatal" }),
printQRInTerminal: false,
auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) },
msgRetry,
msgRetryCache,
browser: mcode ? ['Ubuntu', 'Chrome', '110.0.5585.95'] : ['Bot(Sub Bot)', 'Chrome','2.0.0'],
version: version,
generateHighQualityLinkPreview: true
};*/

/*const connectionOptions = {
printQRInTerminal: false,
logger: pino({ level: 'silent' }),
auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) },
msgRetry,
msgRetryCache,
version: [2, 3000, 1015901307],
syncFullHistory: true,
browser: mcode ? ['Ubuntu', 'Chrome', '110.0.5585.95'] : ['Bot (Sub Bot)', 'Chrome','2.0.0'],
defaultQueryTimeoutMs: undefined,
getMessage: async (key) => {
if (store) {
//const msg = store.loadMessage(key.remoteJid, key.id)
//return msg.message && undefined
} return {
conversation: 'Bot',
}}}*/

/*let sock = makeWASocket(connectionOptions)
sock.isInit = false
let isInit = true

async function connectionUpdate(update) {
const { connection, lastDisconnect, isNewLogin, qr } = update
if (isNewLogin) sock.isInit = false
if (qr && !mcode) {
if (m?.chat) {
txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx.trim()}, { quoted: m})
} else {
return 
}
if (txtQR && txtQR.key) {
setTimeout(() => { conn.sendMessage(m.sender, { delete: txtQR.key })}, 30000)
}
return
} 
if (qr && mcode) {
let secret = await sock.requestPairingCode((m.sender.split`@`[0]))
secret = secret.match(/.{1,4}/g)?.join("-")
//if (m.isWABusiness) {
txtCode = await conn.sendMessage(m.chat, {text : rtx2}, { quoted: m })
codeBot = await m.reply(secret)
//} else {
//txtCode = await conn.sendButton(m.chat, rtx2.trim(), wm, null, [], secret, null, m) 
//}
console.log(secret)
}
if (txtCode && txtCode.key) {
setTimeout(() => { conn.sendMessage(m.sender, { delete: txtCode.key })}, 30000)
}
if (codeBot && codeBot.key) {
setTimeout(() => { conn.sendMessage(m.sender, { delete: codeBot.key })}, 30000)
}
const endSesion = async (loaded) => {
if (!loaded) {
try {
sock.ws.close()
} catch {
}
sock.ev.removeAllListeners()
let i = global.conns.indexOf(sock)                
if (i < 0) return 
delete global.conns[i]
global.conns.splice(i, 1)
}}

const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
if (connection === 'close') {
if (reason === 428) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${path.basename(pathJadiBot)}) fue cerrada inesperadamente. Intentando reconectar...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
await creloadHandler(true).catch(console.error)
}
if (reason === 408) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${path.basename(pathJadiBot)}) se perdió o expiró. Razón: ${reason}. Intentando reconectar...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
await creloadHandler(true).catch(console.error)
}
if (reason === 440) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${path.basename(pathJadiBot)}) fue reemplazada por otra sesión activa.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
try {
if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(pathJadiBot)}@s.whatsapp.net`, {text : '*HEMOS DETECTADO UNA NUEVA SESIÓN, BORRE LA NUEVA SESIÓN PARA CONTINUAR*\n\n> *SI HAY ALGÚN PROBLEMA VUELVA A CONECTARSE*' }, { quoted: m || null }) : ""
} catch (error) {
console.error(chalk.bold.yellow(`Error 440 no se pudo enviar mensaje a: +${path.basename(pathJadiBot)}`))
}}
if (reason == 405 || reason == 401) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La sesión (+${path.basename(pathJadiBot)}) fue cerrada. Credenciales no válidas o dispositivo desconectado manualmente.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
try {
if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(pathJadiBot)}@s.whatsapp.net`, {text : '*SESIÓN PENDIENTE*\n\n> *INTENTÉ NUEVAMENTE VOLVER A SER SUB-BOT*' }, { quoted: m || null }) : ""
} catch (error) {
console.error(chalk.bold.yellow(`Error 405 no se pudo enviar mensaje a: +${path.basename(pathJadiBot)}`))
}
fs.rmdirSync(pathJadiBot, { recursive: true })
}
if (reason === 500) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Conexión perdida en la sesión (+${path.basename(pathJadiBot)}). Borrando datos...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
if (options.fromCommand) m?.chat ? await conn.sendMessage(`${path.basename(pathJadiBot)}@s.whatsapp.net`, {text : '*CONEXIÓN PÉRDIDA*\n\n> *INTENTÉ MANUALMENTE VOLVER A SER SUB-BOT*' }, { quoted: m || null }) : ""
return creloadHandler(true).catch(console.error)
//fs.rmdirSync(pathJadiBot, { recursive: true })
}
if (reason === 515) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Reinicio automático para la sesión (+${path.basename(pathJadiBot)}).\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
await creloadHandler(true).catch(console.error)
}
if (reason === 403) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Sesión cerrada o cuenta en soporte para la sesión (+${path.basename(pathJadiBot)}).\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
fs.rmdirSync(pathJadiBot, { recursive: true })
}}
if (global.db.data == null) loadDatabase()
if (connection == `open`) {
if (!global.db.data?.users) loadDatabase()
let userName, userJid 
userName = sock.authState.creds.me.name || 'Anónimo'
userJid = sock.authState.creds.me.jid || `${path.basename(pathJadiBot)}@s.whatsapp.net`
console.log(chalk.bold.cyanBright(`\n❒⸺⸺⸺⸺【• SUB-BOT •】⸺⸺⸺⸺❒\n│\n│ 🟢 ${userName} (+${path.basename(pathJadiBot)}) conectado exitosamente.\n│\n❒⸺⸺⸺【• CONECTADO •】⸺⸺⸺❒`))
sock.isInit = true
global.conns.push(sock)
await joinChannels(sock)

m?.chat ? await conn.sendMessage(m.chat, {text: args[0] ? `@${m.sender.split('@')[0]}, ya estás conectado, leyendo mensajes entrantes...` : ` Bienvenido @${m.sender.split('@')[0]}, a la familia de ${botname} disfruta del bot.\n\n\n> ${dev}`, mentions: [m.sender]}, { quoted: m }) : ''

}}
setInterval(async () => {
if (!sock.user) {
try { sock.ws.close() } catch (e) {      
//console.log(await creloadHandler(true).catch(console.error))
}
sock.ev.removeAllListeners()
let i = global.conns.indexOf(sock)                
if (i < 0) return
delete global.conns[i]
global.conns.splice(i, 1)
}}, 60000)

let handler = await import('../handler.js')
let creloadHandler = async function (restatConn) {
try {
const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
if (Object.keys(Handler || {}).length) handler = Handler

} catch (e) {
console.error('⚠️ Nuevo error: ', e)
}
if (restatConn) {
const oldChats = sock.chats
try { sock.ws.close() } catch { }
sock.ev.removeAllListeners()
sock = makeWASocket(connectionOptions, { chats: oldChats })
isInit = true
}
if (!isInit) {
sock.ev.off("messages.upsert", sock.handler)
sock.ev.off("connection.update", sock.connectionUpdate)
sock.ev.off('creds.update', sock.credsUpdate)
}

sock.handler = handler.handler.bind(sock)
sock.connectionUpdate = connectionUpdate.bind(sock)
sock.credsUpdate = saveCreds.bind(sock, true)
sock.ev.on("messages.upsert", sock.handler)
sock.ev.on("connection.update", sock.connectionUpdate)
sock.ev.on("creds.update", sock.credsUpdate)
isInit = false
return true
}
creloadHandler(false)
})
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
function sleep(ms) {
return new Promise(resolve => setTimeout(resolve, ms));}
function msToTime(duration) {
var milliseconds = parseInt((duration % 1000) / 100),
seconds = Math.floor((duration / 1000) % 60),
minutes = Math.floor((duration / (1000 * 60)) % 60),
hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
hours = (hours < 10) ? '0' + hours : hours
minutes = (minutes < 10) ? '0' + minutes : minutes
seconds = (seconds < 10) ? '0' + seconds : seconds
return minutes + ' m y ' + seconds + ' s '
}

async function joinChannels(conn) {
for (const channelId of Object.values(global.ch)) {
await conn.newsletterFollow(channelId).catch(() => {})
}}*/





import { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } from "@whiskeysockets/baileys";
import qrcode from "qrcode";
import NodeCache from "node-cache";
import fs from "fs";
import path from "path";
import pino from 'pino';
import chalk from 'chalk';
import * as ws from 'ws';
import { spawn } from 'child_process';
import { makeWASocket } from '../lib/simple.js';
import { fileURLToPath } from 'url';

// --- Textos estáticos para mensajes, optimizados para legibilidad y consistencia ---
const QR_MESSAGE = `
*⛩️✦ ↫ 𝐍𝐚𝐫𝐮𝐭𝐨 - 𝐁𝐨𝐭 - 𝐌𝐃 ↬ ✦⛩️*

🍥 *Modo QR - Sub-Bot Temporal* 🍥

🔥 Escanea este código con otro celular o en tu PC para convertirte en un *Shinobi Sub-Bot* temporal.

\`1\` » Haz clic en los tres puntos (⋮) arriba a la derecha
\`2\` » Toca *Dispositivos vinculados*
\`3\` » Escanea este código QR para iniciar sesión con el bot

⚠️ ¡Este QR se autodestruirá en 45 segundos!
> *sɪɢᴜᴇ ᴇʟ ᴄᴀɴᴀʟ ᴏғɪᴄɪᴀʟ:*
> whatsapp.com/channel/0029VbAzn9GGU3BQw830eA0F
`;

const CODE_MESSAGE = `
┌─────────────── ⛩️🍃
│ 🍜 *𝐍𝐚𝐫𝐮𝐭𝐨 - 𝐁𝐨𝐭 - 𝐌𝐃* 🍥
└─────────────── ⛩️🍃

🎌 *Modo Código - Sub-Bot Temporal* 🎯

📲 Usa este código ninja secreto para vincularte al sistema del Hokage:

➊ Ve a los tres puntos ⋮ en la esquina superior derecha  
➋ Toca *"Dispositivos vinculados"* ➌ Elige *"Vincular con número de teléfono"* ➍ Ingresa el código de conexión y prepárate para la acción

⚠️ *¡Alerta Shinobi!* Este código se desvanece como un clon de sombra en *45 segundos* ⏱️

🍃 *¡El camino del ninja comienza aquí, joven genin!* 💥
> *sɪɢᴜᴇ ᴇʟ ᴄᴀɴᴀʟ ᴏғɪᴄɪᴀʟ:*
> whatsapp.com/channel/0029VbAzn9GGU3BQw830eA0F
`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JB_OPTIONS = {};

if (!global.conns) {
  global.conns = [];
}

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
  if (!global.db.data.settings[conn.user.jid].jadibotmd) {
    return m.reply(`♡ Comando desactivado temporalmente.`);
  }

  const subBots = global.conns.filter(conn => conn.user && conn.ws.socket?.readyState !== ws.CLOSED);
  if (subBots.length >= 20) {
    return m.reply(`🈴 No se han encontrado espacios para *Sub-Bots* disponibles.`);
  }

  const mcode = args[0]?.trim() === 'code';
  const id = m.sender.split('@')[0];
  const pathJadiBot = path.join(`./jadi/${id}`);

  // Preparar opciones de forma más limpia
  JB_OPTIONS.pathJadiBot = pathJadiBot;
  JB_OPTIONS.m = m;
  JB_OPTIONS.conn = conn;
  JB_OPTIONS.args = args;
  JB_OPTIONS.usedPrefix = usedPrefix;
  JB_OPTIONS.command = command;
  JB_OPTIONS.fromCommand = true;
  JB_OPTIONS.mcode = mcode;

  await JadiBot(JB_OPTIONS);
};

handler.help = ['qr', 'code'];
handler.tags = ['serbot'];
handler.command = ['qr', 'code'];

export default handler;

export async function JadiBot(options) {
  const { pathJadiBot, m, conn, mcode } = options;

  if (!fs.existsSync(pathJadiBot)) {
    fs.mkdirSync(pathJadiBot, { recursive: true });
  }

  const { version } = await fetchLatestBaileysVersion();
  const { state, saveCreds } = await useMultiFileAuthState(pathJadiBot);
  const msgRetryCache = new NodeCache();

  const connectionOptions = {
    logger: pino({ level: "fatal" }),
    printQRInTerminal: false,
    auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
    msgRetryCache,
    browser: mcode ? ['Ubuntu', 'Chrome', '110.0.5585.95'] : ['Bot(Sub Bot)', 'Chrome', '2.0.0'],
    version,
    generateHighQualityLinkPreview: true,
  };

  const sock = makeWASocket(connectionOptions);
  let isInit = true;

  async function connectionUpdate(update) {
    const { connection, lastDisconnect, qr, isNewLogin } = update;

    if (isNewLogin) {
      sock.isInit = false;
    }

    // --- Manejo de QR y Código de emparejamiento con temporizador ---
    if (qr) {
      if (mcode) {
        const secret = await sock.requestPairingCode(m.sender.split('@')[0]);
        const formattedSecret = secret.match(/.{1,4}/g)?.join("-");
        const codeMsg = await m.reply(formattedSecret);
        m.reply(CODE_MESSAGE);
        setTimeout(() => conn.sendMessage(m.chat, { delete: codeMsg.key }), 45000);
      } else {
        const qrMsg = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: QR_MESSAGE }, { quoted: m });
        setTimeout(() => conn.sendMessage(m.chat, { delete: qrMsg.key }), 45000);
      }
      return;
    }

    const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;

    // --- Manejo de cierres de conexión más eficiente ---
    if (connection === 'close') {
      console.error(chalk.bold.red(`\n[ERROR DE CONEXIÓN] Sesión: +${path.basename(pathJadiBot)} - Razón: ${reason}`));

      const handleDisconnection = async (action, message) => {
        try {
          if (m?.chat) {
            await conn.sendMessage(`${path.basename(pathJadiBot)}@s.whatsapp.net`, { text: message }, { quoted: m });
          }
        } catch (error) {
          console.error(chalk.bold.yellow(`Error al enviar mensaje a: +${path.basename(pathJadiBot)}`));
        }
        if (action === 'reload') {
          await creloadHandler(true);
        } else if (action === 'delete') {
          fs.rmdirSync(pathJadiBot, { recursive: true });
        }
      };

      switch (reason) {
        case DisconnectReason.connectionClosed:
        case DisconnectReason.connectionLost:
          console.log(chalk.bold.magentaBright(`Reconectando...`));
          await handleDisconnection('reload', 'La conexión se perdió o expiró. Reconectando...');
          break;
        case DisconnectReason.loggedOut:
        case DisconnectReason.badSession:
          console.log(chalk.bold.magentaBright(`Sesión cerrada o credenciales no válidas.`));
          await handleDisconnection('delete', 'Tu sesión ha sido cerrada. Conéctate de nuevo.');
          break;
        case DisconnectReason.connectionReplaced:
          console.log(chalk.bold.magentaBright(`Sesión reemplazada.`));
          await handleDisconnection('reload', 'Tu sesión ha sido reemplazada por una nueva. Borra la nueva para continuar.');
          break;
        case DisconnectReason.connectionTimeout:
          console.log(chalk.bold.magentaBright(`Tiempo de conexión agotado. Borrando datos...`));
          await handleDisconnection('reload', 'Tiempo de conexión agotado. Por favor, intenta de nuevo.');
          break;
        default:
          console.log(chalk.bold.magentaBright(`Error desconocido (${reason}). Intentando reconectar...`));
          await handleDisconnection('reload', 'Ocurrió un error. Intentando reconectar...');
          break;
      }
    } else if (connection === 'open') {
      console.log(chalk.bold.cyanBright(`\n❒⸺⸺⸺⸺【• SUB-BOT •】⸺⸺⸺⸺❒`));
      console.log(chalk.bold.cyanBright(`│ 🟢 ${sock.authState.creds.me.name} (+${path.basename(pathJadiBot)}) conectado.`));
      console.log(chalk.bold.cyanBright(`❒⸺⸺⸺【• CONECTADO •】⸺⸺⸺❒`));
      
      sock.isInit = true;
      global.conns.push(sock);
      
      try {
        await conn.sendMessage(m.chat, { 
          text: `Bienvenido @${m.sender.split('@')[0]}, a la familia. Disfruta del bot.`, 
          mentions: [m.sender] 
        }, { quoted: m });
      } catch (e) {}

      await joinChannels(sock);
    }
  }

  // --- Limpieza de conexiones inactivas más robusta ---
  setInterval(() => {
    if (!sock.user && sock.ws.socket?.readyState !== ws.OPEN) {
      try { sock.ws.close(); } catch (e) {}
      sock.ev.removeAllListeners();
      const i = global.conns.indexOf(sock);
      if (i > -1) {
        global.conns.splice(i, 1);
      }
    }
  }, 60000);

  const creloadHandler = async (restatConn) => {
    const handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error);
    if (!isInit) {
      sock.ev.off("messages.upsert", sock.handler);
      sock.ev.off("connection.update", sock.connectionUpdate);
      sock.ev.off('creds.update', sock.credsUpdate);
    }

    if (restatConn) {
      const oldChats = sock.chats;
      try { sock.ws.close(); } catch {}
      sock.ev.removeAllListeners();
      sock = makeWASocket(connectionOptions, { chats: oldChats });
      isInit = true;
    }

    sock.handler = handler.handler.bind(sock);
    sock.connectionUpdate = connectionUpdate.bind(sock);
    sock.credsUpdate = saveCreds.bind(sock, true);
    sock.ev.on("messages.upsert", sock.handler);
    sock.ev.on("connection.update", sock.connectionUpdate);
    sock.ev.on("creds.update", sock.credsUpdate);
    isInit = false;
  };
  
  await creloadHandler(false);
}

// --- Funciones auxiliares simplificadas y eficientes ---
async function joinChannels(conn) {
  for (const channelId of Object.values(global.ch)) {
    await conn.newsletterFollow(channelId).catch(() => {});
  }
}

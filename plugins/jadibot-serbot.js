
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

let sock = makeWASocket(connectionOptions)
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
import { makeWASocket } from '../lib/simple.js';
import * as ws from 'ws';
import { fileURLToPath } from 'url';

const { CONNECTING } = ws;

const rtx = "*⛩️✦ ↫ 𝐍𝐚𝐫𝐮𝐭𝐨 - 𝐁𝐨𝐭 - 𝐌𝐃 ↬ ✦⛩️*\n\n🍥 𝐌𝐨𝐝𝐨 𝐐𝐑 - 𝐒𝐮𝐛-𝐁𝐨𝐭 𝐓𝐞𝐦𝐩𝐨𝐫𝐚𝐥 🍥\n\n🔥 Escanea este código con otro celular o en tu PC para convertirte en un *Shinobi Sub-Bot* temporal.\n\n\`1\` » Haz clic en los tres puntos (⋮) arriba a la derecha\n\`2\` » Toca *Dispositivos vinculados*\n\`3\` » Escanea este código QR para iniciar sesión con el bot\n\n⚠️ ¡Este QR se autodestruirá en 45 segundos!\n> *sɪɢᴜᴇ ᴇʟ ᴄᴀɴᴀʟ ᴏғɪᴄɪᴀʟ:*\n> whatsapp.com/channel/0029VbAzn9GGU3BQw830eA0F";
const rtx2 = `┌─────────────── ⛩️🍃
│ 🍜 𝐍𝐚𝐫𝐮𝐭𝐨 - 𝐁𝐨𝐭 - 𝐌𝐃 🍥
└─────────────── ⛩️🍃

🎌 *𝐌𝐨𝐝𝐨 𝐂ó𝐝𝐢𝐠𝐨 - 𝐒𝐮𝐛-𝐁𝐨𝐭 𝐓𝐞𝐦𝐩𝐨𝐫𝐚𝐥* 🎯

📲 Usa este código ninja secreto para vincularte al sistema del Hokage:

➊ Ve a los tres puntos ⋮ en la esquina superior derecha  
➋ Toca *"Dispositivos vinculados"* ➌ Elige *"Vincular con número de teléfono"* ➍ Ingresa el código de conexión y prepárate para la acción

⚠️ *¡Alerta Shinobi!* Este código se desvanece como un clon de sombra en *5 segundos* ⏱️

🍃 *¡El camino del ninja comienza aquí, joven genin!* 💥
> *sɪɢᴜᴇ ᴇ𝐥 ᴄᴀɴᴀʟ ᴏғɪᴄɪᴀʟ:*
> whatsapp.com/channel/0029VbAzn9GGU3BQw830eA0F`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JBOptions = {};
global.conns = global.conns || [];

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!globalThis.db.data.settings[conn.user.jid]?.jadibotmd) {
    return m.reply(`♡ Comando desactivado temporalmente.`);
  }

  const time = global.db.data.users[m.sender]?.Subs + 120000;
  if (new Date() - (global.db.data.users[m.sender]?.Subs || 0) < 120000) {
    return conn.reply(m.chat, ` Debes esperar ${msToTime(time - new Date())} para volver a vincular un *Sub-Bot.*`, m);
  }

  const subBotsCount = global.conns.filter(conn => conn.user && conn.ws.socket?.readyState !== ws.CLOSED).length;
  if (subBotsCount >= 20) {
    return m.reply(` No se han encontrado espacios para *Sub-Bots* disponibles.`);
  }

  const who = m.fromMe ? conn.user.jid : m.sender;
  const id = who.split('@')[0];
  const pathJadiBot = path.join(`./${jadi}/`, id);

  if (!fs.existsSync(pathJadiBot)) {
    fs.mkdirSync(pathJadiBot, { recursive: true });
  }

  JBOptions.pathJadiBot = pathJadiBot;
  JBOptions.m = m;
  JBOptions.conn = conn;
  JBOptions.args = args;
  JBOptions.usedPrefix = usedPrefix;
  JBOptions.command = command;
  JBOptions.fromCommand = true;

  await JadiBot(JBOptions);
  global.db.data.users[m.sender].Subs = new Date() * 1;
};

handler.help = ['qr', 'code'];
handler.tags = ['serbot'];
handler.command = ['qr', 'code'];

export default handler;

export async function JadiBot(options) {
  const { pathJadiBot, m, conn, args, usedPrefix, command } = options;
  let mcode = args.some(arg => /(--code|code)/.test(arg));

  if (mcode) {
    args = args.filter(arg => !/(--code|code)/.test(arg));
  }

  const pathCreds = path.join(pathJadiBot, "creds.json");
  if (!fs.existsSync(pathJadiBot)) {
    fs.mkdirSync(pathJadiBot, { recursive: true });
  }

  try {
    if (args[0]) {
      fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t'));
    }
  } catch (e) {
    conn.reply(m.chat, ` Use correctamente el comando » ${usedPrefix + command} code`, m);
    return;
  }

  let { version } = await fetchLatestBaileysVersion();
  const msgRetryCache = new NodeCache();
  const { state, saveState, saveCreds } = await useMultiFileAuthState(pathJadiBot);

  const connectionOptions = {
    logger: pino({ level: "fatal" }),
    printQRInTerminal: false,
    auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
    msgRetry: (MessageRetryMap) => ({}),
    msgRetryCache,
    browser: mcode ? ['Ubuntu', 'Chrome', '110.0.5585.95'] : ['Bot(Sub Bot)', 'Chrome', '2.0.0'],
    version: version,
    generateHighQualityLinkPreview: true
  };

  let sock = makeWASocket(connectionOptions);
  sock.isInit = false;
  let isInit = true;

  const connectionUpdate = async (update) => {
    const { connection, lastDisconnect, isNewLogin, qr } = update;
    if (isNewLogin) sock.isInit = false;

    if (qr && !mcode) {
      if (m?.chat) {
        const txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx.trim() }, { quoted: m });
        if (txtQR?.key) {
          setTimeout(() => { conn.sendMessage(m.sender, { delete: txtQR.key }); }, 30000);
        }
      }
      return;
    }

    if (qr && mcode) {
      const secret = (await sock.requestPairingCode(m.sender.split('@')[0])).match(/.{1,4}/g)?.join("-");
      const txtCode = await conn.sendMessage(m.chat, { text: rtx2 }, { quoted: m });
      const codeBot = await m.reply(secret);

      if (txtCode?.key) {
        setTimeout(() => { conn.sendMessage(m.sender, { delete: txtCode.key }); }, 30000);
      }
      if (codeBot?.key) {
        setTimeout(() => { conn.sendMessage(m.sender, { delete: codeBot.key }); }, 30000);
      }
      console.log(secret);
    }
    
    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
      console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Conexión (+${path.basename(pathJadiBot)}) cerrada. Razón: ${reason}.`));

      switch (reason) {
        case 428:
        case 408:
        case 515:
          console.log(`┆ Intentando reconectar...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`);
          await creloadHandler(true).catch(console.error);
          break;
        case 440:
          console.log(`┆ Reemplazada por otra sesión activa.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`);
          try {
            if (options.fromCommand) {
              await conn.sendMessage(`${path.basename(pathJadiBot)}@s.whatsapp.net`, { text: '*HEMOS DETECTADO UNA NUEVA SESIÓN, BORRE LA NUEVA SESIÓN PARA CONTINUAR*\n\n> *SI HAY ALGÚN PROBLEMA VUELVA A CONECTARSE*' }, { quoted: m || null });
            }
          } catch (error) {
            console.error(chalk.bold.yellow(`Error 440: no se pudo enviar mensaje a: +${path.basename(pathJadiBot)}`));
          }
          break;
        case 405:
        case 401:
        case 403:
          console.log(`┆ Credenciales no válidas, cerrando sesión.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`);
          try {
            if (options.fromCommand) {
              await conn.sendMessage(`${path.basename(pathJadiBot)}@s.whatsapp.net`, { text: '*SESIÓN PENDIENTE*\n\n> *INTENTÉ NUEVAMENTE VOLVER A SER SUB-BOT*' }, { quoted: m || null });
            }
          } catch (error) {
            console.error(chalk.bold.yellow(`Error ${reason}: no se pudo enviar mensaje a: +${path.basename(pathJadiBot)}`));
          }
          fs.rmdirSync(pathJadiBot, { recursive: true });
          break;
        case 500:
          console.log(`┆ Conexión perdida, borrando datos...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`);
          if (options.fromCommand) {
            await conn.sendMessage(`${path.basename(pathJadiBot)}@s.whatsapp.net`, { text: '*CONEXIÓN PÉRDIDA*\n\n> *INTENTÉ MANUALMENTE VOLVER A SER SUB-BOT*' }, { quoted: m || null });
          }
          await creloadHandler(true).catch(console.error);
          break;
        default:
          console.log(`╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`);
      }
    }

    if (connection === 'open') {
      if (!global.db.data?.users) await loadDatabase();
      const userName = sock.authState.creds.me.name || 'Anónimo';
      const userJid = sock.authState.creds.me.jid || `${path.basename(pathJadiBot)}@s.whatsapp.net`;
      console.log(chalk.bold.cyanBright(`\n❒⸺⸺⸺⸺【• SUB-BOT •】⸺⸺⸺⸺❒\n│\n│ 🟢 ${userName} (+${path.basename(pathJadiBot)}) conectado exitosamente.\n│\n❒⸺⸺⸺【• CONECTADO •】⸺⸺⸺❒`));
      sock.isInit = true;
      global.conns.push(sock);
      await joinChannels(sock);
      if (m?.chat) {
        await conn.sendMessage(m.chat, {
          text: args[0] ? `@${m.sender.split('@')[0]}, ya estás conectado, leyendo mensajes entrantes...` : ` Bienvenido @${m.sender.split('@')[0]}, a la familia de ${botname} disfruta del bot.\n\n\n> ${dev}`,
          mentions: [m.sender]
        }, { quoted: m });
      }
    }
  };

  setInterval(() => {
    if (!sock.user) {
      try { sock.ws.close(); } catch (e) {}
      sock.ev.removeAllListeners();
      const i = global.conns.indexOf(sock);
      if (i < 0) return;
      global.conns.splice(i, 1);
    }
  }, 60000);

  let handler = await import('../handler.js');
  const creloadHandler = async (restatConn) => {
    try {
      const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error);
      if (Object.keys(Handler || {}).length) handler = Handler;
    } catch (e) {
      console.error('⚠️ Nuevo error: ', e);
    }

    if (restatConn) {
      const oldChats = sock.chats;
      try { sock.ws.close(); } catch {}
      sock.ev.removeAllListeners();
      sock = makeWASocket(connectionOptions, { chats: oldChats });
      isInit = true;
    }

    if (!isInit) {
      sock.ev.off("messages.upsert", sock.handler);
      sock.ev.off("connection.update", sock.connectionUpdate);
      sock.ev.off('creds.update', sock.credsUpdate);
    }

    sock.handler = handler.handler.bind(sock);
    sock.connectionUpdate = connectionUpdate.bind(sock);
    sock.credsUpdate = saveCreds.bind(sock, true);
    sock.ev.on("messages.upsert", sock.handler);
    sock.ev.on("connection.update", sock.connectionUpdate);
    sock.ev.on("creds.update", sock.credsUpdate);
    isInit = false;
    return true;
  };

  creloadHandler(false);
}

function msToTime(duration) {
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let seconds = Math.floor((duration / 1000) % 60);
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  return `${minutes} m y ${seconds} s `;
}

async function joinChannels(conn) {
  for (const channelId of Object.values(global.ch)) {
    await conn.newsletterFollow(channelId).catch(() => {});
  }
}

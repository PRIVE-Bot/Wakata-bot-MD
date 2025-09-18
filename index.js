process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1' // ❌ ELIMINA ESTA LÍNEA ❌
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
import pino from 'pino'
import path, { join, dirname } from 'path'
import { Boom } from '@hapi/boom'
import { Low, JSONFile } from 'lowdb'
import { mongoDB, mongoDBV2 } from './lib/mongoDB.js'
import store from './lib/store.js'
import pkg from 'google-libphonenumber'
const { PhoneNumberUtil } = pkg
const phoneUtil = PhoneNumberUtil.getInstance()
const { proto, makeWASocket, protoType, serialize, DisconnectReason, useMultiFileAuthState, MessageRetryMap, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidNormalizedUser, Browsers } = await import('@whiskeysockets/baileys')
import readline, { createInterface } from 'readline'
import NodeCache from 'node-cache'
const { CONNECTING } = ws
const { chain } = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

// --- Nuevas Constantes para Estabilidad y Limpieza ---
const RESTART_INTERVAL_MS = 10800000; // 3 horas
const TMP_CLEAN_INTERVAL_MS = 1000 * 60 * 4; // 4 minutos
const SESSION_PURGE_INTERVAL_MS = 1000 * 60 * 10; // 10 minutos

// --- Estilos para la Consola ---
const style = {
  header: chalk.hex('#1E90FF').bold, // Azul
  title: chalk.hex('#00FFFF').bold, // Cyan
  info: chalk.hex('#FFFF00'), // Amarillo
  success: chalk.hex('#32CD32'), // Verde Lima
  warn: chalk.hex('#FFA500'), // Naranja
  error: chalk.hex('#FF0000') // Rojo
};

let { say } = cfonts
console.log(style.header('\n ...............[ INICIANDO BOT ]...............'))
say('BOT', {
  font: 'simple',
  align: 'left',
  gradient: ['green', 'white']
})
say('DEVELOPED BY DULCE', {
  font: 'console',
  align: 'center',
  colors: ['cyan', 'magenta', 'yellow']
})

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
};
global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true))
};
global.__require = function require(dir = import.meta.url) {
  return createRequire(dir)
}

global.timestamp = { start: new Date }
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
      }
    }, 1 * 1000))
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

const { state, saveState, saveCreds } = await useMultiFileAuthState(global.sessions)
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
    }
  } while (opcion !== '1' && opcion !== '2' || fs.existsSync(`./${sessions}/creds.json`))
}

const filterStrings = [
  "Q2xvc2luZyBzdGFsZSBvcGVu",
  "Q2xvc2luZyBvcGVuIHNlc3Npb24=",
  "RmFpbGVkIHRvIGRlY3J5cHQ=",
  "U2Vzc2lvbiBlcnJvcg==",
  "RXJyb3I6IEJhZCBNQUM=",
  "RGVjcnlwdGVkIG1lc3NhZ2U="
]

console.info = () => {}
console.debug = () => {}
['log', 'warn', 'error'].forEach(methodName => redefineConsoleMethod(methodName, filterStrings))

const connectionOptions = {
  logger: pino({ level: 'silent' }),
  printQRInTerminal: opcion == '1' ? true : methodCodeQR ? true : false,
  mobile: MethodMobile,
  browser: opcion == '1' ? Browsers.macOS("Desktop") : methodCodeQR ? Browsers.macOS("Desktop") : Browsers.macOS("Chrome"),
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
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
    }
  },
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
          phoneNumber = phoneNumber.replace(/\D/g, '')
          if (!phoneNumber.startsWith('+')) {
            phoneNumber = `+${phoneNumber}`
          }
        } while (!await isValidPhoneNumber(phoneNumber))
        rl.close()
        addNumber = phoneNumber.replace(/\D/g, '')
        setTimeout(async () => {
          let codeBot = await conn.requestPairingCode(addNumber)
          codeBot = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot
          console.log(style.info(`[ 🤖 ]  Código:`), style.success(codeBot))
        }, 3000)
      }
    }
  }
}
conn.isInit = false
conn.well = false
console.log(style.header(`\n[ ⌨ ]  CÓDIGO CARGADO`))
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
          }
        } catch (e) {
          continue
        }
      }
      lidCache.set(lidJid, lidJid)
      return lidJid
    } catch (e) {
      attempts++
      if (attempts >= maxRetries) {
        lidCache.set(lidJid, lidJid)
        return lidJid
      }
      await new Promise(resolve => setTimeout(resolve, retryDelay))
    }
  }
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
    }
  }
  return processedText
}

async function processLidsInMessage(message, groupJid) {
  if (!message || !message.key) return message
  try {
    const messageCopy = {
      key: { ...message.key
      },
      message: message.message ? { ...message.message
      } : undefined,
      ...(message.quoted && {
        quoted: { ...message.quoted
        }
      }),
      ...(message.mentionedJid && {
        mentionedJid: [...message.mentionedJid]
      })
    }
    const remoteJid = messageCopy.key.remoteJid || groupJid
    if (messageCopy.key?.participant?.endsWith('@lid')) {
      messageCopy.key.participant = await resolveLidToRealJid(messageCopy.key.participant, remoteJid)
    }
    if (messageCopy.message?.extendedTextMessage?.contextInfo?.participant?.endsWith('@lid')) {
      messageCopy.message.extendedTextMessage.contextInfo.participant = await resolveLidToRealJid(messageCopy.message.extendedTextMessage.contextInfo.participant, remoteJid)
    }
    if (messageCopy.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
      const mentionedJid = messageCopy.message.extendedTextMessage.contextInfo.mentionedJid
      if (Array.isArray(mentionedJid)) {
        for (let i = 0; i < mentionedJid.length; i++) {
          if (mentionedJid[i]?.endsWith('@lid')) {
            mentionedJid[i] = await resolveLidToRealJid(mentionedJid[i], remoteJid)
          }
        }
      }
    }
    if (messageCopy.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.contextInfo?.mentionedJid) {
      const quotedMentionedJid = messageCopy.message.extendedTextMessage.contextInfo.quotedMessage.extendedTextMessage.contextInfo.mentionedJid;
      if (Array.isArray(quotedMentionedJid)) {
        for (let i = 0; i < quotedMentionedJid.length; i++) {
          if (quotedMentionedJid[i]?.endsWith('@lid')) {
            quotedMentionedJid[i] = await resolveLidToRealJid(quotedMentionedJid[i], remoteJid)
          }
        }
      }
    }
    if (messageCopy.message?.conversation) {
      messageCopy.message.conversation = await extractAndProcessLids(messageCopy.message.conversation, remoteJid)
    }
    if (messageCopy.message?.extendedTextMessage?.text) {
      messageCopy.message.extendedTextMessage.text = await extractAndProcessLids(messageCopy.message.extendedTextMessage.text, remoteJid)
    }
    if (messageCopy.message?.extendedTextMessage?.contextInfo?.participant && !messageCopy.quoted) {
      const quotedSender = await resolveLidToRealJid(messageCopy.message.extendedTextMessage.contextInfo.participant, remoteJid);
      messageCopy.quoted = {
        sender: quotedSender,
        message: messageCopy.message.extendedTextMessage.contextInfo.quotedMessage
      }
    }
    return messageCopy
  } catch (e) {
    console.error('Error en processLidsInMessage:', e)
    return message
  }
}

async function connectionUpdate(update) {
  const { connection, lastDisconnect, isNewLogin } = update
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
      console.log(style.info(`[ ꗇ ] Escanea este código QR`))
    }
  }
  if (connection === "open") {
    const userJid = jidNormalizedUser(conn.user.id)
    const userName = conn.user.name || conn.user.verifiedName || "Desconocido"
    console.log(style.success(`\n[ ☊ ] CONECTADO: ${userName}`))
  }
  let reason = new Boom(lastDisconnect?.error)?.output?.statusCode
  if (connection === 'close') {
    if (reason === DisconnectReason.badSession) {
      console.log(style.warn(`\n⚠︎ SIN CONEXIÓN, borra la sesión principal del Bot y conéctate de nuevo.`))
    } else if (reason === DisconnectReason.connectionClosed) {
      console.log(style.info(`\n♻️ RECONECTANDO la conexión del Bot...`))
      await global.reloadHandler(true).catch(console.error)
    } else if (reason === DisconnectReason.connectionLost) {
      console.log(style.warn(`\n⚠︎ CONEXIÓN PERDIDA con el servidor, reconectando el Bot...`))
      await global.reloadHandler(true).catch(console.error)
    } else if (reason === DisconnectReason.connectionReplaced) {
      console.log(style.error(`\nꗇ LA CONEXIÓN DEL BOT HA SIDO REEMPLAZADA.`))
    } else if (reason === DisconnectReason.loggedOut) {
      console.log(style.error(`\n⚠︎ SIN CONEXIÓN, borra la sesión principal del Bot y conéctate de nuevo.`))
      await global.reloadHandler(true).catch(console.error)
    } else if (reason === DisconnectReason.restartRequired) {
      console.log(style.info(`\n♻️ REQUIRIENDO REINICIO, conectando el Bot...`))
      await global.reloadHandler(true).catch(console.error)
    } else if (reason === DisconnectReason.timedOut) {
      console.log(style.warn(`\n♻️ CONEXIÓN AGOTADA, reconectando el Bot...`))
      await global.reloadHandler(true).catch(console.error)
    } else {
      console.log(style.error(`\n⚠︎ CONEXIÓN CERRADA, conéctese nuevamente.`))
    }
  }
}
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
    } catch {}
    conn.ev.removeAllListeners()
    global.conn = makeWASocket(connectionOptions, {
      chats: oldChats
    })
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
  console.log(style.header('[ ↻ ] REINICIANDO...'))
  process.exit(0)
}, RESTART_INTERVAL_MS)
let rtU = join(__dirname, `./${jadi}`)
if (!existsSync(rtU)) {
  mkdirSync(rtU, {
    recursive: true
  })
}

global.rutaJadiBot = join(__dirname, `./${jadi}`)
if (global.Jadibts) {
  if (!existsSync(global.rutaJadiBot)) {
    mkdirSync(global.rutaJadiBot, {
      recursive: true
    })
    console.log(style.success(`⍰ La carpeta: ${jadi} se creó correctamente.`))
  } else {
    console.log(style.info(`⍰ La carpeta: ${jadi} ya está creada.`))
  }
  const readRutaJadiBot = readdirSync(rutaJadiBot)
  if (readRutaJadiBot.length > 0) {
    const creds = 'creds.json'
    for (const gjbts of readRutaJadiBot) {
      const botPath = join(rutaJadiBot, gjbts)
      const readBotPath = readdirSync(botPath)
      if (readBotPath.includes(creds)) {
        JadiBot({
          pathJadiBot: botPath,
          m: null,
          conn,
          args: '',
          usedPrefix: '/',
          command: 'serbot'
        })
      }
    }
  }
}

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
    }
  }
}
filesInit().then((_) => Object.keys(global.plugins)).catch(console.error)

global.reload = async(_ev, filename) => {
  if (pluginFilter(filename)) {
    const dir = global.__filename(join(pluginFolder, filename), true);
    if (filename in global.plugins) {
      if (existsSync(dir)) console.log(style.success(`- plugin actualizado - '${filename}'`))
      else {
        console.log(style.warn(`- plugin eliminado - '${filename}'`))
        return delete global.plugins[filename]
      }
    } else console.log(style.info(`- nuevo plugin - '${filename}'`))
    const err = syntaxerror(readFileSync(dir), filename, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true,
    });
    if (err) console.error(style.error(`error de sintaxis en '${filename}'\n${format(err)}`))
    else {
      try {
        const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`));
        global.plugins[filename] = module.default || module;
      } catch (e) {
        console.error(style.error(`error al requerir el plugin '${filename}'\n${format(e)}`))
      } finally {
        global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
      }
    }
  }
}
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
      })
    ])
  }))
  const [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test;
  const s = global.support = {
    ffmpeg,
    ffprobe,
    ffmpegWebp,
    convert,
    magick,
    gm,
    find
  };
  Object.freeze(global.support);
}

function clearTmp() {
  const tmpDir = join(__dirname, 'tmp')
  const filenames = readdirSync(tmpDir)
  filenames.forEach(file => {
    const filePath = join(tmpDir, file)
    unlinkSync(filePath)
  })
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
          }
        })
      }
    })
    if (SBprekey.length === 0) {
      console.log(style.success(`\n⍰ No hay archivos en ${jadi} para eliminar.`))
    } else {
      console.log(style.info(`\n⌦ Archivos de la carpeta ${jadi} han sido eliminados correctamente.`))
    }
  } catch (err) {
    console.log(style.error(`\n⚠︎ Error para eliminar archivos de la carpeta ${jadi}.\n` + err))
  }
}

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
              console.log(style.error(`\n⚠︎ El archivo ${file} no se logró borrar.\n` + err))
            } else {
              console.log(style.success(`\n⌦ El archivo ${file} se ha borrado correctamente.`))
            }
          })
        }
      })
    })
  })
}

function redefineConsoleMethod(methodName, filterStrings) {
  const originalConsoleMethod = console[methodName]
  console[methodName] = function() {
    const message = arguments[0]
    if (typeof message === 'string' && filterStrings.some(filterString => message.includes(atob(filterString)))) {
      arguments[0] = ""
    }
    originalConsoleMethod.apply(console, arguments)
  }
}
setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return
  await clearTmp()
  console.log(style.info(`\n⌦ Archivos de la carpeta TMP no necesarios han sido eliminados del servidor.`))
}, TMP_CLEAN_INTERVAL_MS)
setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return
  await purgeSession()
  console.log(style.info(`\n⌦ Archivos de la carpeta ${global.sessions} no necesario han sido eliminados del servidor.`))
}, SESSION_PURGE_INTERVAL_MS)
setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return
  await purgeSessionSB()
}, SESSION_PURGE_INTERVAL_MS)
setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return
  await purgeOldFiles()
  console.log(style.info(`\n⌦ Archivos no necesario han sido eliminados del servidor.`))
}, SESSION_PURGE_INTERVAL_MS)
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
  }
}

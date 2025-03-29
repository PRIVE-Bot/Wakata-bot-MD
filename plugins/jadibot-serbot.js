// Código creado por Deylin
// https://github.com/deylinqff
// No quites créditos

async function handler(m, { conn }) {
  const creadores = [
    { numero: '50488198573', nombre: 'Deylin' },
    { numero: '526633900512', nombre: 'Brayan' }
  ];

  const contactos = creadores.map(c => ` wa.me/${c.numero} *${c.nombre}*`).join('\n');

  const mensaje = `Hola @${m.sender.split('@')[0]}, soy un bot privado 🤖, por lo que no puedo tener subbots.  
Si deseas agregarme a tu grupo, puedes adquirir una suscripción por 
*$2 por semana*, 
con disponibilidad *24/7*.  

📞 Contacto para más información:  
${contactos}`;

  await conn.sendMessage(m.chat, { text: mensaje, mentions: [m.sender] }, { quoted: m });
}

handler.command = ['serbot', 'code', 'qr'];
export default handler;





import { useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } from "@whiskeysockets/baileys";
import qrcode from "qrcode";
import NodeCache from "node-cache";
import fs from "fs";
import path from "path";
import pino from "pino";
import chalk from "chalk";
import { exec } from "child_process";
import { makeWASocket } from "../lib/simple.js";
import { fileURLToPath } from "url";

let rtx2 = `╭───────────────⍰  
│  ✭ 𝗞𝗜𝗥𝗜𝗧𝗢 - 𝗕𝗢𝗧 𝗠𝗗 ✰  
╰───────────────⍰ 
> ✰ 𝗖𝗼𝗻𝗲𝘅𝗶ó𝗻 𝗦𝘂𝗯-𝗕𝗼𝘁 (𝗠𝗼𝗱𝗼 𝗖𝗼́𝗱𝗶𝗴𝗼) ✪  

⟿ 𝐔𝐬𝐚 𝐞𝐬𝐭𝐞 𝐜𝐨́𝐝𝐢𝐠𝐨 𝐩𝐚𝐫𝐚 𝐜𝐨𝐧𝐯𝐞𝐫𝐭𝐢𝐫𝐭𝐞 𝐞𝐧 𝐮𝐧 *𝗦𝘂𝗯-𝗕𝗼𝘁 𝗧𝗲𝗺𝗽𝗼𝗿𝗮𝗹*.  

➥ ❶ 𓂃 Toca los tres puntos en la esquina superior derecha.  
➥ ❷ 𓂃 Ve a *"Dispositivos vinculados"*.  
➥ ❸ 𓂃 Selecciona *Vincular con el número de teléfono*.  
➥ ❹ 𓂃 Ingresa el código y conéctate al bot.  

⚠ 𝐒𝐢 𝐲𝐚 𝐞𝐬𝐭á𝐬 𝐜𝐨𝐧𝐞𝐜𝐭𝐚𝐝𝐨 𝐚 𝐨𝐭𝐫𝐚 𝐬𝐞𝐬𝐢ó𝐧, 𝐬𝐞 𝐫𝐞𝐜𝐨𝐦𝐢𝐞𝐧𝐝𝐚  
𝐪𝐮𝐞 𝐭𝐞 𝐝𝐞𝐬𝐜𝐨𝐧𝐞𝐜𝐭𝐞𝐬. 𝐄𝐬𝐭𝐚𝐫 𝐞𝐧 𝐝𝐨𝐬 𝐩𝐮𝐞𝐝𝐞 𝐜𝐚𝐮𝐬𝐚𝐫 𝐞𝐫𝐫𝐨𝐫𝐞𝐬  
𝐲 𝐮𝐧 𝐩𝐨𝐬𝐢𝐛𝐥𝐞 𝐛𝐚𝐧𝐞𝐨 𝐝𝐞 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽.  
`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const kiritoJBOptions = {};
if (!(global.conns instanceof Array)) global.conns = [];

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
  let time = global.db.data.users[m.sender].Subs + 120000;
  if (Object.values(global.conns).length === 30) return m.reply("❌ No se han encontrado espacios para Sub-Bots disponibles.");
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
  let id = who.split('@')[0];
  let pathkiritoJadiBot = path.join(`./${jadi}/`, id);
  if (!fs.existsSync(pathkiritoJadiBot)) fs.mkdirSync(pathkiritoJadiBot, { recursive: true });
  kiritoJBOptions.pathkiritoJadiBot = pathkiritoJadiBot;
  kiritoJBOptions.m = m;
  kiritoJBOptions.conn = conn;
  kiritoJBOptions.args = args;
  kiritoJBOptions.usedPrefix = usedPrefix;
  kiritoJBOptions.command = command;
  kiritoJadiBot(kiritoJBOptions);
  global.db.data.users[m.sender].Subs = Date.now();
};
handler.help = ['serbotcode'];
handler.tags = ['serbot'];
handler.command = ['jadibotcode', 'serbotcode'];
export default handler;

export async function kiritoJadiBot(options) {
  let { pathkiritoJadiBot, m, conn, args, usedPrefix, command } = options;
  const mcode = true;
  let txtCode, codeBot;
  if (mcode) {
    args[0] = args[0]?.replace(/^--code$|^code$/, "").trim() || undefined;
  }
  const pathCreds = path.join(pathkiritoJadiBot, "creds.json");
  if (!fs.existsSync(pathkiritoJadiBot)) fs.mkdirSync(pathkiritoJadiBot, { recursive: true });
  try {
    if (args[0]) fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, "\t"));
  } catch {
    conn.reply(m.chat, `${usedPrefix + command} code`, m);
    return;
  }
  let { version } = await fetchLatestBaileysVersion();
  const msgRetry = () => {};
  const msgRetryCache = new NodeCache();
  const { state, saveState, saveCreds } = await useMultiFileAuthState(pathkiritoJadiBot);
  const connectionOptions = {
    printQRInTerminal: false,
    logger: pino({ level: "silent" }),
    auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" })) },
    msgRetry,
    msgRetryCache,
    version: [2, 3000, 1015901307],
    syncFullHistory: true,
    browser: ["kirito-Bot (Sub Bot)", "Chrome", "2.0.0"],
    defaultQueryTimeoutMs: undefined,
    getMessage: async (key) => ({ conversation: "kirito-Bot MD" })
  };
  let sock = makeWASocket(connectionOptions);
  sock.isInit = false;
  let isInit = true;
  async function connectionUpdate(update) {
    const { connection, lastDisconnect, qr } = update;
    if (qr && mcode) {
      let secret = await sock.requestPairingCode(m.sender.split("@")[0]);
      secret = secret.match(/.{1,4}/g)?.join("-");
      txtCode = await conn.sendMessage(m.chat, { text: rtx2 }, { quoted: m });
      codeBot = await m.reply(secret);
      setTimeout(() => { conn.sendMessage(m.sender, { delete: txtCode.key }); }, 30000);
      setTimeout(() => { conn.sendMessage(m.sender, { delete: codeBot.key }); }, 30000);
    }
    if (connection === "close") {
      await creloadHandler(true).catch(console.error);
    }
    if (connection === "open") {
      global.db.data.users[m.sender].Subs = Date.now();
      await conn.sendMessage(m.chat, { text: "✅ Sub‑Bot activado en modo código.\nLa sesión se mantendrá activa." }, { quoted: m });
      sock.isInit = true;
      global.conns.push(sock);
    }
  }
  sock.ev.on("connection.update", connectionUpdate);
  setInterval(async () => {
    if (!sock.user) {
      try { await sock.ws.close(); } catch (e) {}
      sock.ev.removeAllListeners();
      let i = global.conns.indexOf(sock);
      if (i < 0) return;
      delete global.conns[i];
      global.conns.splice(i, 1);
    }
  }, 60000);
  let handlerImport = await import("../handler.js");
  let creloadHandler = async function (restatConn) {
    try {
      const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error);
      if (Object.keys(Handler || {}).length) handlerImport = Handler;
    } catch (e) { console.error(e); }
    if (restatConn) {
      const oldChats = sock.chats;
      try { await sock.ws.close(); } catch {}
      sock.ev.removeAllListeners();
      sock = makeWASocket(connectionOptions, { chats: oldChats });
      isInit = true;
    }
    if (!isInit) {
      sock.ev.off("messages.upsert", sock.handler);
      sock.ev.off("connection.update", sock.connectionUpdate);
      sock.ev.off("creds.update", sock.credsUpdate);
    }
    sock.handler = handlerImport.handler.bind(sock);
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
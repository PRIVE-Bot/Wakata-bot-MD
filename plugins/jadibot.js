import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch, rmSync, mkdirSync, promises as fsPromises } from "fs";
const fs = { ...fsPromises, existsSync };
import path, { join } from 'path';
import ws from 'ws';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let handler = async (m, { conn: _envio, command, usedPrefix, args, text, isOwner}) => {
const isCommand1 = /^(deletesesion|deletebot|deletesession|deletesesaion)$/i.test(command);
const isCommand2 = /^(stop|pausarai|pausarbot)$/i.test(command);
const isCommand3 = /^(bots|sockets|socket)$/i.test(command);
const isCommand4 = /^(setofcbot|setmainbot)$/i.test(command);

async function reportError(e) {
await m.reply(`⚠️  [SYS-ERR] ${global.emoji} ${global.botname} detectó un error interno...`);
console.log(e);
}

// Obtener la lista de subbots activos una sola vez
const activeSubBots = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])];

switch (true) {       

case isCommand1:
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? _envio.user.jid : m.sender;
let uniqid = `${who.split`@`[0]}`;
const pathDelete = `./${global.jadi}/${uniqid}`;

if (!await fs.existsSync(pathDelete)) {
await _envio.sendMessage(m.chat, { 
  text: `
╭─╼━━━━━━━━━━╾─╮
┃ ${global.emoji} Sesión no encontrada  
┃ ➜ Usa: ${usedPrefix}serbot
┃ ➜ O vincula con: ${usedPrefix}serbot (ID)
╰─╼━━━━━━━━━━╾─╯
${global.emoji} ${global.botname}
`.trim() }, { quoted: m });
return;
}

if (global.conn.user.jid !== _envio.user.jid) {
await _envio.sendMessage(m.chat, { 
  text: `
╭─╼━━━━━━━━━━╾─╮
┃ ${global.emoji} Este comando solo funciona  
┃ en el *Bot Principal*.  
┃  
┃ 🔗 [Conectar al Principal]  
┃ https://api.whatsapp.com/send/?phone=${global.conn.user.jid.split`@`[0]}&text=${usedPrefix + command}
╰─╼━━━━━━━━━━╾─╯
${global.emoji} ${global.botname}
`.trim() }, { quoted: m });
} else {
await _envio.sendMessage(m.chat, { 
  text: `
╭─╼━━━━━━━━━━╾─╮
┃ ${global.emoji} Sub-Bot desconectado  
┃ Tu sesión fue eliminada  
╰─╼━━━━━━━━━━╾─╯
${global.emoji} ${global.botname}
`.trim() }, { quoted: m });
}

try {
rmSync(`./${global.jadi}/` + uniqid, { recursive: true, force: true });
await _envio.sendMessage(m.chat, { text : `
╭─╼━━━━━━━━━━╾─╮
┃ ${global.emoji} Limpieza completa  
┃ Rastros de sesión eliminados  
╰─╼━━━━━━━━━━╾─╯
${global.emoji} ${global.botname}
`.trim() }, { quoted: m });
} catch (e) {
reportError(e);
}  
break;


case isCommand2:
if (global.conn.user.jid == _envio.user.jid) {
_envio.reply(m.chat, `
╭─╼━━━━━━━━━━╾─╮
┃ ${global.emoji} No eres SubBot  
┃ Conéctate desde el  
┃ Bot Principal para pausar  
╰─╼━━━━━━━━━━╾─╯
${global.emoji} ${global.botname}
`.trim(), m);
} else {
await _envio.reply(m.chat, `
╭─╼━━━━━━━━━━╾─╮
┃ ${global.emoji} Sub-Bot detenido  
┃ Conexión finalizada  
╰─╼━━━━━━━━━━╾─╯
${global.emoji} ${global.botname}
`.trim(), m);
_envio.ws.close();
}  
break;


case isCommand3:
function convertirMsADiasHorasMinutosSegundos(ms) {
var segundos = Math.floor(ms / 1000);
var minutos = Math.floor(segundos / 60);
var horas = Math.floor(minutos / 60);
var días = Math.floor(horas / 24);
segundos %= 60;
minutos %= 60;
horas %= 24;
return `${días ? días+"d " : ""}${horas ? horas+"h " : ""}${minutos ? minutos+"m " : ""}${segundos ? segundos+"s" : ""}`;
}

const message = activeSubBots.map((v, index) => `
╭─[ SubBot #${index + 1} ]─╮
┃ 📎 wa.me/${v.user.jid.replace(/[^0-9]/g, '')}?text=${usedPrefix}estado
┃ 👤 Usuario: ${v.user.name || 'Sub-Bot'}
┃ 🕑 Online: ${ v.uptime ? convertirMsADiasHorasMinutosSegundos(Date.now() - v.uptime) : 'Desconocido'}
╰─────────────────────╯`
).join('\n\n');

const responseMessage = `
╭─╼━━━━━━━━━━━━━━━━━━━━╾─╮
┃ ${global.emoji} PANEL DE SUB-BOTS ${global.emoji} 
┃ Conectados: ${activeSubBots.length || '0'}  
╰─╼━━━━━━━━━━━━━━━━━━━━╾─╯

${message || '🚫 No hay SubBots activos'}

${global.emoji} ${global.botname}
`.trim();

await _envio.sendMessage(m.chat, {text: responseMessage, mentions: _envio.parseMention(responseMessage)}, {quoted: m});
break;

case isCommand4:
if (!isOwner) {
return m.reply('⛔ *Acceso denegado*. Solo el *desarrollador principal* puede usar este comando.');
}

const botIndex = parseInt(args[0]);

if (isNaN(botIndex) || botIndex < 1 || botIndex > activeSubBots.length) {
return m.reply(`💡 Uso: ${usedPrefix + command} <número_de_la_lista>\n\nEjemplo: ${usedPrefix + command} 1\n\n> Usa *${usedPrefix}bots* para ver la lista de números.`);
}

const targetSubBotConn = activeSubBots[botIndex - 1]; // Obtener la conexión por el índice
const targetNumberRaw = targetSubBotConn.user.jid.replace(/[^0-9]/g, '');

const subBotSessionPath = join(global.rutaJadiBot || `./${global.jadi}`, targetNumberRaw);
const mainSessionPath = `./${global.sessions}`;

if (!existsSync(subBotSessionPath)) {
return m.reply(`❌ La sesión del subbot *+${targetNumberRaw}* no existe en ${subBotSessionPath}.`);
}

await m.reply(`⚙️ Iniciando transferencia de sesión para *SubBot #${botIndex} (+${targetNumberRaw})*...\n\n1. Eliminando credenciales antiguas del bot principal.`);

try {
if (existsSync(mainSessionPath)) {
rmSync(mainSessionPath, { recursive: true, force: true });
await delay(1000);
}
await m.reply('✅ Credenciales principales eliminadas.');
} catch (e) {
console.error('Error al borrar sesión principal:', e);
return m.reply('❌ Error al intentar borrar las credenciales principales.');
}

await m.reply('2. Copiando credenciales del subbot a la sesión principal...');

try {
// Corregido: Llamando a mkdirSync importada
mkdirSync(mainSessionPath, { recursive: true });

await execPromise(`cp -r ${subBotSessionPath}/* ${mainSessionPath}/`);
await delay(1000);

if (!existsSync(join(mainSessionPath, 'creds.json'))) {
throw new Error("La copia de creds.json falló.");
}

await m.reply('3. Eliminando la sesión del subbot original...');

rmSync(subBotSessionPath, { recursive: true, force: true });

await m.reply('✅ Transferencia completa. Reiniciando el Bot...');

} catch (e) {
console.error('Error durante la copia/eliminación:', e);
return m.reply(`❌ Error crítico durante la transferencia de sesión:\n${e.message}`);
}

setTimeout(() => {
process.exit(0);
}, 3000);
break;

}}

handler.tags = ['serbot', 'owner']
handler.help = ['sockets', 'deletesesion', 'pausarai', 'setofcbot']
handler.command = ['deletesesion', 'deletebot', 'deletesession', 'deletesession', 'stop', 'pausarai', 'pausarbot', 'bots', 'sockets', 'socket', 'setofcbot', 'setmainbot']
handler.owner = true;

export default handler;

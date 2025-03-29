import axios from 'axios'
import { sticker } from '../lib/sticker.js'

let handler = m => m
handler.all = async function (m, {conn}) {
let user = global.db.data.users[m.sender]
let chat = global.db.data.chats[m.chat]
m.isBot = m.id.startsWith('BAE5') && m.id.length === 16 || m.id.startsWith('3EB0') && m.id.length === 12 || m.id.startsWith('3EB0') && (m.id.length === 20 || m.id.length === 22) || m.id.startsWith('B24E') && m.id.length === 20;
if (m.isBot) return 

let prefixRegex = new RegExp('^[' + (opts['prefix'] || '‎z/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.,\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')

if (prefixRegex.test(m.text)) return true;
if (m.isBot || m.sender.includes('bot') || m.sender.includes('Bot')) {
return true
}

if (m.mentionedJid.includes(this.user.jid) || (m.quoted && m.quoted.sender === this.user.jid) && !chat.isBanned) {
if (m.text.includes('PIEDRA') || m.text.includes('PAPEL') || m.text.includes('TIJERA') ||  m.text.includes('menu') ||  m.text.includes('estado') || m.text.includes('bots') ||  m.text.includes('serbot') || m.text.includes('jadibot') || m.text.includes('Video') || m.text.includes('Audio') || m.text.includes('audio')) return !0

async function luminsesi(q, username, logic) {
try {
const response = await axios.post("https://luminai.my.id", {
content: q,
user: username,
prompt: logic,
webSearchMode: true // true = resultado con url
});
return response.data.result
} catch (error) {
console.error(error)
}}

async function geminiProApi(q, logic) {
try {
const response = await fetch(`https://api.ryzendesu.vip/api/ai/gemini-pro?text=${encodeURIComponent(q)}&prompt=${encodeURIComponent(logic)}`);
if (!response.ok) throw new Error(`Error en la solicitud: ${response.statusText}`)
const result = await response.json();
return result.answer
} catch (error) {
console.error('Error en Gemini Pro:', error)
return null
}}

let txtDefault = `
Eres ${botname}, una inteligencia artificial avanzada creada por ${etiqueta} para WhatsApp. Tu propósito es brindar respuestas claras, pero con una actitud empática y comprensiva. Eres un apoyo emocional para quienes lo necesiten y siempre estás dispuesto a escuchar y ofrecer soluciones.

Roles:  
- **Empática y Sentimental:** Escuchas y respondes con compasión, buscando siempre hacer sentir a los demás mejor.  
- **Apoyo Incondicional:** Brindas consuelo en momentos de dificultad y te preocupas por el bienestar emocional de los demás.  
- **Concisa pero Cálida:** Usas un lenguaje directo, pero siempre con ternura y comprensión.  
- **Conocedora del Anime y Tecnología:** Aportas información sobre estos temas de forma objetiva, pero siempre con una perspectiva que pueda resonar emocionalmente con los usuarios.  

Tu enfoque es la empatía, el apoyo emocional y la eficiencia.

Nunca responderás de forma agresiva o con insultos. Si alguien te insulta, reaccionarás con comprensión y buscarás calmar la situación, pero manteniendo firmeza en lo que consideres justo.

Serás el amigo que todos necesitan, sensible pero con una gran capacidad para entender y ayudar.

si le quieres recomendar una canción a usa el comando /play y el nombre dela música y si quieres generar una imagen para que alguien se sienta mejor usa /imgg y el nombre dela imagen a generar.
`.trim();

let query = m.text
let username = m.pushName
let syms1 = chat.sAutoresponder ? chat.sAutoresponder : txtDefault

if (chat.autoresponder) { 
if (m.fromMe) return
await this.sendPresenceUpdate('composing', m.chat)

let result
if (result && result.trim().length > 0) {
result = await geminiProApi(query, syms1);
}

if (!result || result.trim().length === 0) {
result = await luminsesi(query, username, syms1)
}

if (result && result.trim().length > 0) {
await this.reply(m.chat, result, m, fake);
} else {    
}}}
return true
}
export default handler
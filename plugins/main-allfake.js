import pkg from '@whiskeysockets/baileys'
import fs from 'fs'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg

var handler = m => m
handler.all = async function (m) {

global.getBuffer = async function getBuffer(url, options) {
try {
options ? options : {}
var res = await axios({
method: "get",
url,
headers: {
'DNT': 1,
'User-Agent': 'GoogleBot',
'Upgrade-Insecure-Request': 1
},
...options,
responseType: 'arraybuffer'
})
return res.data
} catch (e) {
console.log(`Error : ${e}`)
}}

//creador y otros
global.creador = 'Wa.me/8498802313'
global.ofcbot = `${conn.user.jid.split('@')[0]}`
global.asistencia = 'Wa.me/8296839832'
global.listo = ' *Aquí tienes, shinobi ❛‿˂̵✧*'
global.fotoperfil = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://files.catbox.moe/nv87us.jpg')


//fechas
global.d = new Date(new Date + 3600000)
global.locale = 'es'
global.dia = d.toLocaleDateString(locale, {weekday: 'long'})
global.fecha = d.toLocaleDateString('es', {day: 'numeric', month: 'numeric', year: 'numeric'})
global.mes = d.toLocaleDateString('es', {month: 'long'})
global.año = d.toLocaleDateString('es', {year: 'numeric'})
global.tiempo = d.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true})

//Reacciones De Comandos.!
global.rwait = '🕒'
global.done = '✅'
global.error = '✖️'
global.msm = '⚠︎'


global.emoji0 = '🕷️✎𓆩☽𓆪'
global.emoji1 = '💀༗✧༄'
global.emoji2 = '🦇↷♛߹߬'
global.emoji3 = '🌙༊✰༆'
global.emoji4 = '🕸️๛⍰☼'
global.emoji5 = '🩸๛⌬➣'
global.emoji6 = '🧛‍♂️☠︎︎𖤐'
global.emoji7 = '🎃⌬༒'
global.emoji8 = '🕯️༺⚰️༻'
global.emoji9 = '👁‍🗨⛧𖤍'

global.emojis = [emoji0, emoji1, emoji2, emoji3, emoji4, emoji5, emoji6, emoji7, emoji8, emoji9].getRandom()
global.emoji = [emoji0, emoji1, emoji2, emoji3, emoji4, emoji5, emoji6, emoji7, emoji8, emoji9].getRandom()

//mensaje en espera
global.wait = '✪ Espera un momento, soy lento...';

//Enlaces
https://whatsapp.com/channel/0029VbA0ahmFXUuToQRrdR2c '

global.redes = [canal, canal2, git, github, correo].getRandom()

global.canalIdM = ["120363403593951965@newsletter", "120363403593951965@newsletter"]
global.canalNombreM = ["×ʀ ꜰʀᴀs𝐞𝐬🍀-𝐁𝐨𝐭 𝐌𝐃 ✦ ᴜɴᴇᴛᴇ ᴀʟ ᴄᴀɴᴀʟ.", "×ʀ ꜰʀᴀs𝐞𝐬-𝔹𝕠𝕥 𝕄𝔻 - 𝚞𝚗𝚎𝚝𝚎 𝚊𝚕 𝚌𝚊𝚗𝚊𝚕."]
global.channelRD = await getRandomChannel()

//• ↳ ◜𝑻𝑰𝑬𝑴𝑷𝑶 𝑹𝑷𝑮◞ • ⚔
var ase = new Date(); var hour = ase.getHours(); switch(hour){ case 0: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 1: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 2: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 3: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break; case 4: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break; case 5: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break; case 6: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break; case 7: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌅'; break; case 8: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break; case 9: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break; case 10: hour = 'Lɪɴᴅᴏ Dɪᴀ 🌤'; break; case 11: hour = 'Lɪɴᴅᴏ Dɪᴀ 🌤'; break; case 12: hour = 'Lɪɴᴅᴏ Dɪᴀ 🌤'; break; case 13: hour = 'Lɪɴᴅᴏ Dɪᴀ 🌤'; break; case 14: hour = 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆'; break; case 15: hour = 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆'; break; case 16: hour = 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆'; break; case 17: hour = 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆'; break; case 18: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 19: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 20: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 21: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 22: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 23: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break;}
global.saludo = hour;

const imgs = [
  'https://wakata.my/media/images/6.png',
  'https://wakata.my/media/images/7.png',
  'https://wakata.my/media/images/8.png',
  'https://wakata.my/media/images/9.png',
  'https://wakata.my/media/images/10.png',
  'https://wakata.my/media/images/11.png',
  'https://wakata.my/media/images/12.png',
  'https://wakata.my/media/images/13.png'
];

global.img = imgs[Math.floor(Math.random() * imgs.length)];


//tags
global.nombre = m.pushName || 'Anónimo'
global.taguser = '@' + m.sender.split("@s.whatsapp.net")
var more = String.fromCharCode(8206)
global.rmr = more.repeat(850)


global.packsticker = `┏━──────━◆◆━──────━┓\n✰ Usuario: ${nombre}\n⚔✰ Bot: ${botname}\n✰ Fecha: ${fecha}\n✰ Hora: ${tiempo}\n┗━──────━◆◆━──────━┛`;
global.packsticker2 = `\n┏━──────━◆◆━──────━┓\n👑 Desarrollador: ${dev}\n┗━──────━◆◆━──────━┛`;

//Fakes
global.fkontak = { key: {participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: `6285600793871-1614953337@g.us` } : {}) }, message: { 'contactMessage': { 'displayName': `${nombre}`, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;${nombre},;;;\nFN:${nombre},\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`, 'jpegThumbnail': null, thumbnail: null,sendEphemeral: true}}}

    const res = await fetch('https://kirito.my/media/images/95705905_k.jpg');
    const thumb2 = Buffer.from(await res.arrayBuffer());
    const userJid = m.sender

    global.fkontak1 = {
      key: { participants: userJid, remoteJid: "status@broadcast", fromMe: false, id: "Halo" },
      message: {
        locationMessage: {
          name: `ACCESO DENEGADO`,
          jpegThumbnail: thumb2
        }
      },
      participant: userJid
    };

  
global.fake = { contextInfo: { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: channelRD.id, newsletterName: channelRD.name, serverMessageId: -1 }
}}, { quoted: m }

global.icono = [
'https://wakata.my/media/images/1.jpg',
'https://wakata.my/media/images/2.jpg',
'https://wakata.my/media/images/3.jpg',
'https://wakata.my/media/images/4.jpg',
'https://wakata.my/media/images/5.jpg'
].getRandom()

global.rcanal = { contextInfo: { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: channelRD.id, serverMessageId: '', newsletterName: channelRD.name }, externalAdReply: { title: botname, body: dev, mediaUrl: null, description: null, previewType: "PHOTO", thumbnail: await (await fetch(icono)).buffer(), /*sourceUrl: redes,*/ mediaType: 1, renderLargerThumbnail: false }, mentionedJid: null }}

global.rcanal1 = { contextInfo: { isForwarded: true, /*forwardedNewsletterMessageInfo: { newsletterJid: channelRD.id, serverMessageId: '', newsletterName: channelRD.name },*/ externalAdReply: { title: botname, body: dev, mediaUrl: null, description: null, previewType: "PHOTO", thumbnail: await (await fetch(icono)).buffer(), /*sourceUrl: redes,*/ mediaType: 1, renderLargerThumbnail: false }, mentionedJid: null }}
}

export default handler

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
  }

async function getRandomChannel() {
let randomIndex = Math.floor(Math.random() * canalIdM.length)
let id = canalIdM[randomIndex]
let name = canalNombreM[randomIndex]
return { id, name }
}

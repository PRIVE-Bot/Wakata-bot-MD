import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' 

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*


global.botNumberCode = '' 
global.confirmCode = ''

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.owner = [
  [ '50432955554', 'Deylin', true ],
  [ '15614809253', 'David', true ],
  ['155968113483985@lid'],
  ['155968113483985'],
]; 
//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.mods = ['50432955554']
global.suittag = ['50432955554'] 
global.prems = []

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.libreria = 'Baileys'
global.baileys = 'V 6.7.16' 
global.languaje = 'Español'
global.vs = '2.2.0'
global.vsJB = '5.0'
global.nameqr = 'ɴᴀʀᴜᴛᴏ-ʙᴏᴛ ᴍᴅ'
global.namebot = '𝕹𝖆𝖗𝖚𝖙𝖔 - 𝕭𝖔𝖙 𝕸𝕯'
global.sessions = 'Sessions'
global.jadi = 'JadiBots' 
global.Jadibts = true

global.canalIdM = ["120363403593951965@newsletter", "120363403593951965@newsletter"]
global.canalNombreM = ["𖤐 𝐍𝐚𝐫𝐮𝐭𝐨-𝐁𝐨𝐭 - 𝐮𝐩𝐝𝐚𝐭𝐞𝐬 ⚡", "𖤐 𝐍𝐚𝐫𝐮𝐭𝐨-𝐁𝐨𝐭 - 𝐚𝐯𝐢𝐬𝐨𝐬 ☀️"]
global.channelRD = await getRandomChannel()

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.packname = '𝑵𝒂𝒓𝒖𝒕𝒐 - 𝑩𝒐𝒕 𝑴𝑫';
global.botname = '𝑵𝒂𝒓𝒖𝒕𝒐 - 𝑩𝒐𝒕 𝑴𝑫'
global.author = 'Made By 𝐃𝐞𝐲𝐥𝐢𝐧'
global.dev = '© ⍴᥆ᥕᥱrᥱძ ᑲᥡ 𝑫𝒆𝒚𝒍𝒊𝒏'
global.textbot = '𝑵𝒂𝒓𝒖𝒕𝒐 - 𝐁𝐨𝐭 𝑴𝑫 • Powered By 𝑫𝒆𝒚𝒍𝒊𝒏'
global.etiqueta = '𝑫𝒆𝒚𝒍𝒊𝒏'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.catalogo = fs.readFileSync('./src/catalogo.jpg');
global.photoSity = [catalogo]
global.ch = {
ch1: '120363403593951965@newsletter',
}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.catalogo = fs.readFileSync('./src/catalogo.jpg');

global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment   

global.icono1 = [
'https://i.postimg.cc/d3Q1g80b/IMG-20250803-WA0147.jpg',
'https://i.postimg.cc/zBZH2bKN/IMG-20250803-WA0146.jpg',
'https://i.postimg.cc/1RVYNL5N/IMG-20250803-WA0145.jpg',
]//.getRandom()

global.rcanal = {
  contextInfo: {
    externalAdReply: {
      showAdAttribution: true, 
      title: botname,
      body: dev,
      mediaType: 2,         
      thumbnailUrl: global.icono,
      sourceUrl: "https://naruto-bot.vercel.app/canal.html"
    }
  }
}

async function getRandomChannel() {
let randomIndex = Math.floor(Math.random() * canalIdM.length)
let id = canalIdM[randomIndex]
let name = canalNombreM[randomIndex]
return { id, name }
}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})

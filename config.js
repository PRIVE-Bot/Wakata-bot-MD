import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' 
 

global.suittag = ['8498802313'] 
global.sessions = 'Sessions'
global.jadi = 'JadiBots' 
global.Jadibts = true
global.packname = 'wakata-𝙱𝚘𝚝 𝙼𝙳';
global.botname = 'wakata-𝐵𝑜𝑡 𝑀𝐷'
global.author = 'Made By wakata -`ღ´-'
global.dev = '© ρσɯҽɾҽԃ Ⴆყ ɢᴏʟꜰɪᴛᴏ'
global.textbot = 'wakata-ʙᴏᴛ ᴍᴅ • ꉣꄲꅐꏂꋪꏂ꒯ ꃳꌦ ɢᴏʟꜰɪᴛᴏ'
global.etiqueta = 'ɢᴏʟꜰɪᴛᴏ'
global.ch = {
ch1: '120363403593951965@newsletter',
ch2: '120363403593951965@newsletter',
}
global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment   

let icono1 = [
  'https://i.postimg.cc/c4t9wwCw/8498802313.jpg',
  'https://i.postimg.cc/c4MvC5Wz/8498802313.jpg',
  'https://i.postimg.cc/qMdtkHPn/8296839832.jpg',
]

global.inc = icono1[Math.floor(Math.random() * icono1.length)];

const res = await fetch(inc);
const img = Buffer.from(await res.arrayBuffer());


async function getRandomChannel() {
let randomIndex = Math.floor(Math.random() * canalIdM.length)
let id = canalIdM[randomIndex]
let name = canalNombreM[randomIndex]
return { id, name }
}


let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})

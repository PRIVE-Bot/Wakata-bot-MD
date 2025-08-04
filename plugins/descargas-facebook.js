import fetch from 'node-fetch'
import axios from 'axios'

let handler = async (m, { conn, text }) => {
if (!text)  return conn.reply(m.chat, `❀ Ingresa un link de facebook`, m)

try {
let api = await fetch(`https://vapis.my.id/api/fbdl?url=${text}`)
let json = await api.json()
let { title, durasi, hd_url } = json.data
let VidBuffer = await getBuffer(hd_url)
let HS = `- *Título :* ${title}
- *Duracion :* ${durasi}`

await conn.sendMessage(m.chat, { video: VidBuffer, mimetype: "video/mp4", caption: handler }, { quoted: m });
} catch (error) {
console.error(error)
}}

handler.command = ['fbdl', 'fb', 'facebook', 'facebookdl']

export default handler

const getBuffer = async (url, options = {}) => {
const res = await axios({ method: 'get', url, headers: {'DNT': 1, 'Upgrade-Insecure-Request': 1}, ...options, responseType: 'arraybuffer'})
return res.data
}
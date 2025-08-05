import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command }) => {
try {
await m.react(emojis)
conn.reply(m.chat, '✎ Buscando su *Waifu* espere un momento...', m, {
contextInfo: { externalAdReply :{ mediaUrl: null, mediaType: 1, showAdAttribution: true,
title: packname,
body: dev,
previewType: 0, thumbnail: icons,
sourceUrl: channel }}})
let res = await fetch('https://g-mini-ia.vercel.app/api/nsfw')
if (!res.ok) return
let json = await res.json()
if (!json.url) return 
await conn.sendFile(m.chat, json.url, 'thumbnail.jpg', '✧ Aqui tienes tu *Waifu* ฅ^•ﻌ•^ฅ.', fkontak, null, rcanal)
} catch {
}}
handler.help = ['waifu']
handler.tags = ['anime']
handler.command = ['waifu']
handler.group = true;

export default handler
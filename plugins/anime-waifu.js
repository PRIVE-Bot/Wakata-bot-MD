import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    // Variables requeridas (defínelas globalmente o aquí según tu bot)
    let emojis = '🔍'
    let packname = 'Waifu Generator'
    let dev = 'Deylin'
    let icons = null // o una imagen en buffer/base64/url
    let channel = 'https://whatsapp.com/channel/0029VbB46nl2ER6dZac6Nd1o'
    let fkontak = { key: { remoteJid: 'status@broadcast', fromMe: false }, message: { contactMessage: { displayName: 'Waifu Bot', vcard: '' } } }
    let rcanal = { contextInfo: { externalAdReply: { title: packname, body: dev, mediaType: 1, showAdAttribution: true, thumbnail: icons, sourceUrl: channel } } }

    await m.react(emojis)
    await conn.reply(m.chat, '✎ Buscando su *Waifu* espere un momento...', m, rcanal)

    let res = await fetch('https://g-mini-ia.vercel.app/api/nsfw')
    if (!res.ok) throw await res.text()
    
    let json = await res.json()
    if (!json || !json.url) throw 'No se pudo obtener la waifu.'

    await conn.sendFile(m.chat, json.url, 'waifu.jpg', `✧ Aquí tienes tu *Waifu* (${json.tipo}) por *${json.autor}* ฅ^•ﻌ•^ฅ`, fkontak, null, rcanal)
  } catch (e) {
    console.error(e)
    m.reply('❌ Ocurrió un error al obtener la waifu.')
  }
}

handler.help = ['waifu']
handler.tags = ['anime']
handler.command = ['waifu']
handler.group = true

export default handler
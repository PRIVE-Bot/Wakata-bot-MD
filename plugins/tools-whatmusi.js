import acrcloud from 'acrcloud'
import yts from 'yt-search'
import fetch from 'node-fetch'

let acr = new acrcloud({
  host: 'identify-eu-west-1.acrcloud.com',
  access_key: 'c33c767d683f78bd17d4bd4991955d81',
  access_secret: 'bvgaIAEtADBTbLwiPGYlxupWqkNGIjT7J9Ag2vIu'
})

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    if (!/video|audio/.test(mime)) return conn.reply(m.chat, `🎵 Etiqueta un audio o video corto con *${usedPrefix + command}* para identificar la música.`, m, rcanal)

    const res = await fetch('https://files.catbox.moe/nwgsz3.jpg');
    const thumb2 = Buffer.from(await res.arrayBuffer());

    const fkontak = {
        key: {
            participants: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            fromMe: false,
            id: "Halo"
        },
        message: {
            locationMessage: {
                name: `𝗥𝗘𝗦𝗨𝗟𝗧𝗔𝗗𝗢𝗦 𝗗𝗘 𝗔𝗖𝗥𝗖𝗟𝗢𝗨𝗗\n${botname}`,
                jpegThumbnail: thumb2
            }
        },
        participant: "0@s.whatsapp.net"
    };

    
    let buffer = await q.download()
    let { status, metadata } = await acr.identify(buffer)
    if (status.code !== 0) throw status.msg

    let music = metadata.music[0]
    let { title, artists, album, genres, release_date } = music

    
    const searchResults = await yts.search(title)
    if (!searchResults.videos.length) return conn.reply(m.chat, "❌ No se encontró ningún video relacionado en YouTube.", m, rcanal)
    const video = searchResults.videos[0]
    const { url, title: ytTitle, author, views, timestamp, ago, thumbnail } = video

    
    let txt = '┏╾❑「 *Whatmusic Tools* 」\n'
    txt += `┃  ≡◦ *Titulo ∙* ${title}\n`
    if (artists) txt += `┃  ≡◦ *Artista ∙* ${artists.map(v => v.name).join(', ')}\n`
    if (album) txt += `┃  ≡◦ *Album ∙* ${album.name}\n`
    if (genres) txt += `┃  ≡◦ *Genero ∙* ${genres.map(v => v.name).join(', ')}\n`
    txt += `┃  ≡◦ *Fecha de lanzamiento ∙* ${release_date || 'Desconocida'}\n`
    txt += `┃  ≡◦ *YouTube:* ${ytTitle}\n`
    txt += `┃  ≡◦ *Canal:* ${author?.name || 'Desconocido'}\n`
    txt += `┃  ≡◦ *Vistas:* ${views}\n`
    txt += `┃  ≡◦ *Duración:* ${timestamp}\n`
    txt += `┗╾❑`

    
    const thumbRes = await fetch(thumbnail)
    const thumbBuffer = Buffer.from(await thumbRes.arrayBuffer())

   
    await conn.sendMessage(m.chat, {
      image: thumbBuffer,
      caption: txt
    }, { quoted: m })

  } catch (err) {
    console.error(err)
    conn.reply(m.chat, `❌ Error al procesar la música: ${err.message}`, m, rcanal)
  }
}

handler.help = ['whatmusic <audio/video>']
handler.tags = ['tools']
handler.command = ['shazam', 'whatmusic']

export default handler
import acrcloud from 'acrcloud'
import yts from 'yt-search'

let acr = new acrcloud({
  host: 'identify-eu-west-1.acrcloud.com',
  access_key: 'c33c767d683f78bd17d4bd4991955d81',
  access_secret: 'bvgaIAEtADBTbLwiPGYlxupWqkNGIjT7J9Ag2vIu'
})

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    if (!/video|audio/.test(mime)) return conn.reply(m.chat, `🔥 Etiqueta un audio o video de corta duración con el comando *${usedPrefix + command}* para identificar la música.`, m, fake)

    let buffer = await q.download()
    let { status, metadata } = await acr.identify(buffer)
    if (status.code !== 0) throw status.msg

    let music = metadata.music[0]
    let { title, artists, album, genres, release_date } = music

    
    let txt = '┏╾❑「 *Whatmusic Tools* 」\n'
    txt += `┃  ≡◦ *Titulo ∙* ${title}`
    if (artists) txt += `\n┃  ≡◦ *Artista ∙* ${artists.map(v => v.name).join(', ')}`
    if (album) txt += `\n┃  ≡◦ *Album ∙* ${album.name}`
    if (genres) txt += `\n┃  ≡◦ *Genero ∙* ${genres.map(v => v.name).join(', ')}`
    txt += `\n┃  ≡◦ *Fecha de lanzamiento ∙* ${release_date || 'Desconocida'}\n`
    txt += '┗╾❑'

    
    if (album && album.cover) {
      await conn.sendMessage(m.chat, { image: { url: album.cover }, caption: txt }, { quoted: m })
    } else {
      await conn.reply(m.chat, txt, m)
    }

  } catch (err) {
    console.error(err)
    conn.reply(m.chat, `❌ No se pudo identificar la música. Intenta con otro audio o video.`, m)
  }
}

handler.help = ['whatmusic <audio/video>']
handler.tags = ['tools']
handler.command = ['shazam', 'whatmusic']
//handler.limit = 1

export default handler
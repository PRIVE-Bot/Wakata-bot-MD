// plugins/gif.js
import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      `❗️Uso: ${usedPrefix + command} <texto>\nEjemplo: ${usedPrefix + command} anime matando`,
      m
    )
  }

  try {
    // Llamada a la API de Tenor
    let { data } = await axios.get(
      `https://api.tenor.com/v1/search?q=${encodeURIComponent(text)}&key=LIVDSRZULELA&limit=4`
    )

    if (!data.results || data.results.length === 0) {
      return conn.reply(m.chat, `❌ No encontré GIFs para *${text}*`, m)
    }

    // Adaptamos el formato para tu sendAlbumMessage
    let album = data.results.slice(0, 4).map((gif, i) => {
      let url =
        gif.media[0].mp4?.url ||
        gif.media[0].tinygif?.url ||
        gif.media[0].gif?.url
      return {
        url,
        caption: `🎬 GIF ${i + 1} — ${text}`
      }
    })

    // Usamos tu método personalizado
    await conn.sendAlbumMessage(m.chat, album, m)
  } catch (err) {
    console.error('Error en comando gif:', err)
    conn.reply(m.chat, '❌ Error al obtener GIFs desde Tenor.', m)
  }
}

handler.help = ['gif <texto>']
handler.tags = ['media', 'search']
handler.command = /^gif$/i

export default handler
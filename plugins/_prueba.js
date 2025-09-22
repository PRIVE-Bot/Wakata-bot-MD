// plugins/gif.js
import axios from 'axios'

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `❗️Uso: ${usedPrefix + command} <texto>\nEjemplo: ${usedPrefix + command} anime matando`, m)
  }

  try {
    // Llamada a la API de Tenor
    let { data } = await axios.get(`https://api.tenor.com/v1/search?q=${encodeURIComponent(text)}&key=LIVDSRZULELA&limit=4`)

    if (!data.results || data.results.length === 0) {
      return conn.reply(m.chat, `❌ No encontré GIFs para *${text}*`, m)
    }

    // Construimos el álbum con 4 resultados
    let album = data.results.slice(0, 4).map((gif, index) => {
      // Preferimos mp4 (porque WhatsApp lo trata como gif loop)
      let url = gif.media[0].mp4?.url || gif.media[0].tinymp4?.url || gif.media[0].gif?.url

      return {
        video: { url },
        mimetype: 'video/mp4',
        gifPlayback: true,
        caption: `🎬 GIF ${index + 1} — ${text}`
      }
    })

    // Usamos tu método personalizado para enviar álbum
    await conn.sendAlbumMessage(m.chat, album, m)

  } catch (err) {
    console.error(err)
    conn.reply(m.chat, '❌ Error al obtener GIFs desde Tenor.', m)
  }
}

handler.help = ['gif <texto>']
handler.tags = ['media', 'search']
handler.command = /^gif$/i

export default handler
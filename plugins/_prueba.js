import yts from 'yt-search'
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const ctxErr = global.rcanalx || {}
  const ctxOk = global.rcanalr || {}

  if (!text) {
    return conn.reply(m.chat, `
🍙📚 Itsuki Nakano - Descargar Multimedia 🎵🎥✨

🌟 ¡Como tutora multimedia, puedo ayudarte a descargar audio y video!

📝 Forma de uso:
• ${usedPrefix}play2 audio <nombre>
• ${usedPrefix}play2 video <nombre>

💡 Ejemplos:
• ${usedPrefix}play2 audio unravel Tokyo ghoul
• ${usedPrefix}play2 video spy x family opening
• ${usedPrefix}play2 audio LiSA crossing field

🎯 Formatos disponibles:
🎵 Audio MP3 (alta calidad)
🎥 Video MP4 (completo)
    `.trim(), m)
  }

  const args = text.split(' ')
  const type = args[0]?.toLowerCase()
  const query = args.slice(1).join(' ')

  if (!type || !query) {
    return conn.reply(m.chat, `❌ Formato incorrecto\n💡 Usa:\n• ${usedPrefix}play2 audio <nombre>\n• ${usedPrefix}play2 video <nombre>`, m)
  }

  if (!['audio', 'video'].includes(type)) {
    return conn.reply(m.chat, `❌ Tipo no válido\n🎯 Opciones: audio o video`, m)
  }

  try {
    await conn.reply(m.chat, type === 'audio' ? '🍙🎵 Buscando y descargando tu audio...' : '🍙🎥 Buscando y descargando tu video...', m)

    const searchResults = await yts(query)
    if (!searchResults?.videos?.length) {
      return conn.reply(m.chat, '❌ No encontré resultados 🎵', m)
    }

    const video = searchResults.videos[0]

    let downloadUrl

    if (type === 'audio') {
      const audioApiUrl = `https://api.platform.web.id/ytdl/audio?url=${encodeURIComponent(video.url)}&quality=128k`
      const audioResponse = await fetch(audioApiUrl)
      const mediaData = await audioResponse.json()

      if (!mediaData?.download) throw new Error('La API no devolvió la URL de audio')
      downloadUrl = mediaData.download

      await conn.sendMessage(m.chat, {
        audio: { url: downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${video.title}.mp3`,
        ptt: false
      }, { quoted: m })

    } else {
      const videoApiUrl = `https://api.zenzxz.my.id/downloader/ytmp4v2?url=${encodeURIComponent(video.url)}`
      const videoResponse = await fetch(videoApiUrl)
      const mediaData = await videoResponse.json()

      if (!mediaData?.result?.url) throw new Error('La API no devolvió la URL de video')
      downloadUrl = mediaData.result.url

      await conn.sendMessage(m.chat, {
        video: { url: downloadUrl },
        caption: `🎥 ${video.title}\n⏱️ ${video.timestamp || video.duration}\n👤 ${video.author.name || video.author}`,
        mimetype: 'video/mp4'
      }, { quoted: m })
    }

    const successMessage = type === 'audio' ?
      `🍙✅ ¡Audio descargado con éxito! 🎵\n🎼 Título: ${video.title}\n⏱️ Duración: ${video.timestamp || video.duration}\n👤 Artista: ${video.author.name || video.author}` :
      `🍙✅ ¡Video descargado con éxito! 🎥\n🎬 Título: ${video.title}\n⏱️ Duración: ${video.timestamp || video.duration}\n👤 Canal: ${video.author.name || video.author}`

    await conn.reply(m.chat, successMessage, m, ctxOk)

  } catch (error) {
    console.error('❌ Error en play2:', error)
    await conn.reply(m.chat, `❌ Error al descargar ${type}\n🔧 Error: ${error.message}`, m, ctxErr)
  }
}

handler.help = ['play2 <audio/video> <busqueda>']
handler.tags = ['downloader']
handler.command = ['play2']

export default handler
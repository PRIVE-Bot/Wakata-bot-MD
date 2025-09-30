import yts from 'yt-search'
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const ctxErr = global.rcanalx || {}
  const ctxWarn = global.rcanalw || {}
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

🍱 ¡Encuentra y descarga tu multimedia favorita! 🎶🎬📖
    `.trim(), m)
  }

  const args = text.split(' ')
  const type = args[0]?.toLowerCase()
  const query = args.slice(1).join(' ')

  if (!type || !query) {
    return conn.reply(m.chat, 
      `❌ Formato incorrecto\n\n` +
      `💡 Usa:\n` +
      `• ${usedPrefix}play2 audio <nombre>\n` +
      `• ${usedPrefix}play2 video <nombre>\n\n` +
      `🍱 ¡Especifica si quieres audio o video! 📖`,
      m
    )
  }

  if (!['audio', 'video'].includes(type)) {
    return conn.reply(m.chat, 
      `❌ Tipo no válido\n\n` +
      `🎯 Opciones:\n` +
      `• audio - Para descargar música\n` +
      `• video - Para descargar video\n\n` +
      `🍱 ¡Elige audio o video! 📖`,
      m
    )
  }

  try {
    await conn.reply(m.chat, 
      type === 'audio' ? 
      '🍙🎵 Buscando y descargando tu audio... 📚✨' : 
      '🍙🎥 Buscando y descargando tu video... 📚✨', 
      m
    )

    const searchResults = await yts(query)
    if (!searchResults?.videos?.length) {
      return conn.reply(m.chat, '❌ No encontré resultados 🎵\n\n🍙 ¡Por favor, verifica el nombre! 📖', m)
    }

    const video = searchResults.videos[0]

    let downloadUrl
    let mediaData

    if (type === 'audio') {
      const audioApiUrl = `https://api.platform.web.id/ytdl/audio?url=${encodeURIComponent(video.url)}&quality=128k`
      const audioResponse = await fetch(audioApiUrl)
      mediaData = await audioResponse.json()

      if (!mediaData?.url) {
        throw new Error('La API no pudo descargar el audio - URL no encontrada')
      }
      downloadUrl = mediaData.url
    } else {
      const videoApiUrl = `https://api.zenzxz.my.id/downloader/ytmp4v2?url=${encodeURIComponent(video.url)}`
      const videoResponse = await fetch(videoApiUrl)
      mediaData = await videoResponse.json()

      if (!mediaData?.result?.url) {
        throw new Error('La API no pudo descargar el video - URL no encontrada')
      }
      downloadUrl = mediaData.result.url
    }

    if (!downloadUrl || !downloadUrl.startsWith('http')) {
      throw new Error('URL de descarga inválida')
    }

    // Enviar archivo multimedia
    if (type === 'audio') {
      await conn.sendMessage(m.chat, {
        audio: { url: downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${video.title}.mp3`,
        ptt: false
      }, { quoted: m })
    } else {
      await conn.sendMessage(m.chat, {
        video: { url: downloadUrl },
        caption: `🎥 ${video.title}\n⏱️ ${video.timestamp}\n👤 ${video.author.name}`,
        mimetype: 'video/mp4'
      }, { quoted: m })
    }

    const successMessage = type === 'audio' ? 
      `🍙✅ ¡Audio descargado con éxito! 🎵✨\n\n🎼 Título: ${video.title}\n⏱️ Duración: ${video.timestamp}\n👤 Artista: ${video.author.name}\n\n📚 ¡Disfruta de tu música! 🍱🎶` : 
      `🍙✅ ¡Video descargado con éxito! 🎥✨\n\n🎬 Título: ${video.title}\n⏱️ Duración: ${video.timestamp}\n👤 Canal: ${video.author.name}\n\n📚 ¡Disfruta de tu video! 🍱🎬`

    await conn.reply(m.chat, successMessage, m, ctxOk)

  } catch (error) {
    console.error('❌ Error en play2:', error)
    await conn.reply(m.chat, 
      `❌ Error al descargar ${type === 'audio' ? 'el audio' : 'el video'}\n\n` +
      `🍙 ¡Lo siento! No pude descargar este ${type === 'audio' ? 'audio' : 'video'}.\n\n` +
      `🔧 Error: ${error.message}\n\n` +
      `📖 ¡Intenta con otro ${type === 'audio' ? 'audio' : 'video'}! 🍱✨`,
      m, ctxErr
    )
  }
}

handler.help = ['play2 <audio/video> <busqueda>']
handler.tags = ['downloader']
handler.command = ['play2']

export default handler
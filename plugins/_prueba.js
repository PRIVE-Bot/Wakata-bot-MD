import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('⚠️ Ingresa la URL de un video de YouTube.')

  await m.react('⏳')

  try {
    // Codificar URL
    const videoUrl = encodeURIComponent(text)
    
    // Endpoint de SaveFrom.net (no oficial)
    const apiUrl = `https://savefrom.net/api/convert?url=${videoUrl}&format=json`

    const response = await fetch(apiUrl)
    if (!response.ok) throw new Error('No se pudo obtener el video.')

    const data = await response.json()
    if (!data.url) throw new Error('No se encontró el enlace del video.')

    // Enviar video como video normal
    await conn.sendMessage(m.chat, {
      video: { url: data.url },
      caption: `🎬 *Título:* ${data.title || 'Video de YouTube'}`
    }, { quoted: m })

    await m.react('✅')

  } catch (err) {
    console.error(err)
    await m.react('❌')
    m.reply('❌ No se pudo descargar el video. Intenta con otro enlace.')
  }
}

handler.command = /^ytmp4|ytv|youtube$/i
export default handler
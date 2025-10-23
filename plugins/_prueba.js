import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('⚠️ Ingresa la URL de un video de YouTube.')

  await m.react('⏳')

  try {
    const url = encodeURIComponent(text)
    const apiUrl = `https://youtube-to-mp4.p.rapidapi.com/url=&title?url=${url}&title=video`
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'youtube-to-mp4.p.rapidapi.com',
        'x-rapidapi-key': 'e403269c94mshd286676f129f5bap1e37f2jsn6275ce1a6f58'
      }
    })

    if (!response.ok) throw new Error(`Error en la API (${response.status})`)

    const data = await response.json()
    if (!data.link) throw new Error('No se encontró el enlace del video.')

    await conn.sendMessage(m.chat, { 
      video: { url: data.link }, 
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
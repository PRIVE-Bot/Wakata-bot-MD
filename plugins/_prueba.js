import fetch from 'node-fetch'
import { writeFileSync } from 'fs'

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('⚠️ Ingresa una URL de video válida.')

  await m.react('⏳')

  try {
    const res = await fetch(text)
    if (!res.ok) throw new Error(`No se pudo descargar el video (${res.status})`)
    const buffer = Buffer.from(await res.arrayBuffer())

    // Enviar como video normal (no archivo)
    await conn.sendMessage(m.chat, { 
      video: buffer, 
      caption: '🎬 Aquí tienes tu video 👇', 
      mimetype: 'video/mp4'
    }, { quoted: m })

    await m.react('✅')

  } catch (err) {
    console.error(err)
    await m.react('❌')
    m.reply('❌ No se pudo enviar el video.')
  }
}

handler.command = /^video$/i
export default handler
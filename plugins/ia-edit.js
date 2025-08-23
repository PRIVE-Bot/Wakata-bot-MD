import axios from 'axios'
import fetch from 'node-fetch'
import FormData from 'form-data'

async function uploadCatboxBuffer(buffer) {
  const form = new FormData()
  form.append('reqtype', 'fileupload')
  form.append('fileToUpload', buffer, 'file.jpg')

  const res = await fetch('https://catbox.moe/user/api.php', {
    method: 'POST',
    body: form
  })
  const url = await res.text()
  if (!url.startsWith('http')) throw new Error('Error al subir imagen a Catbox')
  return url.trim()
}

let handler = async (m, { text, conn, usedPrefix, command }) => {
  try {
    let url, prompt

    // Detectar si es una imagen en respuesta o enviada directamente
    let q = m.quoted ? m.quoted : m
    let buffer = null
    if ((q.mimetype || '').includes('image')) {
      buffer = await q.download() // Devuelve un buffer directamente
      if (!text) return m.reply(`Formato:\nResponde/envía imagen con:\n${usedPrefix + command} <prompt>`)
      url = await uploadCatboxBuffer(buffer)
      prompt = text.trim()
    }
    // Caso url | prompt
    else if (text && text.includes('|')) {
      const [link, pr] = text.split('|').map(v => v.trim())
      if (!link || !pr) return m.reply(`Formato incorrecto!\nEjemplo:\n${usedPrefix + command} https://files.catbox.moe/abc.jpg | cambia el fondo a negro`)
      url = link
      prompt = pr
    }
    else return m.reply(`Formato:\n${usedPrefix + command} <url> | <prompt>\nO responde/envía imagen con:\n${usedPrefix + command} <prompt>`)

    // Llamar a la API de edición
    await m.react('✨')
    const apiUrl = `https://api-faa-skuarta.vercel.app/faa/editfoto?url=${encodeURIComponent(url)}&prompt=${encodeURIComponent(prompt)}`
    const res = await axios.get(apiUrl, { responseType: 'arraybuffer' })

    await conn.sendMessage(m.chat, { image: res.data, caption: `✅ *EDIT COMPLETADO*` }, { quoted: m })
    await m.react('🪄')
  } catch (e) {
    console.error(e)
    m.reply("❌ Error al procesar la imagen.\n" + (e.message || ''))
  }
}

handler.command = ['edit', 'editimg']
handler.help = ['edit <url>|<prompt>', 'editimg']
handler.tags = ['ai']

export default handler
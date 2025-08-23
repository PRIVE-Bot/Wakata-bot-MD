import axios from 'axios'
import fetch from 'node-fetch'
import FormData from 'form-data'
import cheerio from 'cheerio'

async function uploadPostImages(buffer) {
  const form = new FormData()
  form.append('upload_session', Math.random())
  form.append('file', buffer, { filename: 'file.jpg', contentType: 'image/jpeg' })

  const res = await axios.post('https://postimages.org/json/rr', form, {
    headers: form.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  })

  if (!res.data.url) {
    throw new Error('Error al subir a PostImages: ' + res.data.error)
  }

  const html = await axios.get(res.data.url)
  const $ = cheerio.load(html.data)
  const imageUrl = $('#code_direct').attr('value')

  if (!imageUrl) {
    throw new Error('No se pudo obtener la URL directa de PostImages.')
  }

  return imageUrl
}

let handler = async (m, { text, conn, usedPrefix, command }) => {
  try {
    let url, prompt

    let q = m.quoted ? m.quoted : m
    let buffer = null
    if ((q.mimetype || '').includes('image')) {
      buffer = await q.download()
      if (!text) return m.reply(`Formato:\nResponde/envía imagen con:\n${usedPrefix + command} <prompt>`)
     
      url = await uploadPostImages(buffer)
      prompt = text.trim()
    }
    
    else if (text && text.includes('|')) {
      const [link, pr] = text.split('|').map(v => v.trim())
      if (!link || !pr) return m.reply(`Formato incorrecto!\nEjemplo:\n${usedPrefix + command} https://files.catbox.moe/abc.jpg | cambia el fondo a negro`)
      url = link
      prompt = pr
    }
    else return m.reply(`Formato:\n${usedPrefix + command} <url> | <prompt>\nO responde/envía imagen con:\n${usedPrefix + command} <prompt>`)

    
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

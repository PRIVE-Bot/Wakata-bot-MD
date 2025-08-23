import fs from 'fs'
import fetch from 'node-fetch'
import FormData from 'form-data'
import axios from 'axios'

async function uploadCatbox(buffer) {
  const formData = new FormData()
  formData.append('reqtype', 'fileupload')
  formData.append('fileToUpload', buffer, 'file.jpg')

  const res = await fetch('https://catbox.moe/user/api.php', {
    method: 'POST',
    body: formData
  })
  const url = await res.text()
  if (!url.startsWith('http')) throw new Error('Error al subir imagen a Catbox')
  return url.trim()
}

let handler = async (m, { text, conn, usedPrefix, command }) => {
  try {
    let url, prompt
    const q = m.quoted || m
    const mime = q.mimetype || q.mediaType || ''

    if (/image/.test(mime)) {
      if (!text) return m.reply(`Formato:\nResponde/envía imagen con:\n${usedPrefix + command} <prompt>\n\nEjemplo:\n${usedPrefix + command} ponele en color negro`)
      const mediaPath = await q.download(true)
      const buffer = await fs.promises.readFile(mediaPath)
      url = await uploadCatbox(buffer)
      prompt = text.trim()
      try { await fs.promises.unlink(mediaPath) } catch {}
    }
    else if (text && text.includes('|')) {
      const [link, pr] = text.split('|').map(v => v.trim())
      if (!link || !pr) return m.reply(`Formato incorrecto!\nEjemplo:\n${usedPrefix + command} https://files.catbox.moe/1zw3ek.jpeg | cambia el fondo a negro`)
      url = link
      prompt = pr
    }
    else {
      return m.reply(`Formato:\n${usedPrefix + command} <url> | <prompt>\nO responde/envía imagen con:\n${usedPrefix + command} <prompt>`)
    }

    await m.react('✨')
    const apiUrl = `https://api-faa-skuarta.vercel.app/faa/editfoto?url=${encodeURIComponent(url)}&prompt=${encodeURIComponent(prompt)}`
    const res = await axios.get(apiUrl, { responseType: 'arraybuffer' })

    await conn.sendMessage(m.chat, { image: res.data, caption: `✅ *EDIT COMPLETADO*` }, { quoted: m })
    await m.react('🪄')
  } catch (e) {
    console.error(e)
    m.reply("❌ Error al procesar la imagen.")
  }
}

handler.command = ['edit', 'editimg']
handler.help = ['edit <url>|<prompt>', 'editimg']
handler.tags = ['ai']

export default handler
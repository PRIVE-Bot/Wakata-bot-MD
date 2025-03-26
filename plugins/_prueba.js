import axios from 'axios'
import fs from 'fs'
import path from 'path'
import archiver from 'archiver'
import { generateWAMessageContent, generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`✘ Uso incorrecto del comando\n\n📌 Ejemplo: *${usedPrefix + command} gatos*`)
  }

  await m.react('⏳')
  m.reply(`🔍 Buscando imágenes de *${text}* en Pinterest...`)

  try {
    let { data } = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=%2Fsearch%2Fpins%2F%3Fq%3D${text}&data=%7B%22options%22%3A%7B%22isPrefetch%22%3Afalse%2C%22query%22%3A%22${text}%22%2C%22scope%22%3A%22pins%22%2C%22no_fetch_context_on_resource%22%3Afalse%7D%2C%22context%22%3A%7B%7D%7D`)
    
    let images = data.resource_response.data.results.map(v => v.images.orig.url).slice(0, 10)

    if (images.length === 0) {
      return m.reply(`❌ No se encontraron imágenes para *${text}*.`)
    }

    let folderPath = path.join(__dirname, 'pinterest')
    let zipPath = path.join(__dirname, `pinterest_${Date.now()}.zip`)

    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath)

    let downloads = images.map(async (url, index) => {
      let imgPath = path.join(folderPath, `imagen_${index + 1}.jpg`)
      let response = await axios.get(url, { responseType: 'arraybuffer' })
      fs.writeFileSync(imgPath, response.data)
    })

    await Promise.all(downloads)

    let output = fs.createWriteStream(zipPath)
    let archive = archiver('zip', { zlib: { level: 9 } })

    archive.pipe(output)
    fs.readdirSync(folderPath).forEach(file => archive.file(path.join(folderPath, file), { name: file }))
    await archive.finalize()

    await conn.sendMessage(m.chat, { document: { url: zipPath }, mimetype: 'application/zip', fileName: `Pinterest_${text}.zip`, caption: `✅ *Tus imágenes de* *${text}* *han sido descargadas.* 📸` })

    fs.rmSync(folderPath, { recursive: true, force: true })
    fs.unlinkSync(zipPath)

  } catch (e) {
    console.error(e)
    m.reply(`❌ Error al obtener imágenes de Pinterest.`)
  }

  await m.react('✅')
}

handler.help = ['pinterest <búsqueda>']
handler.tags = ['descargas']
handler.command = ['pinterest', 'pin']
export default handler
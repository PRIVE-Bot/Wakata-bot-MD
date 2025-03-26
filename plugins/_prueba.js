import axios from 'axios'
import { tmpdir } from 'os'
import path from 'path'
import fs from 'fs'
import archiver from 'archiver'

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`✘ Uso incorrecto del comando\n\n📌 Ejemplo: *${usedPrefix + command} gatos*`)
  }

  await m.react('⏳')
  m.reply(`🔍 Buscando imágenes de *${text}* en Pinterest...`)

  try {
    const { data } = await axios.get(`https://www.iesdesign.com.ar/pinterest?search=${encodeURIComponent(text)}`)

    if (!data || !data.results || data.results.length === 0) {
      return m.reply(`❌ No se encontraron imágenes para *${text}*.`)
    }

    let images = data.results.slice(0, 10) // 10 imágenes máximo

    let folderPath = path.join(tmpdir(), `pinterest_${Date.now()}`)
    let zipPath = path.join(tmpdir(), `Pinterest_${Date.now()}.zip`)

    fs.mkdirSync(folderPath)

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

    await conn.sendMessage(m.chat, { 
      document: fs.readFileSync(zipPath), 
      mimetype: 'application/zip', 
      fileName: `Pinterest_${text}.zip`, 
      caption: `✅ *Tus imágenes de* *${text}* *han sido descargadas.* 📸`
    })

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
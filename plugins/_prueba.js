import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, usedPrefix }) => {
  // Si no envías ni respondes video, manda aviso
  let mediaMessage = m
  if (!m.video && !m.quoted?.video) {
    return conn.sendMessage(m.chat, { text: `⚠️ Envía un video con el comando *${usedPrefix}togif* o responde a un video con ese comando.` }, { quoted: m })
  }
  if (!m.video && m.quoted?.video) mediaMessage = m.quoted

  try {
    // Descarga el video
    const buffer = await conn.downloadMedia(mediaMessage)

    // Archivos temporales
    const inputPath = path.join(__dirname, `input_${Date.now()}.mp4`)
    const outputPath = path.join(__dirname, `output_${Date.now()}.gif`)

    fs.writeFileSync(inputPath, buffer)

    // Convierte a gif con ffmpeg
    await new Promise((resolve, reject) => {
      exec(`ffmpeg -y -i "${inputPath}" -vf "fps=15,scale=320:-1:flags=lanczos" -loop 0 "${outputPath}"`, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    const gifBuffer = fs.readFileSync(outputPath)

    // Envía el gif como video con reproducción automática (gifPlayback)
    await conn.sendMessage(m.chat, { video: gifBuffer, gifPlayback: true, caption: '✨ Aquí tienes tu GIF' }, { quoted: m })

    // Borra archivos temporales
    fs.unlinkSync(inputPath)
    fs.unlinkSync(outputPath)

  } catch (e) {
    console.error(e)
    conn.sendMessage(m.chat, { text: '❌ Error al convertir el video a GIF.' }, { quoted: m })
  }
}

handler.command = ['togif']

export default handler
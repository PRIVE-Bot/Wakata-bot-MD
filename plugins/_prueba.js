import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'

function videoToGif(input, output) {
  return new Promise((resolve, reject) => {
    exec(`ffmpeg -y -i "${input}" -vf "fps=15,scale=320:-1:flags=lanczos" -loop 0 "${output}"`, (err) => {
      if (err) reject(err)
      else resolve(output)
    })
  })
}

export async function handler(m, { conn, command, isMedia, quoted }) {
  if (command !== 'togif') return

  let mediaMessage = m
  if (!isMedia && m.quoted?.video) {
    mediaMessage = m.quoted
  }

  if (!mediaMessage || !mediaMessage.video) {
    return conn.sendMessage(m.chat, { text: '⚠️ Por favor, envía o responde a un video con el comando .togif' }, { quoted: m })
  }

  try {
    // Descargar video
    const buffer = await conn.downloadMedia(mediaMessage)

    // Rutas temporales
    const inputPath = path.join(__dirname, `input_${Date.now()}.mp4`)
    const outputPath = path.join(__dirname, `output_${Date.now()}.gif`)

    // Guardar archivo
    fs.writeFileSync(inputPath, buffer)

    // Convertir a GIF
    await videoToGif(inputPath, outputPath)

    // Leer GIF
    const gifBuffer = fs.readFileSync(outputPath)

    // Enviar GIF con gifPlayback para que se vea animado
    await conn.sendMessage(m.chat, {
      video: gifBuffer,
      caption: 'Aquí está tu GIF 🎉',
      gifPlayback: true
    }, { quoted: m })

    // Limpiar archivos
    fs.unlinkSync(inputPath)
    fs.unlinkSync(outputPath)
  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { text: '❌ Error al convertir el video a GIF.' }, { quoted: m })
  }
}
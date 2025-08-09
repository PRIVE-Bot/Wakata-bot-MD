import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, usedPrefix }) => {
  // Función para detectar si el mensaje o el citado tiene video
  function hasVideo(message) {
    if (!message || !message.message) return false
    return !!(
      message.message.videoMessage ||
      message.message.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage
    )
  }

  // Obtenemos el mensaje con video
  let mediaMessage = null

  if (m.message.videoMessage) {
    mediaMessage = m
  } else if (
    m.message.extendedTextMessage &&
    m.message.extendedTextMessage.contextInfo &&
    m.message.extendedTextMessage.contextInfo.quotedMessage &&
    m.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage
  ) {
    mediaMessage = {
      message: m.message.extendedTextMessage.contextInfo.quotedMessage
    }
  }

  if (!mediaMessage) {
    return conn.sendMessage(
      m.chat,
      {
        text: `⚠️ Envía un video con el comando *${usedPrefix}togif* o responde a un video con ese comando.`
      },
      { quoted: m }
    )
  }

  try {
    const buffer = await conn.downloadMedia(mediaMessage)

    const inputPath = path.join(__dirname, `input_${Date.now()}.mp4`)
    const outputPath = path.join(__dirname, `output_${Date.now()}.gif`)

    fs.writeFileSync(inputPath, buffer)

    await new Promise((resolve, reject) => {
      exec(
        `ffmpeg -y -i "${inputPath}" -vf "fps=15,scale=320:-1:flags=lanczos" -loop 0 "${outputPath}"`,
        (err) => {
          if (err) reject(err)
          else resolve()
        }
      )
    })

    const gifBuffer = fs.readFileSync(outputPath)

    await conn.sendMessage(
      m.chat,
      { video: gifBuffer, gifPlayback: true, caption: '✨ Aquí tienes tu GIF' },
      { quoted: m }
    )

    fs.unlinkSync(inputPath)
    fs.unlinkSync(outputPath)
  } catch (e) {
    console.error(e)
    conn.sendMessage(
      m.chat,
      { text: '❌ Error al convertir el video a GIF.' },
      { quoted: m }
    )
  }
}

handler.command = ['togif']
export default handler
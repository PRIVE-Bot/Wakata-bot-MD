import { generateBratGif } from '../lib/bratgif.js'
import { PRESET_COLORS, parseBratArgs, drawBratCanvas } from '../lib/brat.js'
import { Sticker } from 'wa-sticker-js'
import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys'

async function handler(m, { text, conn, usedPrefix, command }) {
  if (!text) {
    return conn.reply(m.chat, `Usa: ${usedPrefix + command} <texto> [delay=ms repeat=n]`, m)
  }

  const hasColor = /(\b(?:green|pink|cyan|black|white|gold)\b|preset=|bg=|color=)/i.test(text)

  if (!hasColor) {
    try {
      const sampleCanvas = await drawBratCanvas(parseBratArgs('brat'))
      const sampleBuffer = Buffer.isBuffer(sampleCanvas) ? sampleCanvas : sampleCanvas.toBuffer()

      const media = await prepareWAMessageMedia(
        { image: sampleBuffer },
        { upload: conn.waUploadToServer }
      )

      const rows = Object.entries(PRESET_COLORS).map(([k]) => ({
        header: k.toUpperCase(),
        title: `Fondo ${k}`,
        description: 'Seleccionar',
        id: `${usedPrefix + command} ${text} ${k}`
      }))

      const interactiveMessage = {
        body: { text: 'Elige un color para el GIF (también puedes usar bg=#hex color=#hex):' },
        footer: { text: `${global.dev || ''}`.trim() },
        header: {
          title: 'BRAT GIF Color',
          hasMediaAttachment: true,
          imageMessage: media.imageMessage
        },
        nativeFlowMessage: {
          buttons: [
            {
              name: 'single_select',
              buttonParamsJson: JSON.stringify({
                title: 'Colores',
                sections: [{ title: 'Presets', rows }]
              })
            }
          ],
          messageParamsJson: ''
        }
      }

      const msg = generateWAMessageFromContent(
        m.chat,
        { viewOnceMessage: { message: { messageContextInfo: {}, interactiveMessage } } },
        { userJid: conn.user.jid, quoted: m }
      )

      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
      return
    } catch (e) {
      console.error('Error en menú de colores:', e)
    }
  }

  try {
    await conn.reply(m.chat, '⏳ Generando sticker animado BRAT...', m)
  } catch {}

  const cleaned = text.trim()

  try {
    const {
      buffer,
      delay,
      repeat,
      lastFramePNG
    } = await generateBratGif(cleaned)

    const packMatch = /\bpack=([^\s]{1,60})/i.exec(cleaned)
    const authorMatch = /\bauthor=([^\s]{1,60})/i.exec(cleaned)
    const pack = (packMatch ? packMatch[1] : null) || global.packnameSticker || global.packname || 'Video BRAT'
    const author = (authorMatch ? authorMatch[1] : null) || global.authorSticker || global.author || 'BRAT'

    let stickerBuffer
    let animatedOk = false

    try {
      const animSticker = new Sticker(buffer, {
        pack,
        author,
        type: 'crop',
        quality: 50,
        id: 'brat-gif-anim'
      })
      stickerBuffer = await animSticker.toBuffer()
      if (stickerBuffer?.length) animatedOk = true
    } catch (e1) {
      console.error('Error creando sticker animado:', e1)
    }

    if (!animatedOk) {
      try {
        const staticSticker = new Sticker(lastFramePNG, {
          pack,
          author,
          type: 'full',
          quality: 90,
          id: 'brat-gif-static'
        })
        stickerBuffer = await staticSticker.toBuffer()
      } catch (e2) {
        throw new Error('No se pudo crear sticker animado ni estático: ' + e2.message)
      }
    }

    await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m })
  } catch (e) {
    console.error('Error final bratgif:', e)
    await conn.reply(m.chat, 'Error creando bratgif: ' + e.message, m)
  }
}

handler.help = ['bratgif <texto>']
handler.tags = ['img', 'tools', 'sticker']
handler.command = /^(bratvid|bratgif)$/i
handler.register = true

export default handler
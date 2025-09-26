import { parseBratArgs, drawBratCanvas, PRESET_COLORS } from '../lib/brat.js'
import { Sticker } from 'wa-sticker-js'
import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys'

async function handler(m, { text, conn, usedPrefix }) {
  if (!text) return conn.reply(m.chat, 'Escribe el texto para generar el sticker BRAT', m)
  const wantsPreset = /(\b(?:green|pink|cyan|black|white|gold)\b|preset=|bg=|color=)/i.test(text)
  if (!wantsPreset) {
    // Mostrar menú interactivo para elegir color antes de generar
    try {
      const sample = await drawBratCanvas(parseBratArgs('brat'))
      const media = await prepareWAMessageMedia({ image: sample }, { upload: conn.waUploadToServer })
      const rows = Object.entries(PRESET_COLORS).map(([k]) => ({
        header: k.toUpperCase(),
        title: `Fondo ${k}`,
        description: 'Seleccionar',
        id: `${usedPrefix}brat ${text} ${k}`
      }))
      const interactiveMessage = {
        body: { text: 'Elige un color (puedes también usar bg=#hex color=#hex):' },
        footer: { text: `${global.dev || ''}`.trim() },
        header: { title: 'BRAT Color', hasMediaAttachment: true, imageMessage: media.imageMessage },
        nativeFlowMessage: { buttons: [ { name: 'single_select', buttonParamsJson: JSON.stringify({ title: 'Colores', sections: [ { title: 'Presets', rows } ] }) } ], messageParamsJson: '' }
      }
      const msg = generateWAMessageFromContent(m.chat, { viewOnceMessage: { message: { interactiveMessage } } }, { userJid: conn.user.jid, quoted: m })
      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
      return
    } catch (e) { /* fallback sigue a generación directa */ }
  }
  const args = parseBratArgs(text)
  try {
    const imageBuffer = await drawBratCanvas(args)
    const pack = global.packnameSticker || global.packname || 'Imagen BRAT'
    const author = global.authorSticker || global.author || ''

    const sticker = new Sticker(imageBuffer, {
      pack,
      author,
      type: 'full',
      quality: 100,
      categories: ['🤩', '🎉'],
      id: 'brat-sticker',
      background: '#000000'
    })

    const stickerBuffer = await sticker.toBuffer()
    if (!stickerBuffer || !stickerBuffer.length) throw new Error('Error al convertir la imagen en sticker')

    await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m })
  } catch (e) {
    await conn.reply(m.chat, `Error generando sticker: ${e.message}`, m)
  }
}

handler.help = ['brat <texto>']
handler.tags = ['sticker','img','tools']
handler.command = /^(brat)$/i
handler.register = true

export default handler

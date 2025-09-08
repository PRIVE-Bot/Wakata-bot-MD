import fetch from 'node-fetch'
import { Sticker } from 'wa-sticker-formatter'

let handler = async (m, { conn, args }) => {
  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

  try {
    const texto = args.join(' ').trim()
    if (!texto) {
      await conn.sendMessage(m.chat, { react: { text: '🧃', key: m.key } })
      return m.reply(`⚠️ *Ejemplo de uso:* .brat hola mundo`)
    }

    const urlApi = `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(texto)}&isAnimated=false`

    const respuesta = await fetch(urlApi)
    if (!respuesta.ok) {
      throw new Error(`API Error: ${respuesta.status} ${respuesta.statusText}`)
    }

    const arrayBuffer = await respuesta.arrayBuffer()
    const imageBuffer = Buffer.from(arrayBuffer)

    if (!imageBuffer || imageBuffer.length === 0) {
      throw new Error('La imagen recibida está vacía')
    }

    const sticker = new Sticker(imageBuffer, {
      pack: 'Imagen BRAT',
      author: botname,
      type: 'full',
      quality: 100,
      categories: ['🤩', '🎉'],
      id: 'brat-sticker',
      background: '#000000'
    })

    const stickerBuffer = await sticker.toBuffer()

    if (!stickerBuffer || stickerBuffer.length === 0) {
      throw new Error('Error al convertir la imagen en sticker')
    }

    await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m })

    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

  } catch (e) {
    console.error('Error en handler brat:', e)
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } })
    m.reply(`❌ *Ocurrió un error:*\n${e.message}`)
  }
}

handler.help = ['brat <texto>']
handler.tags = ['sticker']
handler.command = /^brat$/i

export default handler
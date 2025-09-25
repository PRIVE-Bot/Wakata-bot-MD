import fetch from 'node-fetch'
import { sticker as makeSticker } from '../lib/sticker.js'

async function makeFkontak() {
  try {
    const res = await fetch('https://i.postimg.cc/rFfVL8Ps/image.jpg')
    const thumb2 = Buffer.from(await res.arrayBuffer())
    return {
      key: { participants: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'Halo' },
      message: { locationMessage: { name: 'Sticker Exito', jpegThumbnail: thumb2 } },
      participant: '0@s.whatsapp.net'
    }
  } catch {
    return undefined
  }
}

const handler = async (m, { conn, usedPrefix, command, text }) => {
  const qmsg = m.quoted || m
  const mime = (qmsg.msg || qmsg).mimetype || ''
  const isImg = /image\/(jpe?g|png)/i.test(mime)
  const isWebp = /image\/webp/i.test(mime)
  const isVideo = /video\/(mp4|gif)/i.test(mime)

  if (!(isImg || isWebp || isVideo) && !text) {
    return conn.reply(
      m.chat,
      `Envia o responde a una imagen/video corto \nEj: ${usedPrefix + command} > texto`,
      m,
      (typeof rcanalx === 'object' ? rcanalx : {})
    )
  }

  try { await conn.reply(m.chat, '', m, (typeof rcanalw === 'object' ? rcanalw : {}) ) } catch {}

  let buffer
  try {
    if (text && /^https?:\/\//i.test(text)) {
      const res = await fetch(text)
      if (!res.ok) throw new Error('No se pudo descargar URL')
      buffer = Buffer.from(await res.arrayBuffer())
    } else if (qmsg?.download) {
      buffer = await qmsg.download?.()
    }
    if (!buffer && !text) throw new Error('No se obtuvo buffer')
  } catch (e) {
    return conn.reply(m.chat, `❌ Error obteniendo media: ${e?.message || e}`, m, fake)
  }

  if (isVideo) {
    if ((qmsg.msg || {}).seconds > 30) {
      return conn.reply(m.chat, '⚠️ El video no debe superar 30s', m, rcanal)
    }
  }

  try {
    const pack = (global.packnameSticker || global.packname || 'StickerPack')
    const auth = (global.authorSticker || global.author || 'Bot')
    const mode = /\bcontain\b/i.test(text || '') ? 'contain' : 'cover'
    const position = (/\btop\b|\bcenter\b|\bbottom\b/i.exec(text || '') || ['bottom'])[0]
  const wantBox = /\bbox\b/i.test(text || '') && !/\bnobox\b/i.test(text || '')
  const boxColor = wantBox ? 'rgba(0,0,0,0.35)' : null
    const colorMatch = /color=([#a-z0-9(),.]+)/i.exec(text || '')
    const strokeMatch = /stroke(?:=([0-9]+))?/i.exec(text || '')
    const nostroke = /\bnostroke\b/i.test(text || '')
  const textColor = colorMatch ? colorMatch[1] : undefined
  const strokeWidth = nostroke ? 0 : (strokeMatch ? (strokeMatch[1] ? parseInt(strokeMatch[1], 10) : 6) : 0)
  const fontMaxMatch = /fontmax=(\d{1,3})/i.exec(text || '')
  const fontScaleMatch = /fontscale=([0-9.]{1,5})/i.exec(text || '')
  const fontMax = fontMaxMatch ? parseInt(fontMaxMatch[1], 10) : undefined
  const fontScale = fontScaleMatch ? Math.max(0.3, Math.min(2, parseFloat(fontScaleMatch[1]))) : undefined
  const strokeColorMatch = /strokecolor=([#a-z0-9(),.]+)/i.exec(text || '')
  const strokeColor = strokeColorMatch ? strokeColorMatch[1] : undefined

    let overlay = ''
    if (text) {
      overlay = text
        .replace(/\bcontain\b/ig, '')
        .replace(/\btop\b|\bcenter\b|\bbottom\b/ig, '')
        .replace(/\bbox\b|\bnobox\b/ig, '')
        .replace(/color=([#a-z0-9(),.]+)/ig, '')
        .replace(/stroke(=\d+)?/ig, '')
        .replace(/fontmax=\d+/ig, '')
        .replace(/fontscale=[0-9.]+/ig, '')
        .replace(/strokecolor=([#a-z0-9(),.]+)/ig, '')
        .replace(/\bnostroke\b/ig, '')
        .trim()
    }
    const result = await makeSticker(buffer || overlay, null, pack, auth, {
      mode,
      text: overlay || (buffer ? '' : (text || '')),
      position,
      boxColor,
      ...(textColor ? { textColor } : {}),
      ...(Number.isFinite(strokeWidth) ? { strokeWidth } : {}),
      ...(Number.isFinite(fontMax) ? { fontMax } : {}),
      ...(Number.isFinite(fontScale) ? { fontScale } : {}),
      ...(strokeColor ? { strokeColor } : {})
    })
    const fancyQuoted = await makeFkontak()
    await conn.sendMessage(
      m.chat,
      { sticker: result, ...(typeof rcanalr === 'object' ? rcanalr : {}) },
      { quoted: fancyQuoted || m }
    )
  } catch (e) {
    return conn.reply(m.chat, `❌ Error creando sticker: ${e?.message || e}`, m, (typeof rcanalx === 'object' ? rcanalx : {}))
  }
}

handler.help = ['s', 'sticker']
handler.tags = ['sticker']
handler.alias = ['s']
handler.command = /^(s|sticker)$/i
handler.register = true

export default handler
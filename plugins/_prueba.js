import fetch from 'node-fetch'
import crypto from 'crypto'
import { fileTypeFromBuffer } from 'file-type'

const UPLOAD_ENDPOINT = 'https://api.kirito.my/api/upload'

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return '0 B'
  if (bytes === 0) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / (1024 ** i)).toFixed(2)} ${sizes[i]}`
}

async function uploadToKirito(buffer, opts = {}) {
  const typeInfo = await fileTypeFromBuffer(buffer).catch(() => null) || {}
  const ext = (opts.ext || typeInfo.ext || 'bin').toLowerCase()
  const mime = (opts.mime || typeInfo.mime || 'application/octet-stream').toLowerCase()
  const fileName = opts.name || `${crypto.randomBytes(6).toString('hex')}.${ext}`
  const folder = (mime.startsWith('image/') ? 'images' : 'files')

  const base64Image = Buffer.from(buffer).toString('base64')
  const base64Data = `data:${mime};base64,${base64Image}`

  const res = await fetch(UPLOAD_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Origin': 'https://api.kirito.my',
      'Referer': 'https://api.kirito.my/upload',
      'Sec-Fetch-Site': 'cross-site',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Dest': 'empty'
    },
    body: JSON.stringify({ name: fileName, folder, file: base64Data })
  })

  const contentType = res.headers.get('content-type') || ''
  if (/application\/json/i.test(contentType)) {
    const data = await res.json().catch(() => ({}))
    if (res.ok) return { ok: true, ...data }
    return { ok: false, status: res.status, statusText: res.statusText, data }
  } else {
    const text = await res.text()
    const urlMatch = text.match(/(https?:\/\/[^\s"']+)|(data:[^\s"']+)/)
    const url = urlMatch ? urlMatch[0] : null
    if (res.ok) return { ok: true, url, raw: text }
    return { ok: false, status: res.status, statusText: res.statusText, raw: text }
  }
}

let handler = async (m, { conn, usedPrefix, command }) => {
  const q = m.quoted ? (m.quoted.msg || m.quoted) : m
  const mimeInfo = (q.mimetype || q.mediaType || q.mtype || '').toString().toLowerCase()
  if (!/image|video|audio|sticker|document/.test(mimeInfo)) {
    await conn.reply(m.chat, `Responde a una imagen, video, audio, sticker o documento para subirlo.\nEjemplo: responde a un archivo y usa: ${usedPrefix}${command}`, m)
    return
  }

  const buffer = await q.download().catch(() => null)
  if (!buffer || !buffer.length) {
    await conn.reply(m.chat, 'No se pudo descargar el archivo. Intenta reenviar el medio y vuelve a probar.', m)
    return
  }

  const MAX_BYTES = 20 * 1024 * 1024
  if (buffer.length > MAX_BYTES) {
    await conn.reply(m.chat, `El archivo es muy grande (${formatBytes(buffer.length)}). Máximo permitido: ${formatBytes(MAX_BYTES)}.`, m)
    return
  }

  const typeInfo = await fileTypeFromBuffer(buffer).catch(() => null) || {}
  const ext = (typeInfo.ext || (mimeInfo.includes('webp') ? 'webp' : mimeInfo.includes('png') ? 'png' : mimeInfo.includes('jpeg') || mimeInfo.includes('jpg') ? 'jpg' : 'bin')).toLowerCase()
  const mime = (typeInfo.mime || (mimeInfo.includes('/') ? mimeInfo : '') || 'application/octet-stream').toLowerCase()
  const fileName = `${crypto.randomBytes(6).toString('hex')}.${ext}`

  await conn.reply(m.chat, 'Subiendo archivo, espera...', m)
  let result
  try {
    result = await uploadToKirito(buffer, { name: fileName, ext, mime })
  } catch (e) {
    await conn.reply(m.chat, `Error al subir: ${e.message}`, m)
    return
  }

  if (result?.ok && (result.url || result.link || result.download_url)) {
    const url = result.url || result.link || result.download_url
    const caption = `✅ Subido correctamente\n• Enlace: ${url}\n• Tamaño: ${formatBytes(buffer.length)}`
    try {
      const buttons = [
        { name: 'cta_copy', buttonParamsJson: JSON.stringify({ display_text: 'Copiar enlace', copy_code: url }) }
      ]
      const interactiveMessage = {
        body: { text: caption },
        footer: { text: 'Kirito Uploader' },
        header: { title: 'Resultado de la subida', hasMediaAttachment: false },
        nativeFlowMessage: { buttons, messageParamsJson: '' }
      }
      const { generateWAMessageFromContent } = await import('@whiskeysockets/baileys')
      const msg = generateWAMessageFromContent(m.chat, { viewOnceMessage: { message: { interactiveMessage } } }, { userJid: conn.user.jid, quoted: m })
      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    } catch {
      await conn.reply(m.chat, caption, m)
    }
  } else if (result?.ok) {
    const short = JSON.stringify(result).slice(0, 500)
    await conn.reply(m.chat, `Subida completada pero sin URL directa. Respuesta:\n${short}${short.length >= 500 ? '…' : ''}`, m)
  } else {
    const status = result?.status ? `${result.status} ${result.statusText || ''}`.trim() : 'desconocido'
    const body = result?.data ? JSON.stringify(result.data).slice(0, 300) : (result?.raw || '').slice(0, 300)
    await conn.reply(m.chat, `❌ Falló la subida (${status}).\n${body}${(body || '').length >= 300 ? '…' : ''}`, m)
  }
}

handler.help = ['kirito (responde a un medio)']
handler.tags = ['tools']
handler.command = /^(kirito|kupload|kiritoimg)$/i

export default handler
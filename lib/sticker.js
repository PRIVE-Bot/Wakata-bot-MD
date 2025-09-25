import { Sticker } from 'wa-sticker-js'
import * as crypto from 'crypto'
import webp from 'node-webpmux'
import fetch from 'node-fetch'
import { createCanvas, loadImage } from '@napi-rs/canvas'
import { fileTypeFromBuffer } from 'file-type'

export async function sticker(img, url, packName, authorName, opts = {}) {
  try {
    const MAX = 512
    const options = {
      mode: opts.mode || 'cover',
      text: typeof opts.text === 'string' ? opts.text : '',
  textColor: opts.textColor || '#ffffff',
  strokeWidth: Number.isFinite(opts.strokeWidth) ? opts.strokeWidth : 0,
      fontFamily: opts.fontFamily || 'Impact, Arial Black, Arial, sans-serif',
      fontWeight: opts.fontWeight || '700',
      position: /^(top|center|bottom)$/i.test(opts.position) ? opts.position.toLowerCase() : 'bottom',
      padding: Number.isFinite(opts.padding) ? opts.padding : 24,
      margin: Number.isFinite(opts.margin) ? opts.margin : 24,
      boxColor: typeof opts.boxColor === 'string' ? opts.boxColor : null,
      boxPadding: Number.isFinite(opts.boxPadding) ? opts.boxPadding : 12,
      maxLines: Number.isFinite(opts.maxLines) ? Math.max(1, opts.maxLines) : 5,
      fontMax: Number.isFinite(opts.fontMax) ? opts.fontMax : 48,
      fontScale: Number.isFinite(opts.fontScale) ? opts.fontScale : 0.85
    }

    function wrapLines(ctx, text, maxWidth) {
      const words = (text || '').split(/\s+/).filter(Boolean)
      const lines = []
      let current = ''
      for (const w of words) {
        const test = current ? current + ' ' + w : w
        const m = ctx.measureText(test)
        if (m.width <= maxWidth) current = test
        else {
          if (current) lines.push(current)
          current = w
        }
      }
      if (current) lines.push(current)
      return lines
    }

    function chooseFontSize(ctx, text, maxWidth, maxHeight, baseSize) {
      let size = baseSize
      while (size >= 14) {
        ctx.font = `${options.fontWeight} ${size}px ${options.fontFamily}`
        const lines = wrapLines(ctx, text, maxWidth)
        const lineHeight = Math.round(size * 1.25)
        const height = lines.length * lineHeight
        if (height <= maxHeight) return { size, lines, lineHeight }
        size -= 2
      }
      ctx.font = `${options.fontWeight} 14px ${options.fontFamily}`
      const lines = wrapLines(ctx, text, maxWidth)
      return { size: 14, lines, lineHeight: Math.round(14 * 1.25) }
    }

    function drawText(ctx, canvasWidth, canvasHeight) {
      if (!options.text) return
  const usedBoxPad = options.boxColor ? options.boxPadding : 0
  const side = options.padding + usedBoxPad
      const maxWidth = canvasWidth - side * 2
      const maxHeight = Math.floor(canvasHeight * 0.5)
  const baseCandidate = Math.floor(canvasWidth / 7)
  const base = Math.max(14, Math.floor(Math.min(options.fontMax, baseCandidate) * options.fontScale))
      const { size, lines, lineHeight } = chooseFontSize(ctx, options.text, maxWidth, maxHeight, base)
      ctx.font = `${options.fontWeight} ${size}px ${options.fontFamily}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'alphabetic'

      const textHeight = lines.length * lineHeight
      let y
  if (options.position === 'top') y = options.margin + usedBoxPad + lineHeight
      else if (options.position === 'center') y = Math.floor(canvasHeight / 2 - textHeight / 2) + lineHeight
  else y = canvasHeight - options.margin - usedBoxPad - textHeight + lineHeight

  const boxTop = y - lineHeight - usedBoxPad
  const boxHeight = textHeight + usedBoxPad * 2
      const boxLeft = options.padding
      const boxWidth = canvasWidth - options.padding * 2

      if (options.boxColor) {
        ctx.fillStyle = options.boxColor
        ctx.fillRect(boxLeft, boxTop, boxWidth, boxHeight)
      }

  ctx.lineWidth = options.strokeWidth
  ctx.fillStyle = options.textColor

      let cy = y
      for (const line of lines.slice(0, options.maxLines)) {
        if (options.strokeWidth > 0) {
          const sc = (typeof opts.strokeColor === 'string') ? opts.strokeColor : ctx.fillStyle
          ctx.strokeStyle = sc
          ctx.strokeText(line, Math.floor(canvasWidth / 2), cy)
        }
        ctx.fillText(line, Math.floor(canvasWidth / 2), cy)
        cy += lineHeight
      }
    }

  let inputBuffer
    if (Buffer.isBuffer(img)) {
      inputBuffer = img
    } else if (typeof img === 'string' && /^(data:|https?:)/i.test(img)) {
      if (/^https?:/i.test(img)) {
        const r = await fetch(img)
        if (!r.ok) throw new Error('No se pudo descargar la imagen URL')
        inputBuffer = Buffer.from(await r.arrayBuffer())
      } else if (img.startsWith('data:')) {
        inputBuffer = Buffer.from(img.split(',')[1], 'base64')
      }
    } else if (url) {
      const r = await fetch(url)
      if (!r.ok) throw new Error('No se pudo descargar la imagen URL')
      inputBuffer = Buffer.from(await r.arrayBuffer())
    }

    let ft
    try { ft = await fileTypeFromBuffer(inputBuffer) } catch {}
    const isImage = !!ft && /^image\//i.test(ft.mime)

    let processed = inputBuffer
    if (inputBuffer && isImage && ft.mime !== 'image/webp') {
      try {
        const imgLoaded = await loadImage(inputBuffer)
        const canvas = createCanvas(MAX, MAX)
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, MAX, MAX)
        const iw = imgLoaded.width
        const ih = imgLoaded.height
        let dw = MAX, dh = MAX, dx = 0, dy = 0
        if (options.mode === 'contain') {
          const scale = Math.min(MAX / iw, MAX / ih)
          dw = Math.round(iw * scale)
          dh = Math.round(ih * scale)
          dx = Math.round((MAX - dw) / 2)
          dy = Math.round((MAX - dh) / 2)
        } else {
          const scale = Math.max(MAX / iw, MAX / ih)
          dw = Math.round(iw * scale)
          dh = Math.round(ih * scale)
          dx = Math.round((MAX - dw) / 2)
          dy = Math.round((MAX - dh) / 2)
        }
        ctx.drawImage(imgLoaded, dx, dy, dw, dh)
        drawText(ctx, MAX, MAX)
        processed = canvas.toBuffer('image/webp', { quality: 100 })
      } catch {}
    }

    if ((!inputBuffer || !isImage) && options.text && !url) {
      const canvas = createCanvas(MAX, MAX)
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, MAX, MAX)
      drawText(ctx, MAX, MAX)
      processed = canvas.toBuffer('image/webp', { quality: 100 })
    }

    let finalWebp
    if (!processed || !processed.length) throw new Error('Procesamiento vacío')
    const imgWebp = new webp.Image()
    try {
      await imgWebp.load(processed)
    } catch {
      const st = new Sticker(processed, { type: 'full' })
      const buf2 = await st.toBuffer()
      await imgWebp.load(buf2)
    }
    const stickerPackId = crypto.randomBytes(32).toString('hex')
    const json = {
      'sticker-pack-id': stickerPackId,
      'sticker-pack-name': packName,
      'sticker-pack-publisher': authorName,
      emojis: []
    }
    const exifAttr = Buffer.from([
      0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00,
      0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x16, 0x00, 0x00, 0x00
    ])
    const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8')
    const exif = Buffer.concat([exifAttr, jsonBuffer])
    exif.writeUIntLE(jsonBuffer.length, 14, 4)
    imgWebp.exif = exif
    finalWebp = await imgWebp.save(null)
    return finalWebp
  } catch (error) {
    throw new Error(`❌ Error creando sticker: ${error.message}`)
  }
}

export async function addExif(buffer, packname, author, categories = []) {
  const img = new webp.Image()
  await img.load(buffer)
  const stickerPackId = crypto.randomBytes(32).toString('hex')
  const json = {
    'sticker-pack-id': stickerPackId,
    'sticker-pack-name': packname,
    'sticker-pack-publisher': author,
    emojis: categories
  }
  const exifAttr = Buffer.from([
    0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00,
    0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x16, 0x00, 0x00, 0x00
  ])
  const jsonBuffer = Buffer.from(JSON.stringify(json), 'utf-8')
  const exif = Buffer.concat([exifAttr, jsonBuffer])
  exif.writeUIntLE(jsonBuffer.length, 14, 4)
  img.exif = exif
  return await img.save(null)
}

export async function mp4ToWebp(file, stickerMetadata) {
  const getBase64 = file.toString('base64')
  const Format = {
    file: `data:video/mp4;base64,${getBase64}`,
    processOptions: {
      crop: stickerMetadata?.crop,
      startTime: '00:00:00.0',
      endTime: '00:00:30.0',
      loop: 0
    },
    stickerMetadata: { ...stickerMetadata },
    sessionInfo: {
      WA_VERSION: '2.2106.5',
      PAGE_UA: 'WhatsApp/2.2037.6 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36',
      WA_AUTOMATE_VERSION: '3.6.10 UPDATE AVAILABLE: 3.6.11',
      BROWSER_VERSION: 'HeadlessChrome/88.0.4324.190',
      OS: 'Windows Server 2016',
      START_TS: 1614310326309,
      NUM: '6247',
      LAUNCH_TIME_MS: 7934,
      PHONE_VERSION: '2.20.205.16'
    },
    config: {
      sessionId: 'session',
      headless: true,
      qrTimeout: 20,
      authTimeout: 0,
      cacheEnabled: false,
      useChrome: true,
      killProcessOnBrowserClose: true,
      throwErrorOnTosBlock: false,
      chromiumArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--aggressive-cache-discard',
        '--disable-cache',
        '--disable-application-cache',
        '--disable-offline-load-stale-cache',
        '--disk-cache-size=0'
      ],
         executablePath: undefined,
      skipBrokenMethodsCheck: true,
      stickerServerEndpoint: true
    }
  }
  const res = await fetch('https://sticker-api.openwa.dev/convertMp4BufferToWebpDataUrl', {
    method: 'post',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(Format)
  })
  return Buffer.from((await res.text()).split(';base64,')[1], 'base64')
}

export async function fakechat(text, name, avatar, url = false, isHD = false) {
  const body = {
    type: 'quote',
    format: 'png',
    backgroundColor: '#FFFFFF',
    width: isHD ? 1024 : 512,
    height: isHD ? 1536 : 768,
    scale: isHD ? 4 : 2,
    messages: [
      {
        entities: [],
        media: url ? { url } : null,
        avatar: true,
        from: { id: 1, name, photo: { url: avatar } },
        text,
        replyMessage: {}
      }
    ]
  }
  const response = await fetch('https://btzqc.betabotz.eu.org/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!response.ok) throw new Error(`HTTP Error ${response.status}`)
  const { result } = await response.json()
  return Buffer.from(result.image, 'base64')
}

export default { sticker, addExif, mp4ToWebp, fakechat }
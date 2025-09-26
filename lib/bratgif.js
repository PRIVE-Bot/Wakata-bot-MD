import { createCanvas, loadImage } from '@napi-rs/canvas'
import fetch from 'node-fetch'
import GIFEncoder from 'gif-encoder-2'
import { parseBratArgs } from './brat.js'

const _gifEmojiCache = new Map()
const EMOJI_REGEX = /\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*/u

function emojiToCodePoints(str) {
  const cps = []
  for (const ch of [...str]) cps.push(ch.codePointAt(0).toString(16))
  return cps.join('-')
}

function splitWordSegments(word) {
  const segs = []
  let i = 0
  while (i < word.length) {
    const slice = word.slice(i)
    const m = EMOJI_REGEX.exec(slice)
    if (m && m.index === 0) {
      segs.push({ type: 'emoji', v: m[0] })
      i += m[0].length
    } else {
      let j = 0
      while (j < slice.length) {
        const s2 = slice.slice(j)
        const m2 = EMOJI_REGEX.exec(s2)
        if (m2 && m2.index === 0) break
        j += [...s2][0].length
      }
      const chunk = slice.slice(0, j)
      if (chunk) segs.push({ type: 'text', v: chunk })
      i += j
    }
  }
  return segs
}

async function fetchRemoteEmoji(emoji, provider) {
  try {
    const code = emojiToCodePoints(emoji)
    const cacheKey = provider + ':' + code
    if (_gifEmojiCache.has(cacheKey)) return _gifEmojiCache.get(cacheKey)
    let url
    if (provider === 'twemoji') url = `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${code}.png`
    else if (provider === 'openmoji') url = `https://raw.githubusercontent.com/hfg-gmuend/openmoji/master/color/618x618/${code.toUpperCase()}.png`
    else return null
    const r = await fetch(url)
    if (!r.ok) throw new Error('fetch fail')
    const buf = Buffer.from(await r.arrayBuffer())
    const img = await loadImage(buf).catch(() => null)
    if (img) _gifEmojiCache.set(cacheKey, img)
    return img
  } catch { return null }
}

function measureWord(ctx, fontSize, word, opt) {
  const segs = splitWordSegments(word)
  let w = 0
  for (const s of segs) {
    if (s.type === 'text') w += ctx.measureText(s.v).width
    else w += fontSize * (opt.emojiscale || 1)
  }
  return w
}

function computeLayout(ctx, words, fontSize, width, height, layout, opt) {
  const lineHeight = Math.round(fontSize * 1.2)
  const marginTop = 20
  const marginLeft = 20
  if (layout === 'columns') {
    const marginRight = 20
    const colGap = Math.max(12, Math.round(fontSize * 0.6))
    const rows = Math.ceil(words.length / 2)
    const neededH = marginTop + rows * lineHeight
    if (neededH > height - 20) return { fits: false }
    let maxLeft = 0
    let maxRowTotal = 0
    for (let i = 0; i < words.length; i += 2) {
      const L = words[i] || ''
      const R = words[i + 1] || ''
      const wL = measureWord(ctx, fontSize, L, opt)
      const wR = measureWord(ctx, fontSize, R, opt)
      if (wL > maxLeft) maxLeft = wL
      const rowT = wL + (R ? colGap + wR : 0)
      if (rowT > maxRowTotal) maxRowTotal = rowT
    }
    const totalW = marginLeft + maxRowTotal + marginRight
    if (totalW > width) return { fits: false }
    return { fits: true, lineHeight, marginTop, marginLeft, colGap, maxLeft }
  }
  // lines
  const neededH = marginTop + words.length * lineHeight
  if (neededH > height - 20) return { fits: false }
  return { fits: true, lineHeight, marginTop, marginLeft }
}

async function drawWord(ctx, fontSize, x, y, word, opt) {
  const segs = splitWordSegments(word)
  let cursor = x
  const providerBase = opt.emoji === 'auto' ? 'twemoji' : (opt.emoji === 'apple' ? 'twemoji' : opt.emoji)
  for (const s of segs) {
    if (s.type === 'text') {
      ctx.fillText(s.v, cursor, y)
      cursor += ctx.measureText(s.v).width
    } else {
      const drawSize = fontSize * (opt.emojiscale || 1)
      let drawn = false
      if (opt.emoji !== 'none' && opt.emoji !== 'native') {
        if (providerBase === 'twemoji' || providerBase === 'openmoji') {
          const img = await fetchRemoteEmoji(s.v, providerBase)
          if (img) {
            ctx.drawImage(img, cursor, y, drawSize, drawSize)
            cursor += drawSize
            drawn = true
          }
        }
      }
      if (!drawn) { ctx.fillText(s.v, cursor, y); cursor += drawSize }
    }
  }
}

async function paint(ctx, fontSize, meta, layout, words, opt) {
  if (layout === 'columns') {
    const { lineHeight, marginTop, marginLeft, colGap, maxLeft } = meta
    const secondColX = marginLeft + maxLeft + colGap
    for (let i = 0; i < words.length; i += 2) {
      const row = Math.floor(i / 2)
      const y = marginTop + row * lineHeight
      await drawWord(ctx, fontSize, marginLeft, y, words[i] || '', opt)
      if (words[i + 1]) await drawWord(ctx, fontSize, secondColX, y, words[i + 1], opt)
    }
  } else {
    const { lineHeight, marginTop, marginLeft } = meta
    for (let i = 0; i < words.length; i++) {
      await drawWord(ctx, fontSize, marginLeft, marginTop + i * lineHeight, words[i], opt)
    }
  }
}

export async function generateBratGif(raw, extraOpts = {}) {
  const opt = parseBratArgs(raw)
  const delay = Number.isFinite(extraOpts.delay) ? extraOpts.delay : (() => {
    const m = /delay=(\d{1,5})/i.exec(raw || '')
    return m ? Math.min(2000, parseInt(m[1], 10)) : 300
  })()
  const repeat = Number.isFinite(extraOpts.repeat) ? extraOpts.repeat : (() => {
    const m = /repeat=(\d{1,3})/i.exec(raw || '')
    return m ? Math.min(100, parseInt(m[1], 10)) : 0
  })()

  const { text, bg, color, width, height, font } = opt
  let { layout } = opt
  const allWords = text.split(/\s+/).filter(Boolean)
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  let fontSize = opt.size
  let meta, chosenLayout = layout

  while (fontSize >= 18) {
    ctx.font = `300 ${fontSize}px ${font}`
    if (layout === 'auto') {
      meta = computeLayout(ctx, allWords, fontSize, width, height, 'lines', opt)
      if (meta.fits) { chosenLayout = 'lines'; break }
      meta = computeLayout(ctx, allWords, fontSize, width, height, 'columns', opt)
      if (meta.fits) { chosenLayout = 'columns'; break }
    } else {
      meta = computeLayout(ctx, allWords, fontSize, width, height, layout, opt)
      if (meta.fits) { chosenLayout = layout; break }
    }
    fontSize -= 2
  }
  if (!meta || !meta.fits) {
    fontSize = Math.max(18, fontSize)
    if (layout === 'auto') {
      meta = computeLayout(ctx, allWords, fontSize, width, height, 'lines', opt)
      if (!meta.fits) meta = computeLayout(ctx, allWords, fontSize, width, height, 'columns', opt)
      chosenLayout = meta.fits ? (meta.colGap ? 'columns' : 'lines') : 'lines'
    } else {
      meta = computeLayout(ctx, allWords, fontSize, width, height, chosenLayout, opt)
    }
  }

  ctx.font = `300 ${fontSize}px ${font}`

  const providerBase = opt.emoji === 'auto' ? 'twemoji' : (opt.emoji === 'apple' ? 'twemoji' : opt.emoji)
  if (providerBase && providerBase !== 'none' && providerBase !== 'native') {
    const uniqueEmoji = new Set()
    for (const w of allWords) for (const seg of splitWordSegments(w)) if (seg.type === 'emoji') uniqueEmoji.add(seg.v)
    await Promise.all([...uniqueEmoji].map(e => fetchRemoteEmoji(e, providerBase)))
  }

  const encoder = new GIFEncoder(width, height)
  encoder.start()
  encoder.setRepeat(repeat)
  encoder.setDelay(delay)
  encoder.setQuality(10)

  for (let i = 1; i <= allWords.length; i++) {
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = color
    ctx.textBaseline = 'top'
    ctx.textAlign = 'left'
    const sliceWords = allWords.slice(0, i)
    const metaFrame = computeLayout(ctx, sliceWords, fontSize, width, height, chosenLayout, opt)
    await paint(ctx, fontSize, metaFrame.fits ? metaFrame : meta, chosenLayout, sliceWords, opt)
    encoder.addFrame(ctx)
  }

  const lastFramePNG = Buffer.from(canvas.toBuffer('image/png'))
  encoder.addFrame(ctx)
  encoder.finish()
  const buffer = Buffer.from(encoder.out.getData())
  const opts = { ...opt, finalFontSize: fontSize, finalLayout: chosenLayout }
  return { buffer, frames: allWords.length + 1, finalFontSize: fontSize, finalLayout: chosenLayout, delay, repeat, opts, lastFramePNG }
}

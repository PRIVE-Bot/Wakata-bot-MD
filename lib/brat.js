import { createCanvas, loadImage } from '@napi-rs/canvas'
import fetch from 'node-fetch'

export const PRESET_COLORS = {
  green: { bg: '#8fff00', color: '#000000' },
  pink: { bg: '#ff006e', color: '#ffffff' },
  cyan: { bg: '#00f5ff', color: '#000000' },
  black: { bg: '#000000', color: '#8fff00' },
  white: { bg: '#ffffff', color: '#000000' },
  gold: { bg: '#ffd700', color: '#000000' }
}

/**
 * @returns {{text:string,size:number,bg:string,color:string,width:number,height:number,font:string}}
 */
export function parseBratArgs(raw) {
  const out = {
    text: '',
    size: 60,
    bg: '#8fff00',
    color: '#000000',
    width: 400,
    height: 400,
    font: 'Arial Narrow, "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", Arial, sans-serif',
    layout: 'auto', 
    emoji: 'auto', 
    emojiscale: 1.0
  }
  if (!raw) { out.text = 'brat summer'; return out }
  const tokens = raw.match(/(?:"[^"]+"|'[^']+'|\S+)/g) || []
  const free = []
  for (const t of tokens) {
    const kv = t.split('=')
    if (kv.length > 1) {
      const key = kv.shift().toLowerCase()
      const value = kv.join('=')
      switch (key) {
        case 'size': {
          const n = parseInt(value, 10)
          if (Number.isFinite(n)) out.size = Math.min(160, Math.max(20, n))
          break
        }
        case 'bg': out.bg = value.replace(/^"|"$/g, ''); break
        case 'color': out.color = value.replace(/^"|"$/g, ''); break
        case 'dim': {
          const m = /^(\d{2,4})x(\d{2,4})$/i.exec(value)
          if (m) {
            out.width = Math.min(1200, Math.max(200, parseInt(m[1], 10)))
            out.height = Math.min(1200, Math.max(200, parseInt(m[2], 10)))
          }
          break
        }
        case 'font': {
          const base = value.replace(/^['"]|['"]$/g, '')
          out.font = `${base}, "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", Arial, sans-serif`
          break
        }
        case 'preset': {
          const p = PRESET_COLORS[value.toLowerCase()]
          if (p) { out.bg = p.bg; out.color = p.color }
          break
        }
        case 'layout': {
          const v = value.toLowerCase()
          if (/auto/.test(v)) out.layout = 'auto'
          else if (/(lines?|line)/.test(v)) out.layout = 'lines'
          else if (/(column|columns|cols2)/.test(v)) out.layout = 'columns'
          break
        }
        case 'emoji': {
          const v = value.toLowerCase()
          if (/^(auto|twemoji|openmoji|native|none|apple)$/.test(v)) out.emoji = v === 'apple' ? 'twemoji' : v
          break
        }
        case 'emojiscale': {
          const n = parseFloat(value)
          if (Number.isFinite(n) && n > 0.2 && n <= 3) out.emojiscale = n
          break
        }
      }
    } else free.push(t)
  }
  for (const f of free) {
    const lower = f.toLowerCase()
    if (PRESET_COLORS[lower]) { out.bg = PRESET_COLORS[lower].bg; out.color = PRESET_COLORS[lower].color }
    else if (/^columns?$/.test(lower)) out.layout = 'columns'
    else if (/^auto$/.test(lower)) out.layout = 'auto'
    else if (/^lines?$/.test(lower)) out.layout = 'lines'
    else if (/^(lower|lowercase)$/i.test(lower)) out.__forceLower = true
    else if (/^twemoji$/.test(lower)) out.emoji = 'twemoji'
    else if (/^openmoji$/.test(lower)) out.emoji = 'openmoji'
    else if (/^apple$/.test(lower)) out.emoji = 'twemoji'
    else out.text += (out.text ? ' ' : '') + f
  }
  if (!out.text.trim()) out.text = 'brat summer'
  if (out.__forceLower) out.text = out.text.toLowerCase()
  return out
}

/**
 * @param {{text:string,size:number,bg:string,color:string,width:number,height:number,font:string}} opt
 * @returns {Buffer}
 */
const _emojiCache = new Map()
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

async function fetchTwemoji(emoji) {
  try {
    const code = emojiToCodePoints(emoji)
    if (_emojiCache.has(code)) return _emojiCache.get(code)
    const url = `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${code}.png`
    const r = await fetch(url)
    if (!r.ok) throw new Error('fetch fail')
    const buf = Buffer.from(await r.arrayBuffer())
    const img = await loadImage(buf).catch(() => null)
    if (img) _emojiCache.set(code, img)
    return img
  } catch { return null }
}

async function fetchRemoteEmoji(emoji, provider) {
  try {
    const cacheKey = provider + ':' + emojiToCodePoints(emoji)
    if (_emojiCache.has(cacheKey)) return _emojiCache.get(cacheKey)
    let url
    if (provider === 'twemoji') url = `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/${emojiToCodePoints(emoji)}.png`
    else if (provider === 'openmoji') url = `https://raw.githubusercontent.com/hfg-gmuend/openmoji/master/color/618x618/${emojiToCodePoints(emoji).toUpperCase()}.png`
    else return null
    const r = await fetch(url)
    if (!r.ok) throw new Error('fetch fail')
    const buf = Buffer.from(await r.arrayBuffer())
    const img = await loadImage(buf).catch(() => null)
    if (img) _emojiCache.set(cacheKey, img)
    return img
  } catch { return null }
}

export async function drawBratCanvas(opt) {
  const { text, size, bg, color, width, height, font, emoji } = opt
  let { layout } = opt
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = color
  ctx.textBaseline = 'top'
  ctx.textAlign = 'left'
  const words = text.split(/\s+/).filter(Boolean)

  function measureWord(fontSize, word) {
    const segs = splitWordSegments(word)
    let w = 0
    for (const s of segs) {
      if (s.type === 'text') w += ctx.measureText(s.v).width
      else w += fontSize * (opt.emojiscale || 1)
    }
    return w
  }

  function computeLayout(fontSize, forced = null) {
    const use = forced || layout
    ctx.font = `300 ${fontSize}px ${font}`
    const lineHeight = Math.round(fontSize * 1.2)
    const marginTop = 20
    const marginLeft = 20
    if (use === 'columns') {
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
        const wL = measureWord(fontSize, L)
        const wR = measureWord(fontSize, R)
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

  async function drawWord(fontSize, x, y, word) {
    const segs = splitWordSegments(word)
    let cursor = x
    for (const s of segs) {
      if (s.type === 'text') {
        ctx.fillText(s.v, cursor, y)
        cursor += ctx.measureText(s.v).width
      } else {
        let drawn = false
        const drawSize = fontSize * (opt.emojiscale || 1)
        if (emoji !== 'none' && emoji !== 'native') {
          let provider = emoji === 'auto' ? 'twemoji' : emoji
          if (provider === 'apple') provider = 'twemoji'
          if (provider === 'twemoji' || provider === 'openmoji') {
            const img = await fetchRemoteEmoji ? await fetchRemoteEmoji(s.v, provider) : await fetchTwemoji(s.v)
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

  async function paint(fontSize, meta, forced = null) {
    const use = forced || layout
    if (use === 'columns') {
      const { lineHeight, marginTop, marginLeft, colGap, maxLeft } = meta
      const secondColX = marginLeft + maxLeft + colGap
      for (let i = 0; i < words.length; i += 2) {
        const row = Math.floor(i / 2)
        const y = marginTop + row * lineHeight
        await drawWord(fontSize, marginLeft, y, words[i] || '')
        if (words[i + 1]) await drawWord(fontSize, secondColX, y, words[i + 1])
      }
    } else {
      const { lineHeight, marginTop, marginLeft } = meta
      for (let i = 0; i < words.length; i++) {
        await drawWord(fontSize, marginLeft, marginTop + i * lineHeight, words[i])
      }
    }
  }

  let fontSize = size
  let chosenLayout = layout
  let meta
  while (fontSize >= 18) {
    if (layout === 'auto') {
      meta = computeLayout(fontSize, 'lines')
      if (meta.fits) { chosenLayout = 'lines'; break }
      meta = computeLayout(fontSize, 'columns')
      if (meta.fits) { chosenLayout = 'columns'; break }
    } else {
      meta = computeLayout(fontSize, layout)
      if (meta.fits) { chosenLayout = layout; break }
    }
    fontSize -= 2
  }
  const finalFont = fontSize < 18 ? 18 : fontSize
  if (!meta || !meta.fits) {
    if (layout === 'auto') {
      meta = computeLayout(finalFont, 'lines')
      if (!meta.fits) meta = computeLayout(finalFont, 'columns')
      chosenLayout = meta.fits ? (meta.colGap ? 'columns' : 'lines') : 'lines'
    } else meta = computeLayout(finalFont, chosenLayout)
  }
  ctx.font = `300 ${finalFont}px ${font}`
  await paint(finalFont, meta, chosenLayout)
  opt.finalFontSize = finalFont
  opt.finalLayout = chosenLayout
  return canvas.toBuffer('image/png')
}

/**
 * @param {string} raw
 */
export async function generateBrat(raw) {
  const opts = parseBratArgs(raw)
  const buffer = await drawBratCanvas(opts)
  return { buffer, opts }
}

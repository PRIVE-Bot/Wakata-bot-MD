// plugins/welcomeHandler.js
import { DOMImplementation, XMLSerializer } from '@xmldom/xmldom'
import JsBarcode from 'jsbarcode'
import { JSDOM } from 'jsdom'
import { readFileSync } from 'fs'
import { join } from 'path'
import { spawn } from 'child_process'

// Rutas por defecto
const src = join(new URL('.', import.meta.url).pathname, '..', 'src')

// SVG por defecto si no existe welcome.svg
const defaultSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400">
  <rect width="800" height="400" fill="#222"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-size="48">Bienvenido</text>
</svg>`

// Función para convertir SVG a imagen (PNG/JPG) usando ImageMagick
const toImg = (svg, format = 'png') =>
  new Promise((resolve, reject) => {
    if (!svg) return resolve(Buffer.alloc(0))
    const bufs = []
    const im = spawn('magick', ['convert', 'svg:-', `${format}:-`])
    im.on('error', e => reject(e))
    im.stdout.on('data', chunk => bufs.push(chunk))
    im.stdin.write(Buffer.from(svg))
    im.stdin.end()
    im.on('close', code => {
      if (code !== 0) reject(new Error(`ImageMagick exited with code ${code}`))
      resolve(Buffer.concat(bufs))
    })
  })

// Convierte buffer a Base64
const toBase64 = (buffer, mime) => `data:${mime};base64,${buffer.toString('base64')}`

// Genera código de barras SVG
const barcode = data => {
  const xmlSerializer = new XMLSerializer()
  const doc = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null)
  const svgNode = doc.createElementNS('http://www.w3.org/2000/svg', 'svg')
  JsBarcode(svgNode, data, { xmlDocument: doc })
  return xmlSerializer.serializeToString(svgNode)
}

const imageSetter = (img, value) => { if (img) img.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', value) }
const textSetter = (el, value) => { if (el) el.textContent = value }

// Genera SVG dinámico con los datos
const genSVG = async ({ wid = '', pp = null, title = '', name = '', text = '', background = null } = {}) => {
  const svgContent = defaultSVG
  const { document: svgDoc } = new JSDOM(svgContent).window

  // Agregar texto dinámico
  const titleEl = svgDoc.createElement('text')
  titleEl.setAttribute('x', '50%')
  titleEl.setAttribute('y', '20%')
  titleEl.setAttribute('text-anchor', 'middle')
  titleEl.setAttribute('fill', '#fff')
  titleEl.setAttribute('font-size', '36')
  titleEl.textContent = title
  svgDoc.body.appendChild(titleEl)

  const nameEl = svgDoc.createElement('text')
  nameEl.setAttribute('x', '50%')
  nameEl.setAttribute('y', '50%')
  nameEl.setAttribute('text-anchor', 'middle')
  nameEl.setAttribute('fill', '#fff')
  nameEl.setAttribute('font-size', '48')
  nameEl.textContent = name
  svgDoc.body.appendChild(nameEl)

  const textEl = svgDoc.createElement('text')
  textEl.setAttribute('x', '50%')
  textEl.setAttribute('y', '80%')
  textEl.setAttribute('text-anchor', 'middle')
  textEl.setAttribute('fill', '#fff')
  textEl.setAttribute('font-size', '28')
  textEl.textContent = text
  svgDoc.body.appendChild(textEl)

  // Agregar código de barras si wid existe
  if (wid) {
    const codeImg = svgDoc.createElement('image')
    codeImg.setAttribute('x', '50')
    codeImg.setAttribute('y', '320')
    codeImg.setAttribute('width', '200')
    codeImg.setAttribute('height', '50')
    codeImg.setAttribute('xlink:href', toBase64(await toImg(barcode(wid.replace(/[^0-9]/g, '')), 'png'), 'image/png'))
    svgDoc.body.appendChild(codeImg)
  }

  return svgDoc.body.innerHTML
}

// Renderiza imagen final desde SVG
const renderWelcome = async ({
  wid = '',
  pp = null,
  name = 'Usuario',
  title = 'Bienvenido',
  text = '¡Hola!',
  background = null
} = {}, format = 'png') => {
  const svg = await genSVG({ wid, pp, name, title, text, background })
  return await toImg(svg, format)
}

// Handler del comando
let handler = async (m, { conn }) => {
  try {
    const name = await conn.getName(m.sender)
    let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => null)
    if (!pp) pp = null

    const img = await renderWelcome({
      wid: m.sender,
      pp,
      name,
      title: 'Grupo de Prueba',
      text: 'Bienvenido a la familia!',
    }, 'jpg')

    await conn.sendFile(m.chat, img, 'welcome.jpg', `✦ 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 ✦\n\nHola ${name}`, m)
  } catch (e) {
    console.error(e)
    m.reply('❌ Error al generar el welcome')
  }
}

handler.help = ['welcome']
handler.tags = ['tools']
handler.command = ['1']

export default handler
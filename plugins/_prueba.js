// plugins/welcomeHandler.js
import { DOMImplementation, XMLSerializer } from '@xmldom/xmldom'
import JsBarcode from 'jsbarcode'
import { JSDOM } from 'jsdom'
import { spawn } from 'child_process'

/**
 * Convierte SVG a PNG/JPG usando ImageMagick si existe, o devuelve buffer crudo
 * (en servidores sin magick, podemos retornar SVG como PNG base64)
 */
const toImg = (svg, format = 'png') =>
  new Promise((resolve, reject) => {
    try {
      const bufs = []
      const im = spawn('magick', ['convert', 'svg:-', `${format}:-`])
      im.on('error', () => {
        // Si no hay magick, retornamos SVG como buffer (PNG no disponible)
        return resolve(Buffer.from(svg))
      })
      im.stdout.on('data', chunk => bufs.push(chunk))
      im.stdin.write(Buffer.from(svg))
      im.stdin.end()
      im.on('close', code => resolve(Buffer.concat(bufs)))
    } catch (e) {
      resolve(Buffer.from(svg))
    }
  })

/**
 * Genera un SVG de bienvenida en memoria
 */
const genSVG = async ({ wid = '', name = 'Usuario', title = 'Grupo', text = '¡Bienvenido!' } = {}) => {
  const xmlSerializer = new XMLSerializer()
  const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null)

  const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svgNode.setAttribute('width', '800')
  svgNode.setAttribute('height', '400')
  svgNode.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

  // Fondo
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  rect.setAttribute('width', '800')
  rect.setAttribute('height', '400')
  rect.setAttribute('fill', '#222')
  svgNode.appendChild(rect)

  // Título
  const titleEl = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  titleEl.setAttribute('x', '50%')
  titleEl.setAttribute('y', '60')
  titleEl.setAttribute('text-anchor', 'middle')
  titleEl.setAttribute('fill', '#fff')
  titleEl.setAttribute('font-size', '36')
  titleEl.textContent = title
  svgNode.appendChild(titleEl)

  // Nombre
  const nameEl = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  nameEl.setAttribute('x', '50%')
  nameEl.setAttribute('y', '180')
  nameEl.setAttribute('text-anchor', 'middle')
  nameEl.setAttribute('fill', '#FFD700')
  nameEl.setAttribute('font-size', '48')
  nameEl.textContent = name
  svgNode.appendChild(nameEl)

  // Texto
  const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  textEl.setAttribute('x', '50%')
  textEl.setAttribute('y', '300')
  textEl.setAttribute('text-anchor', 'middle')
  textEl.setAttribute('fill', '#fff')
  textEl.setAttribute('font-size', '28')
  textEl.textContent = text
  svgNode.appendChild(textEl)

  // Código de barras
  if (wid) {
    const codeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    JsBarcode(codeSvg, wid.replace(/[^0-9]/g, ''), { xmlDocument: document })
    codeSvg.setAttribute('x', '300')
    codeSvg.setAttribute('y', '320')
    codeSvg.setAttribute('width', '200')
    codeSvg.setAttribute('height', '50')
    svgNode.appendChild(codeSvg)
  }

  return xmlSerializer.serializeToString(svgNode)
}

/**
 * Renderiza el welcome como buffer listo para enviar
 */
const renderWelcome = async (options = {}, format = 'png') => {
  const svg = await genSVG(options)
  const img = await toImg(svg, format)
  return img
}

/**
 * Handler del comando
 */
let handler = async (m, { conn }) => {
  try {
    const name = await conn.getName(m.sender)
    const img = await renderWelcome({
      wid: m.sender,
      name,
      title: 'Grupo de Prueba',
      text: 'Bienvenido a la familia!',
    }, 'png')

    await conn.sendFile(m.chat, img, 'welcome.png', `✦ 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 ✦\n\nHola ${name}`, m)
  } catch (e) {
    console.error(e)
    m.reply('❌ Error al generar el welcome')
  }
}

handler.help = ['welcome']
handler.tags = ['tools']
handler.command = ['1']

export default handler
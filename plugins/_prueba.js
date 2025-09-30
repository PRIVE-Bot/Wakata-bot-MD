// plugins/welcomeHandler.js
import { DOMImplementation, XMLSerializer } from '@xmldom/xmldom'
import JsBarcode from 'jsbarcode'
import sharp from 'sharp'

/**
 * Genera SVG de bienvenida
 */
const genSVG = ({ wid = '', name = 'Usuario', title = 'Grupo', text = '¡Bienvenido!' } = {}) => {
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
 * Renderiza SVG a PNG usando sharp
 */
const renderWelcome = async (options = {}) => {
  const svg = genSVG(options)
  const buffer = await sharp(Buffer.from(svg)).png().toBuffer()
  return buffer
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
    })

    await conn.sendMessage(m.chat, { image: img, caption: `✦ 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 ✦\n\nHola ${name}` }, { quoted: m })
  } catch (e) {
    console.error(e)
    m.reply('❌ Error al generar el welcome')
  }
}

handler.help = ['welcome']
handler.tags = ['tools']
handler.command = ['1']

export default handler
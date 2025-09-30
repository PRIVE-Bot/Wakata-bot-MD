// plugins/welcomeTech.js
import { DOMImplementation, XMLSerializer } from '@xmldom/xmldom'
import JsBarcode from 'jsbarcode'
import sharp from 'sharp'

/**
 * Genera SVG de bienvenida estilo tecnológico
 */
const genSVG = async ({ wid = '', name = 'Usuario', title = 'Grupo', text = '¡Bienvenido!', avatarUrl = '' } = {}) => {
  const xmlSerializer = new XMLSerializer()
  const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null)

  const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svgNode.setAttribute('width', '800')
  svgNode.setAttribute('height', '400')
  svgNode.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

  // Fondo con gradiente tecnológico
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
  const linearGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient')
  linearGradient.setAttribute('id', 'grad1')
  linearGradient.setAttribute('x1', '0%')
  linearGradient.setAttribute('y1', '0%')
  linearGradient.setAttribute('x2', '100%')
  linearGradient.setAttribute('y2', '100%')
  const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
  stop1.setAttribute('offset', '0%')
  stop1.setAttribute('style', 'stop-color:#0f2027;stop-opacity:1')
  const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
  stop2.setAttribute('offset', '100%')
  stop2.setAttribute('style', 'stop-color:#2c5364;stop-opacity:1')
  linearGradient.appendChild(stop1)
  linearGradient.appendChild(stop2)
  defs.appendChild(linearGradient)
  svgNode.appendChild(defs)

  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  rect.setAttribute('width', '800')
  rect.setAttribute('height', '400')
  rect.setAttribute('fill', 'url(#grad1)')
  svgNode.appendChild(rect)

  // Avatar circular
  if (avatarUrl) {
    const imgEl = document.createElementNS('http://www.w3.org/2000/svg', 'image')
    imgEl.setAttribute('href', avatarUrl)
    imgEl.setAttribute('x', '50')
    imgEl.setAttribute('y', '50')
    imgEl.setAttribute('width', '120')
    imgEl.setAttribute('height', '120')
    imgEl.setAttribute('clip-path', 'circle(60px at 60px 60px)')
    svgNode.appendChild(imgEl)
  }

  // Título
  const titleEl = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  titleEl.setAttribute('x', '50%')
  titleEl.setAttribute('y', '80')
  titleEl.setAttribute('text-anchor', 'middle')
  titleEl.setAttribute('fill', '#00ffff')
  titleEl.setAttribute('font-size', '36')
  titleEl.setAttribute('font-family', 'monospace')
  titleEl.textContent = title
  svgNode.appendChild(titleEl)

  // Nombre
  const nameEl = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  nameEl.setAttribute('x', '50%')
  nameEl.setAttribute('y', '220')
  nameEl.setAttribute('text-anchor', 'middle')
  nameEl.setAttribute('fill', '#ff00ff')
  nameEl.setAttribute('font-size', '48')
  nameEl.setAttribute('font-family', 'monospace')
  nameEl.textContent = name
  svgNode.appendChild(nameEl)

  // Texto
  const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  textEl.setAttribute('x', '50%')
  textEl.setAttribute('y', '300')
  textEl.setAttribute('text-anchor', 'middle')
  textEl.setAttribute('fill', '#00ffcc')
  textEl.setAttribute('font-size', '28')
  textEl.setAttribute('font-family', 'monospace')
  textEl.textContent = text
  svgNode.appendChild(textEl)

  // Código de barras en la parte inferior
  if (wid) {
    const codeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    JsBarcode(codeSvg, wid.replace(/[^0-9]/g, ''), {
      xmlDocument: document,
      lineColor: "#00ffff",
      background: "transparent",
      width: 2,
      height: 50,
      displayValue: false
    })
    codeSvg.setAttribute('x', '300')
    codeSvg.setAttribute('y', '340')
    codeSvg.setAttribute('width', '200')
    codeSvg.setAttribute('height', '50')
    svgNode.appendChild(codeSvg)
  }

  return new XMLSerializer().serializeToString(svgNode)
}

/**
 * Renderiza SVG a PNG usando sharp
 */
const renderWelcome = async ({ wid, name, title, text, avatarUrl }) => {
  const svg = await genSVG({ wid, name, title, text, avatarUrl })
  const buffer = await sharp(Buffer.from(svg)).png().toBuffer()
  return buffer
}

/**
 * Handler del comando
 */
let handler = async (m, { conn }) => {
  try {
    const name = await conn.getName(m.sender)
    let avatarUrl
    try {
      avatarUrl = await conn.profilePictureUrl(m.sender, 'image')
    } catch {
      avatarUrl = '' // si no tiene foto de perfil, se deja vacío
    }

    const img = await renderWelcome({
      wid: m.sender,
      name,
      title: 'Grupo Tecnológico',
      text: 'Bienvenido a la familia!',
      avatarUrl
    })

    await conn.sendMessage(
      m.chat,
      { image: img, caption: `✦ 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 ✦\n\nHola ${name}` },
      { quoted: m }
    )
  } catch (e) {
    console.error(e)
    m.reply('❌ Error al generar el welcome')
  }
}

handler.help = ['welcome']
handler.tags = ['tools']
handler.command = ['1']

export default handler
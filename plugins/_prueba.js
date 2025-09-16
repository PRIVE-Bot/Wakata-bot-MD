// Editado y optimizado por https://github.com/deylin-eliac

import { createCanvas, loadImage } from 'canvas'
import fetch from 'node-fetch'

async function generateFactura({ cliente, producto, cantidad, precio, total, logoUrl }) {
  const width = 800
  const height = 600
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#FFDEE9')
  gradient.addColorStop(1, '#B5FFFC')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  if (logoUrl) {
    try {
      const res = await fetch(logoUrl)
      const buffer = Buffer.from(await res.arrayBuffer())
      const logo = await loadImage(buffer)
      ctx.drawImage(logo, 30, 20, 120, 120)
    } catch (e) {
      console.log('No se pudo cargar el logo')
    }
  }

  ctx.fillStyle = '#222'
  ctx.font = 'bold 36px Arial'
  ctx.fillText('FACTURA DE COMPRA', 200, 80)

  ctx.font = '20px Arial'
  ctx.fillText(`Cliente: ${cliente}`, 200, 120)

  const fecha = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
  ctx.fillText(`Fecha: ${fecha}`, 200, 150)

  ctx.fillStyle = '#000'
  ctx.font = 'bold 22px Arial'
  ctx.fillText('Producto', 80, 220)
  ctx.fillText('Cantidad', 320, 220)
  ctx.fillText('Precio', 500, 220)

  ctx.font = '20px Arial'
  ctx.fillText(producto, 80, 260)
  ctx.fillText(`${cantidad}`, 340, 260)
  ctx.fillText(`$${precio}`, 500, 260)

  ctx.font = 'bold 26px Arial'
  ctx.fillText(`TOTAL: $${total}`, 80, 340)

  ctx.font = 'italic 18px Arial'
  ctx.fillText('Gracias por su compra ❤️', 80, 400)

  return canvas.toBuffer()
}

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`❌ Uso correcto:\n\n${usedPrefix + command} Cliente|Producto|Cantidad|Precio|Total|LogoURL(opcional)\n\nEjemplo:\n${usedPrefix + command} Juan Pérez|Camiseta|2|15|30|https://tecnoblog/logo.png`)
  }

  let [cliente, producto, cantidad, precio, total, logoUrl] = text.split('|')
  if (!cliente || !producto || !cantidad || !precio || !total) {
    return m.reply(`❌ Faltan datos.\nEjemplo:\n${usedPrefix + command} Juan Pérez|Camiseta|2|15|30|https://tecnoblog/logo.png`)
  }

  let factura = await generateFactura({
    cliente,
    producto,
    cantidad: Number(cantidad),
    precio: Number(precio),
    total: Number(total),
    logoUrl
  })

  await conn.sendMessage(m.chat, { image: factura, caption: '📄 Aquí está tu factura generada.' }, { quoted: m })
}

handler.command = ['generarfactura']
handler.help = ['generarfactura']
handler.tags = ['herramientas']

export default handler
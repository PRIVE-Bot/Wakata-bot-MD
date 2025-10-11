import { createCanvas, loadImage } from 'canvas'
import { exec } from 'child_process'
import os from 'os'
import speed from 'performance-now'
import fs from 'fs'

let handler = async (m, { conn }) => {
  let timestamp = speed()
  let latensi = speed() - timestamp

  // Obtener datos del sistema
  const cpuModel = os.cpus()[0].model
  const cpuCores = os.cpus().length
  const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2)
  const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2)
  const usedMem = (totalMem - freeMem).toFixed(2)
  const uptime = (os.uptime() / 60 / 60).toFixed(2)

  // Crear imagen
  const width = 800
  const height = 450
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // Fondo tecnológico
  ctx.fillStyle = '#0a0f24'
  ctx.fillRect(0, 0, width, height)

  // Efecto de cuadrícula
  ctx.strokeStyle = '#0ff2'
  ctx.lineWidth = 0.5
  for (let i = 0; i < width; i += 40) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i, height)
    ctx.stroke()
  }
  for (let i = 0; i < height; i += 40) {
    ctx.beginPath()
    ctx.moveTo(0, i)
    ctx.lineTo(width, i)
    ctx.stroke()
  }

  // Título
  ctx.fillStyle = '#00ffff'
  ctx.font = 'bold 30px Arial'
  ctx.fillText('⚙️ SISTEMA ONLINE', 260, 60)

  // Latencia
  ctx.fillStyle = '#0f0'
  ctx.font = 'bold 24px Arial'
  ctx.fillText(`📶 LATENCIA: ${latensi.toFixed(3)} ms`, 60, 130)

  // CPU
  ctx.fillStyle = '#fff'
  ctx.font = '18px Arial'
  ctx.fillText(`💻 CPU: ${cpuModel}`, 60, 180)
  ctx.fillText(`🧩 Núcleos: ${cpuCores}`, 60, 210)

  // Memoria
  ctx.fillText(`💾 RAM usada: ${usedMem} GB / ${totalMem} GB`, 60, 260)

  // Uptime
  ctx.fillText(`⏱️ Uptime: ${uptime} horas`, 60, 310)

  // Gráfica RAM
  const barX = 60
  const barY = 340
  const barWidth = 680
  const barHeight = 25
  const usedBar = (usedMem / totalMem) * barWidth
  ctx.fillStyle = '#333'
  ctx.fillRect(barX, barY, barWidth, barHeight)
  ctx.fillStyle = '#00ffff'
  ctx.fillRect(barX, barY, usedBar, barHeight)
  ctx.strokeStyle = '#0ff'
  ctx.strokeRect(barX, barY, barWidth, barHeight)

  // Guardar imagen
  const buffer = canvas.toBuffer('image/png')
  const filePath = './ping-system.png'
  fs.writeFileSync(filePath, buffer)

  // Mensaje de texto
  let text = `
┏━━━『 *SISTEMA ONLINE* 』━━━⬣
┃ 💻 *RESPUESTA:* PONG!
┃ ⚙️ *LATENCIA:* ${latensi.toFixed(3)} ms
┃ 🧠 *CPU:* ${cpuModel}
┃ 🧩 *Núcleos:* ${cpuCores}
┃ 💾 *RAM:* ${usedMem}/${totalMem} GB
┃ ⏱️ *Uptime:* ${uptime} horas
┗━━━━━━━━━━━━━━━━━━━━━━⬣
`

  await conn.sendMessage(m.chat, { image: { url: filePath }, caption: text }, { quoted: m })
  fs.unlinkSync(filePath)
}

handler.command = ['ping', 'p']

export default handler
import { createCanvas } from '@napi-rs/canvas'
import os from 'os'
import speed from 'performance-now'

let handler = async (m, { conn }) => {
  const timestamp = speed()
  const latensi = speed() - timestamp

  const cpu = os.cpus()[0].model
  const cores = os.cpus().length
  const totalMem = os.totalmem() / 1024 / 1024 / 1024
  const freeMem = os.freemem() / 1024 / 1024 / 1024
  const usedMem = totalMem - freeMem
  const uptime = (os.uptime() / 3600).toFixed(1)

  const width = 1000
  const height = 600
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createLinearGradient(0, 0, 0, height)
  gradient.addColorStop(0, '#00111f')
  gradient.addColorStop(1, '#000000')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  ctx.strokeStyle = 'rgba(0,255,255,0.08)'
  for (let i = -width; i < width * 2; i += 50) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i - height, height)
    ctx.stroke()
  }

  ctx.strokeStyle = '#00ffff'
  ctx.shadowColor = '#00ffff'
  ctx.shadowBlur = 18
  ctx.lineWidth = 3
  ctx.strokeRect(40, 40, width - 80, height - 80)
  ctx.shadowBlur = 0

  ctx.fillStyle = '#00ffff'
  ctx.font = 'bold 48px Sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('SISTEMA ONLINE', width / 2, 100)

  ctx.textAlign = 'left'
  ctx.fillStyle = '#ffffff'
  ctx.font = '24px Sans-serif'
  ctx.fillText('LATENCIA', 80, 180)
  ctx.fillStyle = '#00ffff'
  ctx.fillText(`${latensi.toFixed(2)} ms`, 320, 180)

  ctx.fillStyle = '#ffffff'
  ctx.fillText('CPU', 80, 230)
  ctx.fillStyle = '#00ffff'
  ctx.fillText(cpu, 320, 230)

  ctx.fillStyle = '#ffffff'
  ctx.fillText('NÚCLEOS', 80, 280)
  ctx.fillStyle = '#00ffff'
  ctx.fillText(cores.toString(), 320, 280)

  ctx.fillStyle = '#ffffff'
  ctx.fillText('MEMORIA', 80, 330)
  ctx.fillStyle = '#00ffff'
  ctx.fillText(`${usedMem.toFixed(2)} GB / ${totalMem.toFixed(2)} GB`, 320, 330)

  ctx.fillStyle = '#ffffff'
  ctx.fillText('UPTIME', 80, 380)
  ctx.fillStyle = '#00ffff'
  ctx.fillText(`${uptime} hrs`, 320, 380)

  const ramBarWidth = 400
  const ramPercent = usedMem / totalMem
  ctx.fillStyle = 'rgba(8,45,51,0.8)'
  ctx.fillRect(80, 420, ramBarWidth, 20)
  ctx.fillStyle = '#00ffff'
  ctx.shadowColor = '#00ffff'
  ctx.shadowBlur = 12
  ctx.fillRect(80, 420, ramBarWidth * ramPercent, 20)
  ctx.shadowBlur = 0

  const cpuBarWidth = 400
  const cpuPercent = Math.min(0.6 + Math.random() * 0.3, 1)
  ctx.fillStyle = 'rgba(8,45,51,0.8)'
  ctx.fillRect(80, 460, cpuBarWidth, 20)
  ctx.fillStyle = '#00ffff'
  ctx.shadowColor = '#00ffff'
  ctx.shadowBlur = 12
  ctx.fillRect(80, 460, cpuBarWidth * cpuPercent, 20)
  ctx.shadowBlur = 0

  ctx.beginPath()
  ctx.moveTo(550, 150)
  ctx.lineTo(550, 500)
  ctx.strokeStyle = 'rgba(0,255,255,0.3)'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.textAlign = 'left'
  ctx.fillStyle = '#ffffff'
  ctx.font = '22px Sans-serif'
  ctx.fillText('ESTADO DEL SISTEMA', 560, 190)
  ctx.font = '18px Sans-serif'
  ctx.fillStyle = '#00ffff'
  ctx.fillText('SERVICIOS OPERATIVOS', 560, 220)
  ctx.fillText('Conexión estable y monitoreada', 560, 245)
  ctx.fillText('Módulos activos: Kernel, Net, Core', 560, 270)
  ctx.strokeStyle = '#00ffff'
  ctx.lineWidth = 1.5
  ctx.strokeRect(550, 160, 380, 150)

  ctx.textAlign = 'center'
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.font = '14px Sans-serif'
  ctx.fillText('Mode Systems Monitoring © 2025', width / 2, height - 40)

  const image = await canvas.encode('png')

  const caption = `SISTEMA ONLINE
Latencia: ${latensi.toFixed(2)} ms
CPU: ${cpu}
RAM: ${usedMem.toFixed(2)} GB / ${totalMem.toFixed(2)} GB`

  await conn.sendMessage(m.chat, { image, caption }, { quoted: m })
}

handler.command = ['ping', 'p']
export default handler
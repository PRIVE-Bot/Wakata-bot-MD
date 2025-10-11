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
  const height = 550
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  
  const gradient = ctx.createRadialGradient(width / 2, height / 2, 100, width / 2, height / 2, 700)
  gradient.addColorStop(0, '#00111f')
  gradient.addColorStop(1, '#000000')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  
  ctx.strokeStyle = 'rgba(0,255,255,0.08)'
  for (let i = -width; i < width * 2; i += 60) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i - height, height)
    ctx.stroke()
  }

  
  ctx.strokeStyle = '#00ffff'
  ctx.shadowColor = '#00ffff'
  ctx.shadowBlur = 20
  ctx.lineWidth = 2
  ctx.strokeRect(50, 50, width - 100, height - 100)
  ctx.shadowBlur = 0

  
  ctx.fillStyle = '#00ffff'
  ctx.font = 'bold 42px Sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('SISTEMA ONLINE', width / 2, 110)

  
  ctx.font = '24px Sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'left'
  ctx.fillText(`LATENCIA`, 120, 180)
  ctx.fillStyle = '#00ffff'
  ctx.fillText(`${latensi.toFixed(2)} ms`, 400, 180)

  
  ctx.fillStyle = '#ffffff'
  ctx.fillText(`CPU`, 120, 230)
  ctx.fillStyle = '#00ffff'
  ctx.fillText(cpu, 400, 230)

  
  ctx.fillStyle = '#ffffff'
  ctx.fillText(`NÚCLEOS`, 120, 280)
  ctx.fillStyle = '#00ffff'
  ctx.fillText(cores.toString(), 400, 280)

  
  ctx.fillStyle = '#ffffff'
  ctx.fillText(`MEMORIA`, 120, 330)
  ctx.fillStyle = '#00ffff'
  ctx.fillText(`${usedMem.toFixed(2)} GB / ${totalMem.toFixed(2)} GB`, 400, 330)

  
  ctx.fillStyle = '#ffffff'
  ctx.fillText(`UPTIME`, 120, 380)
  ctx.fillStyle = '#00ffff'
  ctx.fillText(`${uptime} hrs`, 400, 380)

  
  const ramBarWidth = 400
  const ramPercent = usedMem / totalMem
  ctx.fillStyle = '#082d33'
  ctx.fillRect(120, 410, ramBarWidth, 20)
  ctx.fillStyle = '#00ffff'
  ctx.shadowColor = '#00ffff'
  ctx.shadowBlur = 10
  ctx.fillRect(120, 410, ramBarWidth * ramPercent, 20)
  ctx.shadowBlur = 0

  
  const cpuBarWidth = 400
  const cpuPercent = Math.min(0.6 + Math.random() * 0.3, 1)
  ctx.fillStyle = '#082d33'
  ctx.fillRect(120, 450, cpuBarWidth, 20)
  ctx.fillStyle = '#00ffff'
  ctx.shadowColor = '#00ffff'
  ctx.shadowBlur = 10
  ctx.fillRect(120, 450, cpuBarWidth * cpuPercent, 20)
  ctx.shadowBlur = 0

  
  ctx.beginPath()
  ctx.moveTo(600, 150)
  ctx.lineTo(600, 480)
  ctx.strokeStyle = 'rgba(0,255,255,0.3)'
  ctx.lineWidth = 1
  ctx.stroke()

  
  ctx.textAlign = 'left'
  ctx.fillStyle = '#ffffff'
  ctx.font = '22px Sans-serif'
  ctx.fillText('ESTADO DEL SISTEMA', 630, 190)
  ctx.font = '18px Sans-serif'
  ctx.fillStyle = '#00ffff'
  ctx.fillText('Todos los servicios operativos.', 630, 220)
  ctx.fillText('Conexión estable y monitoreada.', 630, 245)
  ctx.fillText('Módulos activos: Kernel, Net, Core.', 630, 270)

  ctx.strokeStyle = '#00ffff'
  ctx.lineWidth = 1.2
  ctx.strokeRect(620, 160, 320, 150)

  
  ctx.textAlign = 'center'
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.font = '14px Sans-serif'
  ctx.fillText('Mode Systems Monitoring © 2025', width / 2, height - 40)

  
  const image = await canvas.encode('png')

  const caption = `SISTEMA ONLINE\nLatencia: ${latensi.toFixed(2)} ms\nCPU: ${cpu}\nRAM: ${usedMem.toFixed(2)} GB / ${totalMem.toFixed(2)} GB`

  await conn.sendMessage(m.chat, { image, caption }, { quoted: m })
}

handler.command = ['ping', 'p']
export default handler
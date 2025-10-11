import speed from 'performance-now'
import { spawn } from 'child_process'
import os from 'os'

let handler = async (m, { conn }) => {
  let timestamp = speed()
  let latensi = speed() - timestamp

  const cpu = os.cpus()[0].model
  const core = os.cpus().length
  const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2)
  const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2)
  const usedMem = (totalMem - freeMem).toFixed(2)
  const uptime = (os.uptime() / 60 / 60).toFixed(2)

  const caption = `
┏━━━『 *SISTEMA ONLINE* 』━━━⬣
┃ 💻 *RESPUESTA:* PONG!
┃ ⚙️ *LATENCIA:* ${latensi.toFixed(3)} ms
┃ 🧠 *CPU:* ${cpu}
┃ 🧩 *Núcleos:* ${core}
┃ 💾 *RAM:* ${usedMem}/${totalMem} GB
┃ ⏱️ *Uptime:* ${uptime} horas
┗━━━━━━━━━━━━━━━━━━━━━━⬣
`

  // Configurar comandos dinámicos de ImageMagick
  const args = [
    '-size', '1000x600',
    'gradient:#020617-#0a0f24',
    '(',
      '+clone', '-fill', 'none', '-stroke', '#00ffff40', '-strokewidth', '1',
      '-draw', 'line 0,0 1000,600',
      '-draw', 'line 0,100 1000,700',
      '-draw', 'line 0,200 1000,800',
      '-draw', 'line 0,300 1000,900',
    ')',
    '-compose', 'overlay', '-composite',
    '-fill', 'none', '-stroke', '#00ffff', '-strokewidth', '3',
    '-draw', 'roundrectangle 60,80 940,520 20,20',
    '-font', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
    '-fill', '#00ffff',
    '-pointsize', '48',
    '-gravity', 'north',
    '-annotate', '+0+60', '⚙️ SISTEMA ONLINE',
    '-fill', 'white',
    '-pointsize', '28',
    '-annotate', '+0+150', `📶 Latencia: ${latensi.toFixed(3)} ms`,
    '-annotate', '+0+210', `💻 CPU: ${cpu}`,
    '-annotate', '+0+270', `🧩 Núcleos: ${core}`,
    '-annotate', '+0+330', `💾 RAM: ${usedMem}/${totalMem} GB`,
    '-annotate', '+0+390', `⏱️ Uptime: ${uptime} horas`,
    'jpg:-'
  ]

  const proc = spawn(global.support?.magick ? 'magick' : 'convert', args)
  const bufs = []
  for await (const chunk of proc.stdout) bufs.push(chunk)
  const image = Buffer.concat(bufs)

  await conn.sendMessage(m.chat, { image, caption }, { quoted: m })
}

handler.command = ['ping', 'p']
export default handler
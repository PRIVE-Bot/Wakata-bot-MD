import os from 'os'

let handler = async (m, { conn }) => {
  try {
    
    let uptimeMs = process.uptime() * 1000
    let h = Math.floor(uptimeMs / 3600000)
    let mnt = Math.floor((uptimeMs % 3600000) / 60000)
    let s = Math.floor((uptimeMs % 60000) / 1000)
    let uptimeStr = `${h}h ${mnt}m ${s}s`

    
    let totalMem = os.totalmem()
    let freeMem = os.freemem()
    let usedMem = totalMem - freeMem
    let memPercent = Math.floor((usedMem / totalMem) * 100)

    
    const progressBar = (percent) => {
      let bars = 10
      let filled = Math.round((percent / 100) * bars)
      let empty = bars - filled
      return '█'.repeat(filled) + '░'.repeat(empty)
    }

    
    const cpus = os.cpus()
    let totalLoad = 0
    for (let cpu of cpus) {
      let times = cpu.times
      let load = ((times.user + times.nice + times.sys) / (times.user + times.nice + times.sys + times.idle)) * 100
      totalLoad += load
    }
    let cpuPercent = Math.floor(totalLoad / cpus.length)

    
    let cpuModel = cpus[0].model
    let cpuSpeed = cpus[0].speed

    
    let platform = os.platform()
    let arch = os.arch()

    
    let msg = `
⏱ *Uptime:* ${uptimeStr}

💻 *Sistema:* ${platform} ${arch}
🖥 *CPU:* ${cpuModel} @ ${cpuSpeed}MHz
${progressBar(cpuPercent)} ${cpuPercent}% carga CPU

🗄 *RAM:* ${Math.floor(usedMem / 1024 / 1024)}MB / ${Math.floor(totalMem / 1024 / 1024)}MB
${progressBar(memPercent)} ${memPercent}% RAM usada

🟢 *Estado del bot:* Online
`

    conn.reply(m.chat, msg, m)
  } catch (e) {
    conn.reply(m.chat, `❌ Error al obtener el uptime: ${e}`, m)
  }
}

handler.help = ['uptime', 'estado']
handler.tags = ['info']
handler.command = ['uptime','estado']

export default handler
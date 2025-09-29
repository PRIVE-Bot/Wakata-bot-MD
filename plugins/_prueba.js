import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  const args = text.trim().split(/\s+/)
  const link = args[0]
  const emoji = args[1] || '👍'

  if (!link) return conn.sendMessage(m.chat, { text: '❌ Debes poner el enlace del mensaje' }, { quoted: m })

  try {
    const parts = link.split('/')
    const channelJid = parts[parts.length - 2] + '@newsletter'
    const messageId = parts[parts.length - 1].split('?')[0]

    const allBots = [conn, ...(global.bots || [])]

    for (const bot of allBots) {
      if (!bot || !bot.user) continue
      await bot.sendMessage(channelJid, {
        reactionMessage: {
          key: { remoteJid: channelJid, id: messageId, fromMe: false },
          text: emoji
        }
      }).catch(() => {})
    }

    await conn.sendMessage(m.chat, { text: `✅ Reacción enviada a través de ${allBots.length} bots.` }, { quoted: m })
  } catch (e) {
    await conn.sendMessage(m.chat, { text: `❌ Error: El enlace no es válido o el mensaje no existe.` }, { quoted: m })
  }
}

handler.command = ['1']
export default handler

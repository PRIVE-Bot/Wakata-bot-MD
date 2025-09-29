import fetch from 'node-fetch'

const bots = [conn1, conn2, conn3] // Todos los bots conectados

let handler = async (m, { conn, text }) => {
  const args = text.trim().split(/\s+/)
  const link = args[0]
  const emoji = args[1] || '👍'

  if (!link) return conn.sendMessage(m.chat, { text: '❌ Debes poner el enlace del mensaje' }, { quoted: m })

  try {
    const parts = link.split('/')
    const channelJid = parts[parts.length - 2] + '@newsletter'
    const messageId = parts[parts.length - 1].split('?')[0]

    for (const bot of bots) {
      await bot.sendMessage(channelJid, {
        reactionMessage: {
          key: { remoteJid: channelJid, id: messageId, fromMe: false },
          text: emoji
        }
      }).catch(() => {})
    }

    await conn.sendMessage(m.chat, { text: `✅ ` }, { quoted: m })
  } catch (e) {
    console.error(e)
    await conn.sendMessage(m.chat, { text: `❌ ${e.message}` }, { quoted: m })
  }
}

handler.command = ['1']
export default handler
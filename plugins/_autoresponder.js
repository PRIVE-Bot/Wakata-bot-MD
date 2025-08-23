import fetch from 'node-fetch'
import { sticker } from '../lib/sticker.js'

let handler = m => m

handler.all = async function (m, { conn }) {
  let user = global.db.data.users[m.sender]
  let chat = global.db.data.chats[m.chat]

  m.isBot = m.id.startsWith('BAE5') && m.id.length === 16 
          || m.id.startsWith('3EB0') && (m.id.length === 12 || m.id.length === 20 || m.id.length === 22) 
          || m.id.startsWith('B24E') && m.id.length === 20
  if (m.isBot) return 

  let prefixRegex = new RegExp('^[' + (opts?.prefix || '‎z/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.,\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')
  if (prefixRegex.test(m.text)) return true

  if (m.sender?.toLowerCase().includes('bot')) return true

  if (!chat.isBanned && chat.autoresponder) {
    if (m.fromMe) return

    await this.sendPresenceUpdate('composing', m.chat)

    let query = m.text || ''
    let username = m.pushName || 'Usuario'

    let txtDefault = `
Eres ${botname}, una inteligencia artificial avanzada creada por ${etiqueta} para WhatsApp. Tu propósito es brindar respuestas claras, pero con una actitud empática y comprensiva.
`.trim()

    let logic = chat.sAutoresponder ? chat.sAutoresponder : txtDefault

    try {
      const apiUrl = `https://g-mini-ia.vercel.app/api/mode-ia?prompt=${encodeURIComponent(query)}&id=${encodeURIComponent(username)}&logic=${encodeURIComponent(logic)}`
      const res = await fetch(apiUrl)
      if (!res.ok) throw new Error(`Error en la API: ${res.status} ${res.statusText}`)

      const data = await res.json()
      let result = data.result || data.answer || null

      if (result && result.trim().length > 0) {
        await this.reply(m.chat, result, m)
      }
    } catch (e) {
      console.error('Error en API personalizada:', e)
    }
  }
  return true
}

export default handler
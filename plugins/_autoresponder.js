import axios from 'axios'
import fetch from 'node-fetch'

let handler = m => m

handler.all = async function (m, { conn }) {
  let user = global.db.data.users[m.sender]
  let chat = global.db.data.chats[m.chat]

  m.isBot = m.id.startsWith('BAE5') && m.id.length === 16 
          || m.id.startsWith('3EB0') && (m.id.length === 12 || m.id.length === 20 || m.id.length === 22) 
          || m.id.startsWith('B24E') && m.id.length === 20
  if (m.isBot) return 

  // ignorar comandos con prefijo
  let prefixRegex = new RegExp('^[' + (opts?.prefix || '‎z/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.,\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')
  if (prefixRegex.test(m.text)) return true

  if (m.sender?.toLowerCase().includes('bot')) return true

  if (!chat.isBanned) {
    async function luminsesi(q, username, logic) {
      try {
        const response = await axios.post("https://luminai.my.id", {
          content: q,
          user: username,
          prompt: logic,
          webSearchMode: true
        })
        console.log("🔹 LuminAI response:", response.data)
        return response.data.result
      } catch (error) {
        console.error("❌ Error en LuminAI:", error)
        return null
      }
    }

    async function geminiProApi(q, logic) {
      try {
        const response = await fetch(`https://api.ryzendesu.vip/api/ai/gemini-pro?text=${encodeURIComponent(q)}&prompt=${encodeURIComponent(logic)}`)
        if (!response.ok) throw new Error(`Error en la solicitud: ${response.statusText}`)
        const result = await response.json()
        console.log("🔹 Gemini response:", result)
        return result.answer
      } catch (error) {
        console.error('❌ Error en Gemini Pro:', error)
        return null
      }
    }

    let txtDefault = `
Eres ${botname}, una inteligencia artificial avanzada creada por ${etiqueta} para WhatsApp. Tu propósito es brindar respuestas claras, pero con una actitud empática y comprensiva...
`.trim()

    let query = m.text || ''
    let username = m.pushName || 'Usuario'
    let syms1 = chat.sAutoresponder ? chat.sAutoresponder : txtDefault

    if (m.fromMe) return
    await this.sendPresenceUpdate('composing', m.chat)

    // 🚀 primero intenta Gemini
    let result = await geminiProApi(query, syms1)

    // 🚑 si no hay respuesta, intenta LuminAI
    if (!result || result.trim().length === 0) {
      result = await luminsesi(query, username, syms1)
    }

    // 🚨 si sigue sin respuesta, devuelve algo por defecto
    if (!result || result.trim().length === 0) {
      result = "Lo siento, no pude generar una respuesta 😔."
    }

    await this.reply(m.chat, result, m)
  }
  return true
}

export default handler
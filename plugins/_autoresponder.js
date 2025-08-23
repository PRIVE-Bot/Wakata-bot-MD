// Este código asume que tienes instalada la librería 'node-fetch'.
// npm install node-fetch@2
import fetch from 'node-fetch'
import { sticker } from '../lib/sticker.js' // Mantengo el import por si lo usas, aunque no es parte de este código.

// Definimos las variables que faltaban.
// Estas variables deberían venir del archivo de configuración principal de tu bot.
const opts = {
  prefix: '‎z/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.,\\-'
}
const botname = 'Tu Bot de IA'
const etiqueta = 'Tu Nombre o Equipo'

// El handler principal que se ejecuta con cada mensaje.
let handler = m => m

handler.all = async function (m, { conn }) {
  // --- Simulación de la base de datos y chat para el ejemplo ---
  // En un entorno real, estos datos se obtienen de una base de datos.
  if (!global.db) global.db = { data: { users: {}, chats: {} } }
  if (!global.db.data.users[m.sender]) global.db.data.users[m.sender] = {}
  if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {
    isBanned: false,
    autoresponder: true,
    sAutoresponder: ''
  }
  let user = global.db.data.users[m.sender]
  let chat = global.db.data.chats[m.chat]

  // --- Lógica original del código ---

  // 1. Detección de mensajes del bot para evitar bucles.
  m.isBot = m.id.startsWith('BAE5') && m.id.length === 16 
          || m.id.startsWith('3EB0') && (m.id.length === 12 || m.id.length === 20 || m.id.length === 22) 
          || m.id.startsWith('B24E') && m.id.length === 20
  if (m.isBot) return // Si el mensaje es del bot, no hace nada y se detiene.

  // 2. Detección de prefijos para evitar que responda a comandos.
  let prefixRegex = new RegExp('^[' + (opts?.prefix || '‎z/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.,\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')
  if (prefixRegex.test(m.text)) return true // Si el mensaje es un comando, no responde.

  // 3. Ignora mensajes de otros bots.
  if (m.sender?.toLowerCase().includes('bot')) return true

  // 4. Lógica del autorespondedor.
  if (!chat.isBanned && chat.autoresponder) {
    if (m.fromMe) return // Ignora mensajes propios.

    let query = m.text || ''
    let username = m.pushName || 'Usuario'

    // --- Lógica que determina si se activa el autorespondedor ---
    // Esta es la parte crucial. El bot solo responderá si una de estas condiciones es VERDADERA.
    let isNarutoOrBot = /naruto|bot/i.test(query)
    let isReply = m.quoted && m.quoted.sender === this.user.jid
    let isMention = m.mentionedJid && m.mentionedJid.includes(this.user.jid) // <-- Aquí está la clave

    // La siguiente línea dice: "Si NO es (Naruto/Bot O una respuesta O una mención del bot), detente."
    // Es por eso que solo funciona si mencionas al bot, no a otros usuarios.
    if (!(isNarutoOrBot || isReply || isMention)) return // Si no se cumplen las condiciones, se detiene.

    // El bot empieza a escribir para dar una sensación de respuesta.
    await this.sendPresenceUpdate('composing', m.chat)

    // Lógica del autorespondedor.
    let txtDefault = `Eres ${botname}, una inteligencia artificial avanzada creada por ${etiqueta} para WhatsApp. Tu propósito es brindar respuestas claras, pero con una actitud empática y comprensiva.`.trim()
    let logic = chat.sAutoresponder ? chat.sAutoresponder : txtDefault

    try {
      const apiUrl = `https://g-mini-ia.vercel.app/api/mode-ia?prompt=${encodeURIComponent(query)}&id=${encodeURIComponent(username)}&logic=${encodeURIComponent(logic)}`
      const res = await fetch(apiUrl)
      const data = await res.json()
      let result = data.result || data.answer || data.response || null
      if (result && result.trim().length > 0) {
        await this.reply(m.chat, result, m)
      }
    } catch (e) {
      console.error(e)
      await this.reply(m.chat, '⚠️ Ocurrió un error con la IA.', m)
    }
  }
  return true
}

// Exportamos el handler para que el sistema del bot lo pueda cargar.
export default handler

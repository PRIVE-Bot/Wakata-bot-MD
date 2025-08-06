import { mensajes } from './motivacion.js' 

let handler = async (m, { conn }) => {
  try {
    const mensaje = mensajes[Math.floor(Math.random() * mensajes.length)]
    await conn.reply(m.chat, `🌟 *Mensaje para ti:*\n\n"${mensaje}"`, m)
  } catch (e) {
    await conn.reply(m.chat, '⚠️ Ocurrió un error al leer los mensajes.', m)
    console.error(e)
  }
}

handler.command = ['motivacion', 'consejo', 'reflexion', 'superación']
handler.tags = ['motivacional']
handler.help = ['motivacion', 'reflexion']

export default handler
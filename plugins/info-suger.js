// Comando para sugerir nuevos comandos
let sugerirHandler = async (m, { conn, text, usedPrefix }) => {
  if (!text) {
    return conn.reply(m.chat, `❗️ Por favor, ingrese su sugerencia en el siguiente formato:\n\ncomando | descripción\n\nEjemplo:\n!saludo | Envía un mensaje de bienvenida al usuario.`, m)
  }
  let parts = text.split("|").map(p => p.trim())
  if (parts.length < 2) {
    return conn.reply(m.chat, `❗️ Formato incorrecto. Use:\ncomando | descripción`, m)
  }
  let [nuevoComando, descripcion] = parts
  if (nuevoComando.length < 3) return conn.reply(m.chat, `❗️ El nombre del comando es muy corto.`, m)
  if (descripcion.length < 10) return conn.reply(m.chat, `❗️ La descripción debe tener al menos 10 caracteres.`, m)
  if (descripcion.length > 1000) return conn.reply(m.chat, `❗️ La descripción debe tener máximo 1000 caracteres.`, m)
  
  let teks = `*✳️ S U G E R E N C I A   D E   C O M A N D O S ✳️*

📌 Comando propuesto:
• ${nuevoComando}

📋 Descripción:
• ${descripcion}

👤 Usuario:
• ${m.pushName || 'Anónimo'}
• Número: wa.me/${m.sender.split`@`[0]}

_Para aprobar o rechazar la sugerencia, el staff debe responder a este mensaje con .aceptar o .noaceptar seguido de una razón (opcional)._`

  // Envía la sugerencia al grupo de staff y/o al creador
  // Reemplaza 'STAFF_GROUP_ID' y 'CREADOR_ID@s.whatsapp.net' por los IDs correspondientes.
  await conn.reply('CREADOR_ID@s.whatsapp.net', m.quoted ? teks + '\n\n' + m.quoted.text : teks, m, { mentions: conn.parseMention(teks) })
  await conn.reply('STAFF_GROUP_ID', m.quoted ? teks + '\n\n' + m.quoted.text : teks, m, { mentions: conn.parseMention(teks) })

  conn.reply(m.chat, `✅ Tu sugerencia se ha enviado al staff. Recibirás una notificación cuando se revise.`, m)
}
sugerirHandler.help = ['sugerir']
sugerirHandler.tags = ['info']
sugerirHandler.command = ['sugerir', 'suggest']
export default sugerirHandler
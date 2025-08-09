// Plugin para enviar mensaje de aviso IA en privado solo 1 vez por usuario
const usuariosNotificados = new Set()

let handler = async (m, { conn }) => {
  if (m.isGroup) return // Solo en chats privados
  if (usuariosNotificados.has(m.sender)) return // Ya notificado, no repetir

  const texto = `🤖 Hola, este usuario cuenta con un asistente automático basado en IA.

Para consultarle algo, usa el comando:

.ia <tu pregunta>

Gracias por comprender.`

  await conn.sendMessage(m.chat, { text: texto })

  usuariosNotificados.add(m.sender)
}

// No usar comandos ni registro
handler.command = false
handler.register = false

export default handler
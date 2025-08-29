let handler = async (m, { conn }) => {
  if (!m.quoted) return conn.reply(m.chat, 'No hay mensaje citado.', m)

  try {
    // Convertimos el objeto a JSON y limitamos el tamaño para no saturar
    let jsonStr = JSON.stringify(m.quoted, null, 2)
    if (jsonStr.length > 3000) jsonStr = jsonStr.slice(0, 3000) + '\n... (truncated)'

    await conn.reply(m.chat, 'Aquí está la estructura de tu mensaje citado:\n\n' + jsonStr, m)
  } catch (e) {
    await conn.reply(m.chat, 'Error al convertir el mensaje a JSON: ' + e.message, m)
  }
}

handler.command = ['debugvo']
export default handler
let handler = async (m, { conn }) => {
  if (!m.quoted) return conn.reply(m.chat, 'No hay mensaje citado.', m)

  // Mostramos en consola el objeto completo
  console.log(JSON.stringify(m.quoted, null, 2))

  conn.reply(m.chat, 'Se imprimió la estructura en la consola.', m)
}

handler.command = ['debugvo']
export default handler
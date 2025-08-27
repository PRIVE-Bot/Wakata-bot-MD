const handler = async (m, { conn, text, command }) => {
let metadata = await conn.groupMetadata(m.chat)
  let reglas = metadata.desc
return conn.reply(m.chat, `${reglas}`, m, fake);
}

handler.command = ['reglas']
export default handler;
// plugins/welcome-cmd.js
import { renderWelcome } from '../lib/welcome.js'
import { writeFileSync } from 'fs'

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  try {
    let name = await conn.getName(m.sender)
    let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => null)
    let background = null // aquí puedes poner un fondo personalizado (base64 o url convertida)

    let img = await renderWelcome({
      wid: m.sender,
      pp,
      name,
      title: 'Grupo de Prueba',
      text: 'Bienvenido a la familia!',
      background
    }, 'jpg')

    await conn.sendFile(m.chat, img, 'welcome.jpg', `✦ 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 ✦\n\nHola ${name}`, m)
  } catch (e) {
    console.error(e)
    m.reply('❌ Error al generar el welcome')
  }
}

handler.help = ['welcome']
handler.tags = ['tools']
handler.command = /^welcome|1$/i   // aquí activas con `.welcome` o con `.1`

export default handler
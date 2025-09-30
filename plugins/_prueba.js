// plugins/welcome-cmd.js
import pkg from '../lib/welcome.js'
const { renderWelcome } = pkg

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  try {
    let name = await conn.getName(m.sender)
    let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => null)

    let img = await renderWelcome({
      wid: m.sender,
      pp,
      name,
      title: 'Grupo de Prueba',
      text: 'Bienvenido a la familia!',
    }, 'jpg')

    await conn.sendFile(m.chat, img, 'welcome.jpg', `✦ 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 ✦\n\nHola ${name}`, m)
  } catch (e) {
    console.error(e)
    m.reply('❌ Error al generar el welcome')
  }
}

handler.help = ['welcome']
handler.tags = ['tools']
handler.command = ['1']

export default handler
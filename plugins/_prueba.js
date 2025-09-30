// plugins/welcomeHandler.js
import { renderWelcome } from '../lib/welcome.js'  // Ajusta la ruta según tu proyecto

let handler = async (m, { conn }) => {
  try {
    // Obtener nombre y foto de perfil
    let name = await conn.getName(m.sender)
    let pp = await conn.profilePictureUrl(m.sender, 'image').catch(_ => null)
    if (!pp) pp = null // fallback si no tiene foto

    // Generar imagen de bienvenida
    let img = await renderWelcome({
      wid: m.sender,
      pp,
      name,
      title: 'Grupo de Prueba',
      text: 'Bienvenido a la familia!',
    }, 'jpg')

    // Enviar la imagen al chat
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
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  // Descargamos la imagen y la convertimos en buffer
  let thumb = await (await fetch("https://i.postimg.cc/y6f8nLLr/1756789205853.jpg")).buffer()

  const msg = {
    groupInviteMessage: {
      groupJid: "12036304xxxxxx@g.us", // remplaza con tu grupo
      inviteCode: "SPARKBOT",          // debe ser válido si quieres que funcione como invitación real
      inviteExpiration: Date.now() + 86400000,
      groupName: "🔥 Comunidad Spark-Bot",
      caption: "Únete y descubre las funciones premium 🚀",
      jpegThumbnail: thumb             // aquí va la miniatura
    }
  }

  await conn.sendMessage(m.chat, msg, { quoted: m })
}

handler.command = ['ad3']
export default handler
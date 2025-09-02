let handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    groupInviteMessage: {
      groupJid: "12036304xxxxxx@g.us",
      inviteCode: "ABCDE12345",
      groupName: "🔥 Bot Premium",
      caption: "Únete y descubre todas las funciones premium 🚀",
      jpegThumbnail: Buffer.alloc(0) // puedes poner miniatura
    }
  }, { quoted: m })
}

handler.command = ['promo4']
export default handler
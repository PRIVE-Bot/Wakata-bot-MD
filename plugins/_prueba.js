import fetch from "node-fetch"

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("⚠️ Ingresa la URL de un video.")

  

  try {
    await conn.sendMessage(
      m.chat,
      { video: { url: text }, mimetype: "video/mp4", ptv: true },
      { quoted: m }
    )
  } catch (e) {
    console.log(e)
    m.reply(e.message)
  }
}

handler.command = ["1"]

export default handler
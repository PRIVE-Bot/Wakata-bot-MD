import fetch from "node-fetch"

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply(`⚠️ Ingresa un enlace de TikTok.\n\nEjemplo:\n${usedPrefix + command} https://vm.tiktok.com/ZMj4xxxx/`)
  try {
    let res = await fetch(`https://g-mini-ia.vercel.app/api/tiktok?url=${encodeURIComponent(args[0])}`)
    if (!res.ok) throw await res.text()
    let data = await res.json()

    let txt = `
🎥𝐓𝐈𝐊𝐓𝐎𝐊 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑

*🌟 MENÚ DE VIDEOS DE TIKTOK 🎵*

🗣️ Title » ${data.title || "TikTok Video"}  

*➔ Responde con el número para descargar:*

1️ ⇶Vídeo sin marca de agua 📽️  
2️ ⇶Sólo audio 🎵  
3️ ⇶Nota de vídeo 🕳️
`.trim()

    let sentMsg = await conn.sendMessage(m.chat, {
      image: { url: data.thumbnail },
      caption: txt
    }, { quoted: m })

    conn.tiktokMenu = conn.tiktokMenu || {}
    conn.tiktokMenu[sentMsg.key.id] = data
  } catch (e) {
    console.error(e)
    m.reply("❌ Error al obtener el video de TikTok.")
  }
}

handler.command = /^t$/i

let before = async (m, { conn }) => {
  if (!m.quoted || !conn.tiktokMenu) return
  let msgId = m.quoted.id || m.quoted.key?.id
  let data = conn.tiktokMenu[msgId]
  if (!data) return

  let choice = m.text.trim()
  if (!["1", "2", "3"].includes(choice)) return

  try {
    switch (choice) {
      case "1":
        await m.reply("⏳ Enviando contenido...")
        await conn.sendMessage(m.chat, { video: { url: data.video_url }, caption: "🎬 TikTok sin marca de agua" }, { quoted: m })
        break
      case "2":
        await m.reply("⏳ Enviando contenido...")
        await conn.sendMessage(m.chat, { audio: { url: data.audio_url || data.video_url }, mimetype: "audio/mpeg", fileName: "tiktok.mp3" }, { quoted: m })
        break
      case "3":
        await m.reply("⏳ Enviando contenido...")
        await conn.sendMessage(m.chat, { 
          video: { url: data.video_url }, 
          mimetype: "video/mp4", 
          ptv: true 
        }, { quoted: m })
        break
    }
  } catch (e) {
    console.error(e)
    m.reply("❌ Error al enviar el archivo.")
  }
}

handler.before = before
export default handler
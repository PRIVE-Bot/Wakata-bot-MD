import fetch from "node-fetch"

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return m.reply(`⚠️ Ingresa un enlace de TikTok.\n\nEjemplo:\n${usedPrefix + command} https://vm.tiktok.com/ZMj4xxxx/`)
  try {
    let res = await fetch(`https://g-mini-ia.vercel.app/api/tiktok?url=${encodeURIComponent(args[0])}`)
    if (!res.ok) throw await res.text()
    let data = await res.json()

    let txt = `
🎥𝐓𝐈𝐊𝐓𝐎𝐊 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑

*🌟 TIKTOK VIDEO MENU 🎵*

🗣️ Title     »  ${data.title || "TikTok Video"}  

*🔢 𝗥𝗲𝗽𝗹𝘆 𝘄𝗶𝘁𝗵 𝗯𝗲𝗹𝗼𝘄 𝗻𝘂𝗺𝗯𝗲𝗿 𝘁𝗼 𝗱𝗼𝘄𝗻𝗹𝗼𝗮𝗱:*

1️⃣ ║❯❯ No Watermark Video 📽️  
2️⃣ ║❯❯ Audio Only 🎵  
3️⃣ ║❯❯ Video Note [PTV] 📺


> © 𝚂𝚄𝙻𝙰 𝙼𝗜𝗡𝗜 𝙱𝙾𝚃
    `.trim()

    let sentMsg = await conn.sendMessage(m.chat, {
      image: { url: data.thumbnail },
      caption: txt
    }, { quoted: m })

    // Guardar datos con el ID del mensaje enviado
    conn.tiktokMenu = conn.tiktokMenu || {}
    conn.tiktokMenu[sentMsg.key.id] = data

  } catch (e) {
    console.error(e)
    m.reply("❌ Error al obtener el video de TikTok.")
  }
}

handler.command = /^t$/i
export default handler


// --- ESCUCHAR TODAS LAS RESPUESTAS ---
let handlerAll = async (m, { conn }) => {
  if (!m.quoted || !m.quoted.key || !conn.tiktokMenu) return
  let data = conn.tiktokMenu[m.quoted.key.id]
  if (!data) return

  let choice = m.text.trim()
  if (!["1", "2", "3"].includes(choice)) return

  // borrar para que no se repita
  delete conn.tiktokMenu[m.quoted.key.id]

  try {
    await m.reply("⏳ Enviando contenido...")

    if (choice === "1") {
      await conn.sendMessage(m.chat, { video: { url: data.video_url }, caption: "🎬 TikTok sin marca de agua" }, { quoted: m })
    } else if (choice === "2") {
      await conn.sendMessage(m.chat, { audio: { url: data.audio_url || data.video_url }, mimetype: "audio/mpeg", fileName: "tiktok.mp3" }, { quoted: m })
    } else if (choice === "3") {
      await conn.sendMessage(m.chat, { video: { url: data.video_url }, ptt: true }, { quoted: m })
    }

  } catch (e) {
    console.error(e)
    m.reply("❌ Error al enviar el archivo.")
  }
}

handler.all = handlerAll
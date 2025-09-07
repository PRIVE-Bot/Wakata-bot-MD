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


> © 𝚂𝚄𝙻𝙰 𝙼𝙸𝙽𝙸 𝙱𝙾𝚃
    `.trim()

    await conn.sendMessage(m.chat, {
      image: { url: data.thumbnail },
      caption: txt
    }, { quoted: m })

    // Guardar datos para la respuesta posterior
    conn.tiktokMenu = conn.tiktokMenu ? conn.tiktokMenu : {}
    conn.tiktokMenu[m.chat] = {
      key: m.key,
      data
    }

  } catch (e) {
    console.error(e)
    m.reply("❌ Error al obtener el video de TikTok.")
  }
}

handler.command = /^t$/i
export default handler


// --- RESPUESTA A LOS NÚMEROS ---
let before = async (m, { conn }) => {
  if (!m.quoted || !conn.tiktokMenu || !conn.tiktokMenu[m.chat]) return
  let { key, data } = conn.tiktokMenu[m.chat]
  if (!m.quoted.key || m.quoted.key.id !== key.id) return

  let choice = m.text.trim()
  try {
    switch (choice) {
      case "1":
        await conn.sendMessage(m.chat, { video: { url: data.video_url }, caption: "🎬 TikTok sin marca de agua" }, { quoted: m })
        break
      case "2":
        await conn.sendMessage(m.chat, { audio: { url: data.video_url }, mimetype: "audio/mpeg", fileName: "tiktok.mp3" }, { quoted: m })
        break
      case "3":
        await conn.sendMessage(m.chat, { video: { url: data.video_url }, ptt: true }, { quoted: m })
        break
    }
  } catch (e) {
    console.error(e)
    m.reply("❌ Error al enviar el archivo.")
  }
}

handler.before = before
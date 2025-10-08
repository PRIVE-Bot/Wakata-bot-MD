import fetch from "node-fetch"
import { igdl } from "ruhend-scraper"

let handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `${emoji} Necesitas enviar un enlace de *Instagram* para descargar.`, m, rcanal)
  }

  const resThumb3 = await fetch('https://files.catbox.moe/pgomk1.jpg')
  const thumb24 = Buffer.from(await resThumb3.arrayBuffer())

  const fkontak = {
    key: {
      participants: ["0@s.whatsapp.net"],
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      locationMessage: {
        name: `𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔 𝗗𝗘 𝗜𝗡𝗦𝗧𝗔𝗚𝗥𝗔𝗠`,
        jpegThumbnail: thumb24
      }
    },
    participant: "0@s.whatsapp.net"
  };

  const regexInstagram = /^(https?:\/\/)?(www\.)?(instagram\.com|instagr\.am)\/[^\s]+$/i
  if (!regexInstagram.test(args[0])) {
    return conn.reply(m.chat, `${emoji} El enlace proporcionado no es válido o no pertenece a *Instagram* ❌`, m, rcanal)
  }

  let res
  try {
    if (m.react) await m.react("⏳")
    res = await igdl(args[0])
  } catch (e) {
    return conn.reply(m.chat, `${emoji} Hubo un error al obtener los datos. ¿Seguro que el enlace es válido?`, m, rcanal)
  }

  let result = Array.isArray(res) ? res : res?.data
  if (!result || result.length === 0) {
    return conn.reply(m.chat, `${emoji} No se encontró nada... prueba con otro link.`, m, rcanal)
  }

  let data = result[0]
  if (!data?.url) {
    return conn.reply(m.chat, `${emoji} No se pudo procesar el video.`, m, rcanal)
  }

  let video = data.url

  const resThumb = await fetch("https://files.catbox.moe/pgomk1.jpg")
  const thumb2 = Buffer.from(await resThumb.arrayBuffer())

  let txt = `
🎥 𝗜𝗡𝗦𝗧𝗔𝗚𝗥𝗔𝗠 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥  

🌐 Plataforma: Instagram  
📺 Formato: ${data.type || "Desconocido"}  

⚙️ Opciones de descarga:  
1️⃣ Vídeo normal 📽️  
2️⃣ Solo audio 🎵  
3️⃣ Nota de vídeo 🕳️  

💡 Responde con el número de tu elección.
`.trim()

    let sentMsg = await conn.sendMessage(
    m.chat,
    {
      image: thumb2,
      caption: txt,
      ...global.rcanal
    },
    { quoted: fkontak }
  )

  conn.igMenu = conn.igMenu || {}
  conn.igMenu[sentMsg.key.id] = { video }
  if (m.react) await m.react("✅")
}

handler.help = ['instagram <url>', 'ig <url>']
handler.tags = ['descargas']
handler.command = ['instagram', 'ig']

let before = async (m, { conn }) => {
  const resThumb34 = await fetch('https://files.catbox.moe/pgomk1.jpg')
  const thumb246 = Buffer.from(await resThumb34.arrayBuffer())

  const fkontak = {
    key: {
      participants: ["0@s.whatsapp.net"],
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      locationMessage: {
        name: `𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔 𝗗𝗘 𝗜𝗡𝗦𝗧𝗔𝗚𝗥𝗔𝗠`,
        jpegThumbnail: thumb246
      }
    },
    participant: "0@s.whatsapp.net"
  };

  if (!m.quoted || !conn.igMenu) return
  let msgId = m.quoted.id || m.quoted.key?.id
  let data = conn.igMenu[msgId]
  if (!data) return

  let choice = m.text.trim()
  if (!["1", "2", "3"].includes(choice)) return

  try {
    switch (choice) {
      case "1":
        await conn.sendMessage(
          m.chat,
          { video: { url: data.video }, caption: "🎬 Instagram Video" },
          { quoted: fkontak }
        )
        break
      case "2":
        await conn.sendMessage(
          m.chat,
          { audio: { url: data.video }, mimetype: "audio/mpeg", fileName: "instagram.mp3" },
          { quoted: fkontak }
        )
        break
      case "3":
        await conn.sendMessage(
          m.chat,
          { video: { url: data.video }, mimetype: "video/mp4", ptv: true },
          { quoted: fkontak }
        )
        break
    }
  } catch (e) {
    console.error(e)
    m.reply("❌ Error al enviar el archivo.")
  }
}

handler.before = before
export default handler
import fetch from "node-fetch"
import { igdl } from "ruhend-scraper"

let handler = async (m, { conn, args }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `${emoji} Necesitas enviar un enlace de *Facebook* para descargar.`, m, rcanal)
  }
const resThumb3 = await fetch('https://files.catbox.moe/nbkung.jpg')
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
        name: `𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔 𝗗𝗘 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞`,
        jpegThumbnail: thumb24
      }
    },
    participant: "0@s.whatsapp.net"
  };

  const regexFacebook = /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/[^\s]+$/i
  if (!regexFacebook.test(args[0])) {
    return conn.reply(m.chat, `${emoji} El enlace proporcionado no es válido o no pertenece a *Facebook* ❌`, m, rcanal)
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

  let data
  try {
    data =
      result.find(i => i.resolution === "720p (HD)") ||
      result.find(i => i.resolution === "360p (SD)") ||
      result[0]
  } catch (e) {
    return conn.reply(m.chat, `${emoji} No se pudo procesar el video.`, m, rcanal)
  }

  if (!data?.url) {
    return conn.reply(m.chat, `${emoji} No hay resolución compatible disponible.`, m, rcanal)
  }

  let video = data.url

  const resThumb = await fetch("https://files.catbox.moe/nbkung.jpg")
  const thumb2 = Buffer.from(await resThumb.arrayBuffer())

  let txt = `
🎥 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥  

🌐 Plataforma: Facebook  
📺 Resolución: ${data.resolution || "Desconocida"}  

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

  conn.fbMenu = conn.fbMenu || {}
  conn.fbMenu[sentMsg.key.id] = { video }
  if (m.react) await m.react("✅")
}

handler.help = ['facebook <url>', 'fb <url>'];
handler.tags = ['descargas'];
handler.command = ['facebook', 'fb'];

let before = async (m, { conn }) => {
const resThumb34 = await fetch('https://files.catbox.moe/nbkung.jpg')
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
        name: `𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔 𝗗𝗘 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞`,
        jpegThumbnail: thumb246
      }
    },
    participant: "0@s.whatsapp.net"
  };
  if (!m.quoted || !conn.fbMenu) return
  let msgId = m.quoted.id || m.quoted.key?.id
  let data = conn.fbMenu[msgId]
  if (!data) return

  let choice = m.text.trim()
  if (!["1", "2", "3"].includes(choice)) return

  try {
    switch (choice) {
      case "1":
       // await m.reply("⏳ Enviando contenido...")
        await conn.sendMessage(
          m.chat,
          { video: { url: data.video }, caption: "🎬 Facebook Video" },
          { quoted: fkontak }
        )
        break
      case "2":
      //  await m.reply("⏳ Enviando contenido...")
        await conn.sendMessage(
          m.chat,
          { audio: { url: data.video }, mimetype: "audio/mpeg", fileName: "facebook.mp3" },
          { quoted: fkontak }
        )
        break
      case "3":
        //await m.reply("⏳ Enviando contenido...")
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
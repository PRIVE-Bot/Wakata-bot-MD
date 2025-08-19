import fetch from "node-fetch";

// Handler para el comando .1
let handler = async (m, { conn, command }) => {
  try {
    // Descargar imagen de miniatura
    const resImg = await fetch("https://files.catbox.moe/f8qrut.png");
    const img = Buffer.from(await resImg.arrayBuffer());

    // Enviar audio con miniatura y metadata
    await conn.sendMessage(
      m.chat,
      {
        audio: { url: "https://files.catbox.moe/ktilca.mp3" }, // audio de prueba
        mimetype: "audio/mpeg",
        ptt: true,
        fileName: "Naruto-Audio.mp3",
        contextInfo: {
          externalAdReply: {
            title: "Naruto Uzumaki",             // título del audio
            body: "Audio exclusivo 🔥",          // subtítulo
            thumbnail: img,                      // miniatura fija
            sourceUrl: "https://whatsapp.com/channel/0029VbB46nl2ER6dZac6Nd1o" // link opcional
          }
        }
      },
      { quoted: m }
    );
  } catch (error) {
    console.error("Error enviando audio:", error);
    await conn.sendMessage(m.chat, { text: "Ocurrió un error al enviar el audio." }, { quoted: m });
  }
};

// Configurar el comando
handler.command = /^1$/i; // activa con ".1"
export default handler;
const { exec } = require("child_process");
const fs = require("fs");

const defaultLang = "es";
const tempFile = "./tts.mp3"; // Ruta del archivo temporal

async function generarTTS(text, lang = defaultLang) {
  return new Promise((resolve, reject) => {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
    const command = `curl -s -o ${tempFile} "${url}"`;

    exec(command, (error) => {
      if (error) return reject("🚫 Error al generar el TTS.");
      resolve(tempFile);
    });
  });
}

async function obtenerTTS(text, lang = defaultLang) {
  if (!text) return null;
  try {
    const audioPath = await generarTTS(text, lang);
    return audioPath;
  } catch (error) {
    return null;
  }
}

// 📌 Manejador del comando
async function handler(m, { conn, text }) {
  if (!text) return conn.reply(m.chat, "🔊 *Uso:* `!tts <texto>`", m);

  try {
    let audioPath = await obtenerTTS(text);
    if (!audioPath) return conn.reply(m.chat, "🚫 No se pudo generar el audio.", m);

    await conn.sendMessage(m.chat, { audio: { url: audioPath }, mimetype: 'audio/mpeg', ptt: true }, { quoted: m });

    fs.unlinkSync(audioPath); // Eliminar archivo temporal para ahorrar espacio
  } catch (error) {
    conn.reply(m.chat, "⚠️ Error al procesar la solicitud.", m);
  }
}

handler.help = ["tts"];
handler.tags = ["tools"];
handler.command = ["tts"];

module.exports = handler;

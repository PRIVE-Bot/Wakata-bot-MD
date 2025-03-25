import fetch from "node-fetch";
import crypto from "crypto";
import { FormData, Blob } from "formdata-node";
import { fileTypeFromBuffer } from "file-type";
import { exec } from "child_process";
import fs from "fs";

const defaultLang = "es";
const tempFile = "./stickers/tts.mp3"; // Guarda el audio temporalmente

async function generarTTS(text, lang = defaultLang) {
  return new Promise((resolve, reject) => {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;
    const command = `curl -s -o ${tempFile} "${url}"`;

    exec(command, (error) => {
      if (error) return reject("Error al generar el TTS.");
      resolve(tempFile);
    });
  });
}

let handler = async (m, { conn, text, args }) => {
  if (!text) return conn.reply(m.chat, "⚠️ Por favor, ingresa un texto para convertirlo a voz.", m);

  await m.react("⏳");

  try {
    let lang = args[0] || defaultLang;
    let audioPath = await generarTTS(text, lang);

    let txt = `*乂 T E X T - T O - S P E E C H 乂*\n\n`;
    txt += `*» Texto:* ${text}\n`;
    txt += `*» Idioma:* ${lang}\n`;
    txt += `*» Generado por:* ${dev}\n\n`;

    await conn.sendFile(m.chat, fs.readFileSync(audioPath), "tts.mp3", "", m);
    fs.unlinkSync(audioPath);

    await m.react("✅");
  } catch {
    await m.react("❌");
  }
};

handler.help = ["tts"];
handler.tags = ["herramientas"];
handler.command = ["tts"];

export default handler;

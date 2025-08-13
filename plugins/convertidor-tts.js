import gtts from 'node-gtts';
import { readFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import fetch from 'node-fetch';

const defaultLang = 'es';

const handler = async (m, { conn, args }) => {
  let lang = defaultLang;
  let text = args.join(' ');

  // Detectar el idioma si el primer argumento es un código de 2 letras
  if (args[0] && args[0].length === 2 && args[0] !== 'es') {
    lang = args[0].toLowerCase();
    text = args.slice(1).join(' ');
  }

  // Usar el texto de un mensaje citado si no se proporciona ninguno
  if (!text && m.quoted?.text) {
    text = m.quoted.text;
  }

  if (!text) {
    throw '❗ Por favor, ingresa una frase o cita un mensaje para convertir a audio.';
  }

  // Limpiar el texto de caracteres especiales
  text = text.replace(/[^\p{L}\p{N}\p{Zs}]/gu, '');

  let audioBuffer;
  try {
    audioBuffer = await tts(text, lang);
  } catch (e) {
    console.error('Error en la conversión TTS:', e);
    try {
      audioBuffer = await tts(text, defaultLang);
    } catch (e2) {
      console.error('Error al intentar con el idioma por defecto:', e2);
      throw '❌ No se pudo convertir el texto a audio. Inténtalo de nuevo más tarde.';
    }
  }

  // Cargar la imagen de miniatura
  const imgRes = await fetch('https://files.catbox.moe/nuu7tj.jpg');
  const thumbnailBuffer = Buffer.from(await imgRes.arrayBuffer());

  if (audioBuffer) {
    await conn.sendMessage(m.chat, {
      audio: audioBuffer,
      mimetype: 'audio/mpeg',
      ptt: true,
      jpegThumbnail: thumbnailBuffer // Aquí se añade la miniatura
    }, { quoted: m }); // Citar el mensaje original del usuario
  }
};

handler.help = ['tts <lang> <texto>'];
handler.tags = ['transformador'];
handler.command = ['tts'];
handler.group = true;
handler.register = true;

export default handler;

function tts(text, lang = 'es') {
  return new Promise((resolve, reject) => {
    try {
      const gttsInstance = gtts(lang);
      const filePath = join('tmp', Date.now() + '.mp3');
      
      gttsInstance.save(filePath, text, () => {
        try {
          const buffer = readFileSync(filePath);
          unlinkSync(filePath);
          resolve(buffer);
        } catch (e) {
          reject(e);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

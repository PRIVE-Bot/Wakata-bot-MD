import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

// Función para convertir video a gif usando ffmpeg
function videoToGif(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    // comando ffmpeg: ajusta fps, tamaño, loop infinito
    const cmd = `ffmpeg -y -i "${inputPath}" -vf "fps=15,scale=320:-1:flags=lanczos" -loop 0 "${outputPath}"`;
    exec(cmd, (error, stdout, stderr) => {
      if (error) return reject(error);
      resolve(outputPath);
    });
  });
}

export async function handler(m, { conn, command, args, isMedia, quoted }) {
  if (command !== 'togif') return;

  // Obtener mensaje con video: puede ser media directa o video citado
  let mediaMsg = m;
  if (!isMedia && m.quoted?.video) {
    mediaMsg = m.quoted;
  }

  if (!mediaMsg || !mediaMsg.video) {
    return await m.reply('Por favor, envía un video con el comando o responde a un video con el comando.');
  }

  try {
    // Descargar video
    const buffer = await conn.downloadMedia(mediaMsg);

    // Rutas temporales para guardar archivos
    const inputFile = path.join('/tmp', `input_${Date.now()}.mp4`);
    const outputFile = path.join('/tmp', `output_${Date.now()}.gif`);

    // Guardar video en disco
    fs.writeFileSync(inputFile, buffer);

    // Convertir a gif
    await videoToGif(inputFile, outputFile);

    // Leer GIF convertido
    const gifBuffer = fs.readFileSync(outputFile);

    // Enviar gif
    await conn.sendMessage(m.chat, { 
      video: gifBuffer, 
      gifPlayback: true, // esto hará que se reproduzca como GIF en WhatsApp
      caption: 'Aquí tienes tu GIF 😉' 
    }, { quoted: m });

    // Borrar archivos temporales
    fs.unlinkSync(inputFile);
    fs.unlinkSync(outputFile);

  } catch (e) {
    console.error(e);
    await m.reply('Error al convertir el video a GIF.');
  }
}
import fetch from "node-fetch";
import Jimp from "jimp"; // Asegúrate de instalar Jimp con 'npm install jimp'

const handler = async (m, { conn }) => {
  try {
    // 1. Obtener la imagen
    const res = await fetch("https://i.postimg.cc/vg3KfN7T/b98b26f9.jpg");
    const buffer = await res.arrayBuffer();

    // 2. Procesar la imagen con Jimp para crear un thumbnail válido
    const image = await Jimp.read(Buffer.from(buffer));
    const thumbBuffer = await image
      .resize(100, Jimp.AUTO) // Redimensiona la imagen para que sea un thumbnail pequeño
      .quality(70) // Ajusta la calidad
      .getBufferAsync(Jimp.MIME_JPEG); // Convierte a un búfer JPEG

    // 3. Crear el mensaje de ubicación estática (quita 'live: true')
    const message = {
      location: {
        degreesLatitude: 14.0818, // Latitud
        degreesLongitude: -87.2068, // Longitud
        name: "Mi ubicación", // Título de la ubicación
        jpegThumbnail: thumbBuffer,
      },
    };

    // 4. Enviar el mensaje
    await conn.sendMessage(m.chat, message, { quoted: m });
    
  } catch (error) {
    console.error("Error al enviar el mensaje de ubicación:", error);
    conn.sendMessage(m.chat, { text: "Ocurrió un error al intentar enviar la ubicación." }, { quoted: m });
  }
};

handler.command = ["realloc"];
export default handler;

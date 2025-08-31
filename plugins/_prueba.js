import fetch from "node-fetch";
import Jimp from "jimp";

const handler = async (m, { conn }) => {
  try {
    // 1. URL de la imagen que quieres como miniatura
    const urlImagen = "https://i.postimg.cc/vg3KfN7T/b98b26f9.jpg";

    // 2. Obtener y procesar la imagen para crear un thumbnail válido
    const res = await fetch(urlImagen);
    const buffer = await res.arrayBuffer();
    
    const image = await Jimp.read(Buffer.from(buffer));
    const thumbBuffer = await image
      .resize(100, Jimp.AUTO) // Redimensiona la imagen para que sea un thumbnail pequeño
      .quality(70) // Ajusta la calidad
      .getBufferAsync(Jimp.MIME_JPEG); // Convierte a un búfer JPEG

    // 3. Definir el mensaje de ubicación
    const ubicacionMsg = {
      location: {
        degreesLatitude: 14.0818,   // Latitud (ejemplo: Tegucigalpa, Honduras)
        degreesLongitude: -87.2068, // Longitud (ejemplo: Tegucigalpa, Honduras)
        name: "El amor, en su esencia más pura, es un refugio y un faro; pero en la oscuridad de la depresión, a veces se siente como una verdad inalcanzable, o peor aún, como un espejo que solo refleja la distancia entre el mundo que anhelas y la batalla silenciosa que liberas dentro de ti.
", // Título de la ubicación
        jpegThumbnail: thumbBuffer, // La miniatura que procesamos
        
        // El texto de la descripción va en el contexto del mensaje
        caption: "El amor, en su esencia más pura, es un refugio y un faro; pero en la oscuridad de la depresión, a veces se siente como una verdad inalcanzable, o peor aún, como un espejo que solo refleja la distancia entre el mundo que anhelas y la batalla silenciosa que liberas dentro de ti."
      }
    };

    // 4. Enviar el mensaje al chat
    await conn.sendMessage(m.chat, ubicacionMsg, { quoted: m });
    
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
    conn.sendMessage(m.chat, { text: "Ocurrió un error al intentar enviar la ubicación." }, { quoted: m });
  }
};

handler.command = ["realloc"]; // Puedes usar el comando que desees
export default handler;

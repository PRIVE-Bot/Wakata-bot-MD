import fetch from "node-fetch";

const handler = async (m, { conn }) => {
  // Miniatura opcional (puedes usar tu propia URL si quieres)
  const res = await fetch("https://i.postimg.cc/vg3KfN7T/b98b26f9.jpg");
  const thumbBuffer = Buffer.from(await res.arrayBuffer());

  // Mensaje de ubicación en tiempo real
  const message = {
    liveLocationMessage: {
      degreesLatitude: 14.0818,   // Latitud de ejemplo
      degreesLongitude: -87.2068, // Longitud de ejemplo
      name: "Mi ubicación en tiempo real",
      caption: `El amor, en su esencia más pura, es un refugio y un faro; pero en la oscuridad de la depresión, a veces se siente como una verdad inalcanzable...`,
      jpegThumbnail: thumbBuffer,
      accuracyInMeters: 10,   // precisión del pin
      speedInMps: 0,          // velocidad en m/s (opcional)
      degreesClockwise: 0      // rotación del pin (opcional)
    }
  };

  await conn.sendMessage(m.chat, message, { quoted: m });
};

handler.command = ["customlocation"];
export default handler;
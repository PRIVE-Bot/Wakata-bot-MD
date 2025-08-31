import fetch from "node-fetch";

const handler = async (m, { conn }) => {
  // Miniatura opcional
  const res = await fetch("https://i.postimg.cc/vg3KfN7T/b98b26f9.jpg");
  const thumbBuffer = Buffer.from(await res.arrayBuffer());

  // Creamos el mensaje
  const message = {
    locationMessage: {
      degreesLatitude: 14.0818,   // Latitud
      degreesLongitude: -87.2068, // Longitud
      name: "Mi ubicación en tiempo real",
      caption: `El amor, en su esencia más pura, es un refugio y un faro; pero en la oscuridad de la depresión, a veces se siente como una verdad inalcanzable...`,
      jpegThumbnail: thumbBuffer,
      live: true, // indica que es ubicación en tiempo real
      accuracyInMeters: 10
    }
  };

  // Enviar mensaje
  await conn.sendMessage(m.chat, message, { quoted: m });
};

handler.command = ["customlocation"];
export default handler;
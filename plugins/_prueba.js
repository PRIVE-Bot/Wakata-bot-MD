import fetch from "node-fetch";

const handler = async (m, { conn }) => {
  // Descargar la imagen que quieres mostrar
  const res = await fetch("https://i.postimg.cc/vg3KfN7T/b98b26f9.jpg");
  const thumbBuffer = Buffer.from(await res.arrayBuffer());

  // Mensaje tipo ubicación con miniatura personalizada
  const message = {
    location: {
      degreesLatitude: 0,   // no importa, puede ser 0
      degreesLongitude: 0,  // no importa, puede ser 0
      name: "Mi ubicación personalizada", // título de la ubicación
      address: "El amor, en su esencia más pura, es un refugio y un faro; pero en la oscuridad de la depresión, a veces se siente como una verdad inalcanzable, o peor aún, como un espejo que solo refleja la distancia entre el mundo que anhelas y la batalla silenciosa que liberas dentro de ti.
" // descripción del mensaje
    }
  };

  await conn.sendMessage(m.chat, message, { quoted: m });
};

handler.command = ["customlocation"];
export default handler;
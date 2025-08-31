const handler = async (m, { conn }) => {
  const message = {
    location: {
      degreesLatitude: 14.0818,   // latitud de ejemplo
      degreesLongitude: -87.2068, // longitud de ejemplo
      name: "Mi ubicación personalizada",
      address: `El amor, en su esencia más pura, es un refugio y un faro; pero en la oscuridad de la depresión, a veces se siente como una verdad inalcanzable, o peor aún, como un espejo que solo refleja la distancia entre el mundo que anhelas y la batalla silenciosa que liberas dentro de ti.`
    }
  };

  await conn.sendMessage(m.chat, message, { quoted: m });
};

handler.command = ["customlocation"];
export default handler;
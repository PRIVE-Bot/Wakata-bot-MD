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
      address: "Aquí va el texto que quieras" // descripción del mensaje
    },
    contextInfo: {
      externalAdReply: {
        showAdAttribution: true,
        title: "Mejor Bot",
        body: "Bot de prueba con imagen",
        mediaType: 2, // indica imagen
        thumbnail: thumbBuffer,
        sourceUrl: "https://postimg.cc/vg3KfN7T/b98b26f9"
      }
    }
  };

  await conn.sendMessage(m.chat, message, { quoted: m });
};

handler.command = ["customlocation"];
export default handler;
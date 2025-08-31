import fetch from "node-fetch";

const handler = async (m, { conn }) => {
  // Descargar la imagen de Postimg
  const res = await fetch("https://i.postimg.cc/vg3KfN7T/b98b26f9.jpg");
  const thumbBuffer = Buffer.from(await res.arrayBuffer());

  // Enviar mensaje con externalAdReply para mostrar miniatura visible
  const message = {
    text: "📦 Aquí está tu miniatura visible",
    contextInfo: {
      externalAdReply: {
        showAdAttribution: true,
        title: "Mejor Bot",
        body: "Bot de prueba",
        mediaType: 2, // imagen
        thumbnail: thumbBuffer,
        sourceUrl: "https://postimg.cc/vg3KfN7T/b98b26f9"
      }
    }
  };

  await conn.sendMessage(m.chat, message, { quoted: m });
};

handler.command = ["showadreply"];
export default handler;
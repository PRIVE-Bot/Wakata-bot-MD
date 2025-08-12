import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  // Enlace de tu imagen para el mensaje
  const imageUrl = 'https://files.catbox.moe/8vxwld.jpg';
  const imageBuffer = await (await fetch(imageUrl)).buffer();

  // Botones interactivos
  const buttons = [
    {
      urlButton: {
        displayText: 'Ver', // Texto del botón
        url: 'https://tubotprofesional.com' // Enlace del botón
      },
      type: 1 // Tipo de botón de URL
    }
  ];

  // Mensaje principal con la imagen y los botones
  const buttonMessage = {
    image: imageBuffer, // La imagen que se mostrará en el mensaje
    caption: `🚀 *¡Oferta exclusiva!* 🚀\n\n🔥 Consigue tu propio bot de WhatsApp profesional, rápido y personalizable.\n\n✨ Funciones avanzadas: comandos, stickers, conexión QR, reacciones, mensajes enriquecidos y más.\n\n💼 ¡Ideal para negocios y creadores!`,
    footer: '💻 Bot Profesional WhatsApp',
    buttons: buttons,
    headerType: 4 // Indica que el mensaje tiene una imagen como encabezado
  };

  await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
};

handler.command = ['comprar'];
export default handler;

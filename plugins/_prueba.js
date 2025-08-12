import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  // Aseguramos que la imagen se cargue correctamente
  const thumbBuffer = await (await fetch('https://files.catbox.moe/8vxwld.jpg')).buffer();

  // Creamos las secciones de la lista. Cada sección es un grupo de opciones.
  const sections = [
    {
      title: 'Opciones de Compra', // Título de la sección
      rows: [
        {
          title: '🛒 Comprar Ahora',
          description: 'Obtén tu bot de WhatsApp profesional con una sola compra.',
          rowId: 'buy_now', // Identificador que se envía al bot al presionar
        },
        {
          title: '⚙️ Ver Demostración',
          description: 'Descubre cómo funciona el bot antes de comprarlo.',
          rowId: 'view_demo',
        },
      ],
    },
    {
      title: 'Más Información', // Otra sección para opciones adicionales
      rows: [
        {
          title: '💬 Contactar Vendedor',
          description: 'Habla directamente con un asesor sobre tu proyecto.',
          rowId: 'contact_seller',
        },
        {
          title: '🌐 Visitar Web',
          description: 'Explora nuestra página web para ver más detalles y productos.',
          rowId: 'visit_website',
        },
      ],
    },
  ];

  // Creamos el mensaje de lista principal
  const listMessage = {
    text: '🚀 *¡Oferta exclusiva!* 🚀\n\n🔥 Consigue tu propio bot de WhatsApp profesional, rápido y personalizable.\n\n💼 ¡Ideal para negocios y creadores!',
    footer: 'Selecciona una opción para continuar:',
    title: '💻 Bot Profesional WhatsApp', // Título del mensaje de lista
    buttonText: 'Ver Opciones', // Texto del botón principal
    sections,
    listType: 1, // Tipo de lista, 1 es el formato estándar
    contextInfo: {
      externalAdReply: {
        showAdAttribution: true,
        title: '💻 Bot Profesional WhatsApp',
        body: 'El precio es de $50 USD. ¡Empieza a crecer hoy!',
        mediaType: 1,
        thumbnail: thumbBuffer,
        sourceUrl: 'https://tubotprofesional.com',
        renderLargerThumbnail: true,
      },
    },
  };

  await conn.sendMessage(m.chat, listMessage, { quoted: m });
};

handler.command = ['comprar'];
export default handler;

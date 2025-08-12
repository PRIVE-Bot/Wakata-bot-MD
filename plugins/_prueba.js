// plugins/fake-quote-img.js
// Envía un mensaje enriquecido simulando una respuesta a un mensaje con imagen y texto personalizados

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply('📌 Ingresa el texto que quieres en el mensaje citado.')

  const fakeQuote = {
    key: {
      fromMe: false,
      participant: '0@s.whatsapp.net', // no es el usuario real
      remoteJid: 'status@broadcast'    // evita que aparezca un chat real
    },
    message: {
      imageMessage: {
        mimetype: icono,
        caption: text, // texto que se verá en la cita
        jpegThumbnail: await (await fetch('https://i.postimg.cc/jqWqwd8Z/IMG-20250803-WA0146.jpg')).arrayBuffer() // miniatura
      }
    }
  }

  await conn.sendMessage(m.chat, { 
    text: 'Este es el mensaje principal que envío el bot.', 
    contextInfo: { quotedMessage: fakeQuote.message }
  })
}

handler.help = ['fakequoteimg <texto>']
handler.tags = ['fun']
handler.command = ['fakequoteimg']

export default handler
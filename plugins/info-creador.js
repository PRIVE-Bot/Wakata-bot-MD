// Código creado por Deylin
// https://github.com/Deylin-eliac 
// codigo creado para https://github.com/Deylin-eliac
// No quites créditos

import axios from 'axios'
const { generateWAMessageContent, proto } = (await import('@whiskeysockets/baileys')).default

let handler = async (m, { conn }) => {
  const proses = `*Obteniendo información de mi creador...*`
  await conn.sendMessage(m.chat, { text: proses }, { quoted: m })

  const owners = [
  {
    name: 'Deylin',
    desc: '👑 Creador Principal de Naruto-MD',
    image: 'https://files.catbox.moe/51epch.jpg',
    buttons: [
      { name: 'WhatsApp', url: 'https://wa.me/50432955554' },
      { name: 'WhatsApp canal', url: 'https://whatsapp.com/channel/0029VbAzn9GGU3BQw830eA0F' },
      { name: 'Paypal', url: 'https://www.paypal.me/DeylinB' },
      { name: 'Github', url: 'https://github.com/deylin-eliac' },
      { name: 'Website', url: 'https://deylin.vercel.app/' }
    ]
  },
  {
    name: '𝑪𝒉𝒐𝒍𝒊𝒕𝒐-𝑿𝒚𝒛⁩',
    desc: '🌀 Co-creador y tester oficial',
    image: 'https://files.catbox.moe/29tejb.jpg',
    buttons: [
      { name: 'WhatsApp', url: 'https://wa.me/50493374445' },
      { name: 'Github', url: 'https://github.com/Elder504' },
     { name: 'WhatsApp canal', url: 'https://whatsapp.com/channel/0029VbABQOU77qVUUPiUek2W' },
     { name: 'Website', url: 'https://killua-bot.vercel.app/' },
    ]
  },
  {
    name: 'davi zuni 17⁩',
    desc: '⚡ Colaborador y desarrollador base',
    image: 'https://files.catbox.moe/dign93.jpg',
    buttons: [
      { name: 'WhatsApp', url: 'https://wa.me/15614809253' },
      { name: 'Github', url: 'https://github.com/Davizuni17' }
    ]
  }
]
  
  // Enviamos los datos de cada creador de forma individual
  for (let owner of owners) {
    const media = { image: { url: owner.image } };
    const textMessage = `*${owner.name}*\n${owner.desc}\n\n`;
    
    // Generar el texto de los enlaces
    let linksText = '';
    for (let btn of owner.buttons) {
      linksText += `*${btn.name}:* ${btn.url}\n`;
    }

    // Enviar la imagen
    await conn.sendMessage(m.chat, media);

    // Enviar el mensaje de texto con los detalles y los enlaces
    await conn.sendMessage(m.chat, { text: textMessage + linksText }, { quoted: m });
  }

  // Mensaje final
  await conn.sendMessage(m.chat, { text: '✨ ¡Gracias por usar nuestro bot! Apoya a los creadores visitando sus enlaces.' }, { quoted: m });
}

handler.tags = ['main']
handler.command = handler.help = ['donar', 'owner', 'cuentasoficiales', 'creador', 'cuentas']

export default handler

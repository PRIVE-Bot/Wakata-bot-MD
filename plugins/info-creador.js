// Código creado por Deylin
// https://github.com/Deylin-eliac 
// codigo creado para https://github.com/Deylin-eliac
// No quites créditos

import axios from 'axios'

let handler = async (m, { conn }) => {
  const proses = `*Obteniendo información de mi creador...*`
  await conn.sendMessage(m.chat, { text: proses }, { quoted: m })

  const owners = [
    {
      name: 'Deylin',
      desc: '👑 Creador Principal de Naruto-MD',
      image: 'https://files.catbox.moe/51epch.jpg',
      footer: '✨ Apóyame en mis proyectos y descubre más en mis redes.',
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
      footer: '💡 Gracias a 𝑪𝒉𝒐𝒍𝒊𝒕𝒐-𝑿𝒚𝒛⁩ este bot evoluciona con cada prueba',
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
      footer: '🔥 davi zuni 17⁩ aporta mejoras en el código y estabilidad del bot.',
      buttons: [
        { name: 'WhatsApp', url: 'https://wa.me/15614809253' },
        { name: 'Github', url: 'https://github.com/Davizuni17' }
      ]
    }
  ]

  let text = '👑 *Creadores de Naruto-MD*\n\n'
  
  for (let owner of owners) {
    text += `*----------------------------------------*\n\n`
    text += `*Nombre:* ${owner.name}\n`
    text += `*Descripción:* ${owner.desc}\n`
    
    // Aquí puedes añadir los botones como enlaces de texto
    text += `\n*Enlaces:*\n`
    for (let btn of owner.buttons) {
      text += `🔗 ${btn.name}: ${btn.url}\n`
    }
    text += `\n`
  }
  
  text += `*----------------------------------------*\n\n`
  text += `_Si quieres apoyar el proyecto o ver más, visita los enlaces._`

  await conn.sendMessage(m.chat, { text: text }, { quoted: m })
}

handler.tags = ['main']
handler.command = handler.help = ['donar', 'owner', 'cuentasoficiales', 'creador', 'cuentas']

export default handler

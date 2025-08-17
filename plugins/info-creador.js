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
    buttons: [
      { name: 'WhatsApp', url: 'https://wa.me/15614809253' },
      { name: 'Github', url: 'https://github.com/Davizuni17' }
    ]
  }
]
  
  const sections = owners.map((owner, index) => {
    return {
      title: `${owner.name}`,
      rows: owner.buttons.map(btn => ({
        header: `${btn.name}`,
        id: `link-${btn.url}`,
        description: `${btn.url}`
      }))
    }
  })

  const listMessage = {
    text: `*👑 Conoce a los creadores de Naruto-MD*`,
    footer: 'Selecciona una opción para ver más detalles.',
    title: 'Creadores',
    buttonText: 'Ver Creadores',
    sections
  }

  await conn.sendMessage(m.chat, listMessage, { quoted: m })
}

handler.tags = ['main']
handler.command = handler.help = ['donar', 'owner', 'cuentasoficiales', 'creador', 'cuentas']

export default handler

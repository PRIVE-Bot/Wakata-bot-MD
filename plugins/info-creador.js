// Código creado por Deylin
// https://github.com/Deylin-eliac 
// codigo creado para https://github.com/Deylin-eliac
// No quites créditos

import axios from 'axios'
const { generateWAMessageFromContent, proto } = (await import('@whiskeysockets/baileys')).default

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
    // Para los botones de URL en mensajes de lista, no hay un tipo de 'url' directo en las filas.
    // La fila solo puede enviar un mensaje de respuesta.
    // Lo más cercano es usar la descripción para mostrar el enlace.
    return {
      title: `${owner.name} - ${owner.desc}`,
      rows: owner.buttons.map((btn, i) => ({
        title: btn.name,
        rowId: `link-${index}-${i}`,
        description: `Enlace: ${btn.url}`
      }))
    }
  })

  const listMessage = {
    text: `*Conoce a los desarrolladores del bot*\n\nPulsa el botón de abajo para ver sus enlaces.`,
    footer: "© Naruto-MD",
    title: `👑 Creadores de Naruto-MD`,
    buttonText: "Ver Creadores",
    sections
  }

  const listMessageProto = proto.Message.fromObject({
      listMessage: listMessage
  })

  const generatedMessage = generateWAMessageFromContent(
    m.chat,
    {
      listMessage: listMessage
    },
    { quoted: m }
  )

  await conn.relayMessage(m.chat, generatedMessage.message, {
    messageId: generatedMessage.key.id
  })
}

handler.tags = ['main']
handler.command = handler.help = ['donar', 'owner', 'cuentasoficiales', 'creador', 'cuentas']

export default handler

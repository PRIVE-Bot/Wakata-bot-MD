// Código creado por Deylin
// https://github.com/Deylin-eliac 
// codigo creado para https://github.com/Deylin-eliac
// No quites créditos

import axios from 'axios'
const { generateWAMessageContent, generateWAMessageFromContent, proto } = (await import('@whiskeysockets/baileys')).default

let handler = async (m, { conn }) => {
  const proses = `${emoji}\n *Obteniendo información de mi creador...*`
  await conn.sendMessage(m.chat, { text: proses }, { quoted: m })

  async function createImage(url) {
    const { imageMessage } = await generateWAMessageContent({ image: { url } }, {
      upload: conn.waUploadToServer
    })
    return imageMessage
  }


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
    image: 'https://files.catbox.moe/51epch.jpg',
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
    image: 'https://files.catbox.moe/51epch.jpg',
    footer: '🔥 davi zuni 17⁩ aporta mejoras en el código y estabilidad del bot.',
    buttons: [
      { name: 'WhatsApp', url: 'https://wa.me/15614809253' },
      { name: 'Github', url: 'https://github.com/Davizuni17' }
    ]
  }
]

  let cards = []

  for (let owner of owners) {
  const imageMsg = await createImage(owner.image)

  let formattedButtons = owner.buttons.map(btn => ({
    name: 'cta_url',
    buttonParamsJson: JSON.stringify({
      display_text: btn.name,
      url: btn.url
    })
  }))

  cards.push({
    body: proto.Message.InteractiveMessage.Body.fromObject({
      text: ` *${owner.name}*\n${owner.desc}`
    }),
    footer: proto.Message.InteractiveMessage.Footer.fromObject({
      text: owner.footer   
    }),
    header: proto.Message.InteractiveMessage.Header.fromObject({
      hasMediaAttachment: true,
      imageMessage: imageMsg
    }),
    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
      buttons: formattedButtons
    })
  })
}

  const slideMessage = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.fromObject({
          body: proto.Message.InteractiveMessage.Body.create({
            text: '👑 Creador Deylin de Naruto-MD'
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: 'Conoce a los desarrolladores del bot'
          }),
          carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
            cards
          })
        })
      }
    }
  }, {})

  await conn.relayMessage(m.chat, slideMessage.message, { messageId: slideMessage.key.id })
}

handler.tags = ['main']
handler.command = handler.help = ['donar', 'owner', 'cuentasoficiales', 'creador', 'cuentas']

export default handler

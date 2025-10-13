// Código creado por Deylin
// https://github.com/Deylin-eliac 
// código creado para https://github.com/Deylin-eliac
// No quites créditos

import pkg from '@whiskeysockets/baileys'
const { generateWAMessageFromContent, proto } = pkg

let handler = async (m, { conn }) => {
  const owner = {
    name: '👑 Deylin',
    number: '50432955554',
    org: 'Mode / Kirito-Bot',
    desc: 'Creador Principal de Kirito-Bot',
    image: 'https://i.postimg.cc/nzt0Jht5/1756185471053.jpg',
    footer: '✨ Apóyame en mis proyectos y descubre más en mis redes.',
    buttons: [
      { name: '💬 WhatsApp', url: 'https://wa.me/50432955554' },
      { name: '📢 Canal Oficial', url: 'https://whatsapp.com/channel/0029VbAzn9GGU3BQw830eA0F' },
      { name: '💰 Paypal', url: 'https://www.paypal.me/DeylinB' },
      { name: '🌐 Website', url: 'https://Deylin.vercel.app/' }
    ]
  }

  const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${owner.name}
ORG:${owner.org};
TITLE:Creador Principal
TEL;type=CELL;type=VOICE;waid=${owner.number}:${owner.number}
EMAIL;type=INTERNET:soporte@mode.com
URL:${owner.buttons[3].url}
END:VCARD
`.trim()

  // Crear botones
  const buttons = owner.buttons.map(btn => ({
    name: 'cta_url',
    buttonParamsJson: JSON.stringify({
      display_text: btn.name,
      url: btn.url
    })
  }))

  // Crear el mensaje interactivo con la vCard y los botones
  const msg = generateWAMessageFromContent(
    m.chat,
    {
      viewOnceMessage: {
        message: {
          messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            header: proto.Message.InteractiveMessage.Header.fromObject({
              title: owner.name,
              subtitle: owner.desc,
              hasMediaAttachment: false
            }),
            body: proto.Message.InteractiveMessage.Body.fromObject({
              text: `📞 *Contacto del creador*\n\n👤 ${owner.name}\n📱 +${owner.number}\n🏢 ${owner.org}\n\n📇 Se adjunta la tarjeta de contacto.`
            }),
            footer: proto.Message.InteractiveMessage.Footer.fromObject({
              text: owner.footer
            }),
            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
              buttons
            })
          })
        }
      }
    },
    {}
  )

  // Enviar mensaje con vCard adjunta y botones en el mismo envío
  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
  await conn.sendMessage(
    m.chat,
    {
      contacts: {
        displayName: owner.name,
        contacts: [{ vcard }]
      }
    },
    { quoted: msg }
  )
}

handler.tags = ['main']
handler.command = handler.help = ['creador', 'owner', 'contacto', 'deylin']

export default handler
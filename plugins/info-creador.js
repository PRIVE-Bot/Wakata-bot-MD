import pkg from '@whiskeysockets/baileys'
const { proto, generateWAMessage, prepareWAMessageMedia, relayMessage } = pkg

let handler = async (m, { conn }) => {
  const owner = {
    name: '👑 Deylin',
    number: '50432955554',
    org: 'Mode / Kirito-Bot',
    desc: 'Creador Principal de Kirito-Bot',
    footer: '✨ Apóyame en mis proyectos y descubre más en mis redes.',
    buttons: [
      { displayText: '💬 WhatsApp', url: 'https://wa.me/50432955554' },
      { displayText: '📢 Canal Oficial', url: 'https://whatsapp.com/channel/0029VbAzn9GGU3BQw830eA0F' },
      { displayText: '💰 Paypal', url: 'https://www.paypal.me/DeylinB' },
      { displayText: '🌐 Website', url: 'https://Deylin.vercel.app/' }
    ]
  }

  // --- 1. Enviar contacto (vCard) ---
  const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${owner.name}
ORG:${owner.org};
TITLE:Creador Principal
TEL;type=CELL;type=VOICE;waid=${owner.number}:${owner.number}
EMAIL;type=INTERNET:soporte@mode.com
END:VCARD
`.trim()

  await conn.sendMessage(
    m.chat,
    { contacts: { displayName: owner.name, contacts: [{ vcard }] } },
    { quoted: m }
  )

  // --- 2. Enviar mensaje de plantilla con botones de URL ---
  
  // Mapear los botones al formato de TemplateMessage
  const urlButtons = owner.buttons.map(b => ({
    urlButton: { displayText: b.displayText, url: b.url }
  }))

  const templateMessage = proto.Message.fromObject({
      templateMessage: {
          hydratedTemplate: {
              // El cuerpo del mensaje (texto principal)
              hydratedContentText: `👤 ${owner.name}\n📱 +${owner.number}\n🏢 ${owner.org}\n\n${owner.desc}`,
              // El texto del pie de página (footer)
              hydratedFooterText: owner.footer,
              // Agregar los botones
              hydratedButtons: urlButtons
          }
      }
  })

  // Enviar el mensaje de plantilla
  const msg = await generateWAMessage(m.chat, templateMessage, {
      userJid: conn.user.id,
      quoted: m 
  })

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

handler.tags = ['main']
handler.command = handler.help = ['creador', 'owner', 'contacto', 'deylin']

export default handler

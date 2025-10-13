import pkg from '@whiskeysockets/baileys'
const { proto } = pkg

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

  // vCard
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

  // Enviar contacto
  await conn.sendMessage(
    m.chat,
    { contacts: { displayName: owner.name, contacts: [{ vcard }] } },
    { quoted: m }
  )

  // Enviar mensaje de botones
  const templateButtons = owner.buttons.map((b, i) => ({
    index: i,
    urlButton: { displayText: b.displayText, url: b.url }
  }))

  await conn.sendMessage(
    m.chat,
    {
      text: `👤 ${owner.name}\n📱 +${owner.number}\n🏢 ${owner.org}\n\n${owner.desc}`,
      footer: owner.footer,
      templateButtons
    },
    { quoted: m }
  )
}

handler.tags = ['main']
handler.command = handler.help = ['creador', 'owner', 'contacto', 'deylin']

export default handler
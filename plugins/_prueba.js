let handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    contacts: {
      displayName: "Bot Oficial",
      contacts: [{
        vcard: `BEGIN:VCARD
VERSION:3.0
N:;${global.botname};;;
FN:${global.botname}
ORG:Venta de Bots
TEL;type=CELL;type=VOICE;waid=50400000000:+504 0000-0000
END:VCARD`
      }]
    }
  }, { quoted: m })
}

handler.command = ['promo2']
export default handler
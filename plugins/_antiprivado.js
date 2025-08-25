export async function before(m, {conn, isAdmin, isBotAdmin, isOwner, isROwner}) {
  if (m.isBaileys && m.fromMe) return !0;
  if (m.isGroup) return !1;
  if (!m.message) return !0;
  if (m.text.includes('code') || m.text.includes('PAPEL') || m.text.includes('qr') || m.text.includes('serbot') || m.text.includes('jadibot')) return !0;

const res = await fetch('https://i.postimg.cc/6pjTJPXJ/1755843251131.png');
const img = Buffer.from(await res.arrayBuffer());

const fkontak = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
        productMessage: {
            product: {
                productImage: { jpegThumbnail: img },
                title: `texto`,
                description: '𝗗𝗘𝗧𝗘𝗡𝗧𝗘 𝗔𝗩𝗜𝗦𝗢',
                currencyCode: "USD",
                priceAmount1000: "5000", 
                retailerId: "BOT"
            },
            businessOwnerJid: "0@s.whatsapp.net"
        }
    }
};


  const chat = global.db.data.chats[m.chat];
  const bot = global.db.data.settings[this.user.jid] || {};
if (m.chat === '120363402601912509@newsletter') return !0
  if (bot.antiPrivate && !isOwner && !isROwner) {
    await m.reply(
`
█████████████████████████
█     ${botname}     
█████████████████████████

👋 Hola @${m.sender.split`@`[0]},

⚠️ Los comandos no funcionan en *privados*.  
Serás *bloqueado* inmediatamente.

🔥 Usa mis funciones en el  grupo principal:  

█████████████████████████
`, fkontak, { mentions: [m.sender] });
    await this.updateBlockStatus(m.chat, 'block');
  }
  return !1;
}
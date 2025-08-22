export async function before(m, {conn, isAdmin, isBotAdmin, isOwner, isROwner}) {
  if (m.isBaileys && m.fromMe) return !0;
  if (m.isGroup) return !1;
  if (!m.message) return !0;
  if (m.text.includes('code') || m.text.includes('PAPEL') || m.text.includes('qr') || m.text.includes('serbot') || m.text.includes('jadibot')) return !0;
  const chat = global.db.data.chats[m.chat];
  const bot = global.db.data.settings[this.user.jid] || {};
if (m.chat === '120363402601912509@newsletter') return !0
  if (bot.antiPrivate && !isOwner && !isROwner) {
    await m.reply(
`
█████████████████████████
█     🔴 𝐍𝐀𝐑𝐔𝐓𝐎 𝐁𝐎𝐓 🔴     
█████████████████████████

👋 Hola @${m.sender.split`@`[0]},

⚠️ Los comandos no funcionan en *privados*.  
Serás *bloqueado* inmediatamente.

🔥 Usa mis funciones en el  grupo principal:  
🌐 https://naruto-bot.vercel.app/grupo
█████████████████████████
`, false, { mentions: [m.sender] });
    await this.updateBlockStatus(m.chat, 'block');
  }
  return !1;
}
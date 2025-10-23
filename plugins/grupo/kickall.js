let handler = async (m, { conn, participants }) => {
  await m.react('⌛')
  const botId = conn.user.jid
  const groupAdmins = participants.filter(p => p.admin)
  const groupOwner = groupAdmins.find(p => p.isAdmin)?.id
  const groupNoAdmins = participants.filter(p => p.id !== botId && p.id !== groupOwner && !p.admin).map(p => p.id)
  for (let userId of groupNoAdmins) {
    conn.groupParticipantsUpdate(m.chat, [userId], 'remove')
  }
  await m.react('👑')
}

handler.help = ['kickall']
handler.tags = ['grupo']
handler.command = ['kickall']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
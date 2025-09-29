let handler = async (m, { conn, usedPrefix, command }) => {
  if (command !== '1') return
  const sender = m.sender
  const results = {}
  try {
    results.pushName = m.pushName || ''
  } catch (e) {
    results.pushName = ''
  }
  try {
    results.connContactName = (conn && conn.contacts && conn.contacts[sender] && (conn.contacts[sender].name || conn.contacts[sender].vname)) || ''
  } catch (e) {
    results.connContactName = ''
  }
  try {
    results.getName = await (conn.getName ? conn.getName(sender) : Promise.resolve(''))
  } catch (e) {
    results.getName = ''
  }
  try {
    results.jidLocalPart = sender ? sender.split('@')[0] : ''
  } catch (e) {
    results.jidLocalPart = ''
  }
  try {
    results.vcardName = ''
    const contact = conn && conn.contacts && conn.contacts[sender]
    if (contact && contact.vcard) {
      const mV = contact.vcard.match(/FN:(.*)/i)
      if (mV && mV[1]) results.vcardName = mV[1].trim()
    }
  } catch (e) {
    results.vcardName = ''
  }
  const chosen = [
    results.pushName,
    results.vcardName,
    results.connContactName,
    results.getName,
    results.jidLocalPart
  ].find(x => x && x.trim()) || 'Anónimo'
  const out = []
  out.push(`Nombre elegido: ${chosen}`)
  out.push('---')
  out.push(`m.pushName: ${results.pushName || '(vacío)'}`)
  out.push(`contact.vcard FN: ${results.vcardName || '(vacío)'}`)
  out.push(`conn.contacts[name|vname]: ${results.connContactName || '(vacío)'}`)
  out.push(`await conn.getName(jid): ${results.getName || '(vacío)'}`)
  out.push(`JID local (antes de @): ${results.jidLocalPart || '(vacío)'}`)
  out.push('---')
  out.push('Usé varios métodos de fallback para intentar obtener el nombre exacto que usa WhatsApp.')
  await conn.reply(m.chat, out.join('\n'), m)
}
handler.command = ['1']
handler.help = ['1']
handler.tags = ['info']
export default handler
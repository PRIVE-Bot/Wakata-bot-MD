// © Deylin 


let aceptarHandler = async (m, { conn, text, usedPrefix, command, isOwner }) => {
  
  if (!m.isGroup) return m.reply(`❌ Este comando solo se puede usar en el grupo del staff.`)
  if (!isOwner) return m.reply(`❌ No tienes permisos para usar este comando.`)

  if (!m.quoted) return m.reply(`❗️ Responde al mensaje de sugerencia para aprobarla.`)
  let razon = text.trim() || 'Sin razón especificada.'

  
  let regex = /wa\.me\/(\d+)/i
  let match = m.quoted.text.match(regex)
  if (!match) {
    return m.reply(`❗️ No se pudo extraer el número del usuario de la sugerencia.`)
  }
  let userId = match[1] + "@s.whatsapp.net"

  
  await conn.reply(userId, `✅ *¡Tu sugerencia fue ACEPTADA!*\n\n_El staff ha revisado tu propuesta y la ha aprobado._\nRazón: ${razon}`, m)
  m.reply(`✅ Sugerencia aceptada y notificada al usuario.`)
}

aceptarHandler.help = ['aceptar']
aceptarHandler.tags = ['staff']
aceptarHandler.command = ['aceptar']
export default aceptarHandler
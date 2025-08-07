// © Deylin 


let aceptarHandler = async (m, { conn, text, usedPrefix, command, isOwner }) => {
  
 // if (!m.isGroup) return m.reply(`${emoji} Este comando solo se puede usar en el grupo del staff.`)
  if (!isOwner) return m.reply(`${emoji} No tienes permisos para usar este comando.`)

  if (!m.quoted) return m.reply(`${emoji} Responde al mensaje de sugerencia para aprobarla.`)
  let razon = text.trim() || 'Sin razón especificada.'

  
  let regex = /wa\.me\/(\d+)/i
  let match = m.quoted.text.match(regex)
  if (!match) {
    return m.reply(`${emoji} No se pudo extraer el número del usuario de la sugerencia.`)
  }
  let userId = match[1] + "@s.whatsapp.net"

  
  await conn.reply(userId, `${emoji} *¡Tu sugerencia fue ACEPTADA!*\n\n_El staff ha revisado tu propuesta y la ha aprobado._\nRazón: ${razon}`, m)
  m.reply(`${emoji} Sugerencia aceptada y notificada al usuario.`)
}

aceptarHandler.help = ['aceptar']
aceptarHandler.tags = ['staff']
aceptarHandler.command = ['aceptar']
export default aceptarHandler
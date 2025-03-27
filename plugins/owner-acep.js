// Comando para que el staff acepte la sugerencia: .aceptar [razón opcional]
let aceptarHandler = async (m, { conn, text, usedPrefix, command }) => {
  // Verifica que se esté usando en el grupo de staff y que el usuario tenga permisos
  if (!m.isGroup) return m.reply(`Este comando solo se puede usar en el grupo del staff.`)
  // Aquí puedes agregar una función o lógica para validar que m.sender es staff.
  if (!global.staffs.includes(m.sender)) return m.reply(`❌ No tienes permisos para usar este comando.`)

  if (!m.quoted) return m.reply(`❗️ Responde al mensaje de sugerencia para aprobarlo.`)
  let razon = text.trim() || 'Sin razón especificada.'
  
  // Se asume que en la sugerencia se incluyó la línea con "Número: wa.me/XXXXXXXXXXX"
  let regex = /wa\.me\/(\d+)/i
  let match = m.quoted.text.match(regex)
  if (!match) {
    return m.reply(`❗️ No se pudo extraer el número del usuario de la sugerencia.`)
  }
  let userId = match[1] + "@s.whatsapp.net"
  
  // Notifica al usuario que su sugerencia fue aceptada
  await conn.reply(userId, `✅ *¡Tu sugerencia fue ACEPTADA!*\n\n_El staff ha revisado tu propuesta y la ha aprobado._\nRazón: ${razon}`, m)
  m.reply(`✅ Sugerencia aceptada y notificada al usuario.`)
}
aceptarHandler.help = ['aceptar']
aceptarHandler.tags = ['staff']
aceptarHandler.command = ['aceptar']
export default aceptarHandler
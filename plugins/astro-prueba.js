import fetch from 'node-fetch'

let suscripciones = global.suscripciones || (global.suscripciones = {})

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0] || !args[1]) {
    return m.reply(`✘ Uso incorrecto del comando\n\n📌 Ejemplo: *${usedPrefix + command} <enlace del grupo> <tiempo en minutos>*\n\n📌 Ejemplo: *${usedPrefix + command} https://chat.whatsapp.com/ABCDEFGHIJK 60*`)
  }

  let enlace = args[0]
  let tiempo = parseInt(args[1])

  if (!enlace.startsWith('https://chat.whatsapp.com/')) {
    return m.reply('✘ El enlace proporcionado no es válido.')
  }

  if (isNaN(tiempo) || tiempo <= 0) {
    return m.reply('✘ El tiempo debe ser un número válido en minutos.')
  }

  try {
    let res = await conn.groupAcceptInvite(enlace.split('/')[3])
    let groupMetadata = await conn.groupMetadata(res)
    let groupId = groupMetadata.id
    let groupName = groupMetadata.subject

    m.reply(`✅ El bot se ha unido al grupo *${groupName}* por ${tiempo} minutos.`)

    suscripciones[groupId] = setTimeout(async () => {
      await conn.sendMessage(groupId, { text: '⏳ Tu tiempo de suscripción ha finalizado. El bot procederá a salir del grupo.' })
      await conn.groupLeave(groupId)
      delete suscripciones[groupId]
    }, tiempo * 60000)

  } catch (e) {
    m.reply(`✘ Error al unirse al grupo: ${e.message}`)
  }
}

handler.help = ['suscripción <enlace> <tiempo>']
handler.tags = ['bot']
handler.command = ['suscripción']
export default handler
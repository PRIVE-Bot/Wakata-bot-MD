import fetch from 'node-fetch'

let suscripciones = global.suscripciones || (global.suscripciones = {})

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0] || !args[1]) {
    return m.reply(`✘ Uso incorrecto del comando\n\n📌 Ejemplo: *${usedPrefix + command} <enlace del grupo> <días>*\n📌 Ejemplo: *${usedPrefix + command} https://chat.whatsapp.com/ABCDEFGHIJK 3*`)
  }

  let enlace = args[0].trim()
  let dias = parseInt(args[1])

  if (!enlace.startsWith('https://chat.whatsapp.com/')) {
    return m.reply('✘ El enlace proporcionado no es válido.')
  }

  if (isNaN(dias) || dias < 1 || dias > 7) {
    return m.reply('✘ Debes ingresar un número válido entre 1 y 7 para los días.')
  }

  try {
    let codigo = enlace.split('/')[3]
    if (!codigo || codigo.length !== 22) {
      return m.reply('✘ El enlace parece estar incompleto o malformado.')
    }

    let groupId = await conn.groupAcceptInvite(codigo)
    let groupMetadata = await conn.groupMetadata(groupId)
    let groupName = groupMetadata.subject || 'grupo desconocido'

    m.reply(`✅ El bot se ha unido al grupo *${groupName}* por ${dias} ${dias === 1 ? 'día' : 'días'}.`)

    suscripciones[groupId] = setTimeout(async () => {
      await conn.sendMessage(groupId, { text: '⏳ Tu tiempo de suscripción ha finalizado. El bot procederá a salir del grupo.' })
      await conn.groupLeave(groupId)
      delete suscripciones[groupId]
    }, dias * 86400000) // 1 día = 86,400,000 ms

  } catch (e) {
    if (e.message?.includes('not-authorized')) {
      m.reply('✘ No se pudo unir. El bot fue expulsado anteriormente o no tiene permiso.')
    } else if (e.message?.includes('bad-request')) {
      m.reply('✘ Error al unirse al grupo. Verifica que el enlace esté correcto y que el grupo permita nuevas entradas.')
    } else {
      m.reply(`✘ Error desconocido al unirse al grupo:\n${e.message || e}`)
    }
  }
}

handler.help = ['suscripción <enlace> <días>']
handler.tags = ['bot']
handler.command = ['suscripción']
export default handler
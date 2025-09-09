import fs from "fs"

let handler = async (m, { conn, command }) => {
  try {
    if (!m.quoted) throw `✳️ Responde a *un sticker del paquete* con el comando *${command}*`

    let canal = "120363422765084227@newsletter"
    let stickers = []

    // 1. Descargar el sticker al que respondiste
    let mainSticker = await m.quoted.download?.()
    if (mainSticker) stickers.push(mainSticker)

    // 2. Ver si hay stickers en el contexto del paquete
    let grouped = m.quoted.msg?.contextInfo?.groupedMessages || []
    for (let g of grouped) {
      if (g.stickerMessage) {
        let msg = { message: g }
        let buffer = await conn.downloadMediaMessage(msg)
        if (buffer) stickers.push(buffer)
      }
    }

    if (!stickers.length) throw `❌ No se pudo obtener el paquete completo.`

    // 3. Enviar todos al canal
    for (let buffer of stickers) {
      await conn.sendMessage(canal, { sticker: buffer })
    }

    await conn.reply(m.chat, `✅ Paquete de *${stickers.length}* stickers enviado correctamente al canal.`, m)

  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, `❌ Error: ${e}`, m)
  }
}

handler.help = ["canalsticker"]
handler.tags = ["stickers"]
handler.command = /^canalsticker$/i
handler.owner = true

export default handler
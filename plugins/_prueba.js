import fs from "fs"

let handler = async (m, { conn, command }) => {
  try {
    if (!m.quoted) throw `✳️ Responde a *un sticker del paquete* con el comando *${command}*`

    // Detectar si el mensaje citado tiene un sticker
    let stickerMsg = m.quoted.message?.stickerMessage
    if (!stickerMsg) throw `✳️ Debes responder a un *sticker válido*.`

    // Canal de destino
    let canal = "120363422765084227@newsletter"
    let stickers = []

    // Descargar el sticker citado
    let buffer = await m.quoted.download()
    if (buffer) stickers.push(buffer)

    if (!stickers.length) throw `❌ No se pudo reconstruir el paquete.`

    // Enviar al canal todos los stickers recolectados
    for (let buffer of stickers) {
      await conn.sendMessage(canal, { sticker: buffer })
    }

    await conn.reply(m.chat, `✅ Paquete de stickers enviado correctamente al canal.`, m)

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
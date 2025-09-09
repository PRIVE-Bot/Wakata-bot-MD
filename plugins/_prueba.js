import fs from "fs"

let handler = async (m, { conn, command }) => {
  try {
    if (!m.quoted) throw `✳️ Responde a *un sticker del paquete* con el comando *${command}*`

    let canal = "120363422765084227@newsletter"
    let stickers = []

    // 1. Descargar el sticker al que respondiste
    let mainSticker = await m.quoted.download?.().catch(() => null)
    if (mainSticker) stickers.push(mainSticker)

    // 2. Buscar stickers en el contexto (otros del paquete)
    let quotedMsg = m.quoted.msg?.contextInfo?.quotedMessage || {}
    if (quotedMsg.stickerMessage) {
      let msg = { message: quotedMsg }
      let buffer = await conn.downloadMediaMessage(msg).catch(() => null)
      if (buffer) stickers.push(buffer)
    }

    // 3. Evitar error si no se consiguió nada
    if (!stickers.length) throw new Error("No se pudo obtener el paquete de stickers.")

    // 4. Enviar todos al canal
    for (let buffer of stickers) {
      await conn.sendMessage(canal, { sticker: buffer })
    }

    await conn.reply(m.chat, `✅ Se enviaron *${stickers.length}* stickers al canal.`, m)

  } catch (e) {
    console.error("ERROR canalsticker:", e)
    await conn.reply(m.chat, `❌ Error: ${e.message || e}`, m)
  }
}

handler.help = ["canalsticker"]
handler.tags = ["stickers"]
handler.command = /^canalsticker$/i
handler.owner = true

export default handler
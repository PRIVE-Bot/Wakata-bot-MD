import fs from "fs"

let handler = async (m, { conn, command }) => {
  try {
    if (!m.quoted) throw `✳️ Responde a *un sticker del paquete* con el comando *${command}*`

    if (m.quoted.mtype !== "stickerMessage") throw `✳️ Debes responder a un *sticker válido*.`

    // Canal de destino (cámbialo por tu canal)
    let canal = "120363422765084227@newsletter"

    // Obtenemos el mensaje del que respondiste
    let msg = m.quoted

    // Si el sticker tiene un contexto de "álbum" (paquete)
    let context = msg?.message?.contextInfo?.quotedMessage || {}
    let stickers = []

    // Si viene como un paquete de varios
    if (m.quoted && m.quoted.message) {
      let buffer = await m.quoted.download()
      if (buffer) stickers.push(buffer)
    }

    // Aquí puedes expandir: si el paquete vino en lote, agregarlos todos
    // (WhatsApp a veces manda varios con contextInfo)

    if (!stickers.length) throw `❌ No se pudo reconstruir el paquete.`

    // Aviso al canal
   /* await conn.sendMessage(canal, { 
      text: `📦 *Nuevo Paquete de Stickers Subido*  
👤 Autor: @${m.sender.split("@")[0]}  
📌 Cantidad: ${stickers.length}`, 
      mentions: [m.sender] 
    })*/

    // Enviar todos los stickers al canal
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
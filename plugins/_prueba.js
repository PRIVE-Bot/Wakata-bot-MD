import fs from "fs"
import path from "path"

let handler = async (m, { conn }) => {
  try {
    const canal = "120363422765084227@newsletter"
    const folder = "./stickers-paquete" // carpeta con todos los .webp

    const files = fs.readdirSync(folder).filter(f => f.endsWith(".webp"))
    if (!files.length) throw "❌ No hay stickers en el paquete."

    for (let file of files) {
      let buffer = fs.readFileSync(path.join(folder, file))
      await conn.sendMessage(canal, { sticker: buffer })
    }

    await conn.reply(m.chat, `✅ Se enviaron ${files.length} stickers al canal.`, m)
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
import fs from "fs"

let handler = async (m, { text }) => {
  if (!text) return m.reply(` ${emoji} Debes especificar la ruta de un archivo.\n\nEjemplo: /`.readfile ./src/database/sent_welcome.json/``)

  try {
    let data = fs.readFileSync(text, "utf-8")

    const chunkSize = 4000000000000
    if (data.length > chunkSize) {
      for (let i = 0; i < data.length; i += chunkSize) {
        let part = data.substring(i, i + chunkSize)
        await m.reply("📂 *Contenido del archivo (parte)*:\n\n" + part)
      }
    } else {
      await m.reply("📂 *Contenido del archivo*:\n\n" + data)
    }
  } catch (e) {
    m.reply("❌ Error al leer el archivo:\n\n" + e.message)
  }
}

handler.command = ['readfile']
handler.help = ["readfile <ruta>"]
handler.tags = ["tools"]

export default handler
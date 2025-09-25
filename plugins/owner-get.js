import fetch from 'node-fetch'

let handler = async (m, { conn, text }) => {
  if (m.fromMe) return
  if (!/^https?:\/\//.test(text)) return m.reply('Por favor, ingresa la *URL* de la página o archivo.')

  let url = text
  await m.react('🕒')

  try {
    let res = await fetch(url)
    let contentType = res.headers.get('content-type') || ''
    let data = await res.buffer()

    if (/text|json/.test(contentType)) {
      let txt = data.toString('utf-8')
      try {
        txt = JSON.stringify(JSON.parse(txt), null, 2)
      } catch {}
      await m.reply(txt)
    } else {
      await conn.sendFile(m.chat, data, 'archivo', '', m)
    }

    await m.react('✔️')
  } catch (e) {
    await m.reply('Ocurrió un error al obtener el archivo: ' + e)
  }
}

handler.help = ['get', 'fetch']
handler.tags = ['tools']
handler.command = ['fetch', 'get']
handler.rowner = true

export default handler
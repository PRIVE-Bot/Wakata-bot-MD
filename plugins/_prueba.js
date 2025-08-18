import { search, download } from 'aptoide-scraper'

var handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, `${emoji} Por favor, ingrese el nombre de la APK para descargar.`, m, fake)

  try {
    await m.react('⏳')
    let msg = await conn.reply(m.chat, `*${wait}*\n\n> Descargando su aplicación, espere un momento...`, m, fake)
    
    let searchA = await search(text)
    if (!searchA.length) {
      await conn.sendMessage(m.chat, { delete: msg.key }) 
      return conn.reply(m.chat, '❌ No se encontraron resultados.', m, fake)
    }

    let data5 = await download(searchA[0].id)
    let txt = `┏━━━━━━━━━━━━━━━━☒
┇➙ *❒ APTOIDE - DESCARGAS* ❑
┣━━━━━━━━━━━━━━━━⚄
┋➙ *Nombre* : ${data5.name}
┋➙ *Package* : ${data5.package}
┋➙ *Update* : ${data5.lastup}
┋➙ *Peso* : ${data5.size}
┗━━━━━━━━━━━━━━━━⍰`

    await conn.sendMessage(m.chat, { delete: msg.key }) 
    await conn.sendFile(m.chat, data5.icon, 'thumbnail.jpg', txt, m)
    await m.react('✅')

    if (data5.size.includes('GB') || parseFloat(data5.size.replace(' MB', '')) > 999) {
      return await conn.reply(m.chat, '⚠️ El archivo es demasiado pesado para enviarlo.', m, fake)
    }

    await conn.sendMessage(m.chat, {
      document: { url: data5.dllink },
      mimetype: 'application/vnd.android.package-archive',
      fileName: `${data5.name}.apk`
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    return conn.reply(m.chat, '❌ Ocurrió un fallo al intentar descargar la APK.', m, fake)
  }
}

handler.help = ['apk <nombre>']
handler.tags = ['descargas']
handler.command = ['apk', 'modapk', 'aptoide']

handler.group = true
handler.coin = 5

export default handler
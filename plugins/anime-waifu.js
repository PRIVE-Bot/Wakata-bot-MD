import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    // Reacciona si hay un emoji definido
    if (typeof emojis !== 'undefined') await m.react(emojis)

    conn.reply(m.chat, '✎ Buscando su *Waifu* espere un momento...', m, {
      contextInfo: {
        externalAdReply: {
          mediaUrl: null,
          mediaType: 1,
          showAdAttribution: true,
          title: packname || 'Waifu-Bot',
          body: dev || 'Powered by Kirito',
          previewType: 0,
          thumbnail: icons || null,
          sourceUrl: channel || 'https://whatsapp.com/channel/0029VbB46nl2ER6dZac6Nd1o'
        }
      }
    })

    let res = await fetch('https://api.waifu.pics/sfw/waifu')
    if (!res.ok) throw new Error('❌ Error al buscar imagen.')
    
    let json = await res.json()
    if (!json.url) throw new Error('❌ No se encontró la imagen.')

    await conn.sendFile(
      m.chat,
      json.url,
      'waifu.jpg',
      '✧ Aquí tienes tu *Waifu* ฅ^•ﻌ•^ฅ',
      fkontak || m,
      null,
      rcanal || {}
    )

  } catch (e) {
    console.error(e)
    m.reply('❌ Ocurrió un error al buscar tu waifu.')
  }
}

handler.help = ['waifu']
handler.tags = ['anime']
handler.command = ['waifu']
handler.group = true // Solo en grupos, cámbialo a false si lo quieres en privado también

export default handler
import fetch from 'node-fetch'

const handler = async (m, { conn }) => {
  // URL directa de imagen
  const res = await fetch('https://i.postimg.cc/8P7C5rSr/test.jpg')
  const thumb = Buffer.from(await res.arrayBuffer())

  await conn.sendMessage(m.chat, {
    text: "🔥 Prueba con miniatura",
    contextInfo: {
      externalAdReply: {
        title: "Mejor Bot",
        body: "Miniatura funcionando ✅",
        thumbnail: thumb,
        sourceUrl: "https://postimg.cc/vg3KfN7T/b98b26f9",
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m })
}

handler.command = ['1']
export default handler
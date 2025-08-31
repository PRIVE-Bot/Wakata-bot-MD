import fetch from 'node-fetch'

const handler = async (m, { conn }) => {
  const res = await fetch('https://i.postimg.cc/8P7C5rSr/test.jpg') 
  const thumb2 = Buffer.from(await res.arrayBuffer())

  const fkontak = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
      orderMessage: {
        itemCount: 1,
        status: 1,
        surface: 1,
        message: `prueba`,
        orderTitle: "Mejor Bot",
        thumbnail: thumb2, 
        sellerJid: "0@s.whatsapp.net"
      }
    }
  }

  return conn.sendMessage(m.chat, { text: "prueba" }, { quoted: fkontak })
}

handler.command = ['1']
export default handler
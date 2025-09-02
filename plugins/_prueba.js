import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
      const fkontak = {
      key: { fromMe: false, participant: "0@s.whatsapp.net" },
      message: {
        orderMessage: {
          itemCount: 1,
          status: 1,
          surface: 1,
          message: `「HOLA」`,
          orderTitle: "Mejor Bot",
          thumbnail: thumbResized 
        }
      }
    };

  await conn.sendMessage(m.chat, "hola", { quoted: fkontak })
}

handler.command = ['1']
export default handler
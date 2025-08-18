

var handler = async (m, { conn, text }) => {
const res = await fetch('https://files.catbox.moe/oljc0e.png');
const thumb2 = Buffer.from(await res.arrayBuffer());

const fkontak = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
        orderMessage: {
            itemCount: 1,
            status: 1,
            surface: 1,
            message: `${botname}`,
            orderTitle: "Mejor Bot",
            thumbnail: thumb2
        }
    }
}



  return conn.reply(m.chat, `prueba`, fkontak, fake)
};


handler.command = ['1']

export default handler
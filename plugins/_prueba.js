

var handler = async (m, { conn, text }) => {
const res = await fetch('https://files.catbox.moe/875ido.png');
const thumb2 = Buffer.from(await res.arrayBuffer());

const fticket = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
        orderMessage: {
            itemCount: 1,
            status: 1,
            surface: 1,
            message: "🎫 Entrada VIP KilluaBot",
            orderTitle: "Evento KilluaBot",
            thumbnail: thumb2,
            sellerJid: "0@s.whatsapp.net"
        }
    }
}


  return conn.reply(m.chat, `prueba`, fticket, fake)
};


handler.command = ['1']

export default handler
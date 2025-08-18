

var handler = async (m, { conn, text }) => {
const res = await fetch('https://files.catbox.moe/875ido.png');
const thumb2 = Buffer.from(await res.arrayBuffer());

const forder = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
        orderMessage: {
            itemCount: 1,
            status: 1,
            surface: 1,
            message: "KilluaBot | Premium Access",
            orderTitle: "KilluaBot Membresía",
            thumbnail: thumb2
        }
    }
}



  return conn.reply(m.chat, `prueba`, forder, fake)
};


handler.command = ['1']

export default handler
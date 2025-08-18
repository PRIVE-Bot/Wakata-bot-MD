

var handler = async (m, { conn, text }) => {
const res = await const res = await fetch('https://files.catbox.moe/875ido.png');
const estadoSolitario = Buffer.from(await res.arrayBuffer());

const mensajeEstatus = {
    image: estadoSolitario,
    caption: "...", // Una leyenda minimalista o vacía
    mimetype: "image/jpeg"
};



  return conn.reply(m.chat, `prueba`, mensajeEstatus, fake)
};


handler.command = ['1']

export default handler
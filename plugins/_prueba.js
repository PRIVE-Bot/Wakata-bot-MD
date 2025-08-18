

var handler = async (m, { conn, text }) => {
fetch('https://files.catbox.moe/oljc0e.png');
const thumb2 = Buffer.from(await res.arrayBuffer());

const fkontak = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
        documentMessage: {
            title: botname ,
            fileName: "Naruto-Bot.pdf",
            jpegThumbnail: thumb2
        }
    }
}


  return conn.reply(m.chat, `prueba`, fkontak, fake)
};


handler.command = ['1']

export default handler
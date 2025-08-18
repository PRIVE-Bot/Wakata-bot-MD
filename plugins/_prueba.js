

var handler = async (m, { conn, text }) => {
const res = await fetch('https://files.catbox.moe/875ido.png');
const img = Buffer.from(await res.arrayBuffer());

const fdoc = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
        documentMessage: {
            title: "𝗞𝗶𝗹𝗹𝘂𝗮-𝗕𝗼𝘁 | 𝗗𝗼𝗰",
            fileName: "info.pdf",
            jpegThumbnail: thumb2
        }
    }
}



  return conn.reply(m.chat, `prueba`, fdoc, fake)
};


handler.command = ['1']

export default handler
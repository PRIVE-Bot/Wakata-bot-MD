

var handler = async (m, { conn, text }) => {
const res = await fetch('https://files.catbox.moe/oljc0e.png'); 
const thumbDeleted = Buffer.from(await res.arrayBuffer());

let fkontak = {
    key: {
        fromMe: false,
        remoteJid: m.chat,
        id: "deletedMessageFake", 
        participant: "0@s.whatsapp.net"
    },
    message: {
        imageMessage: {
            mimetype: 'image/jpeg',
            caption: '《✧》Este usuario eliminó un mensaje.',
            jpegThumbnail: thumbDeleted
        }
    }
};


  return conn.reply(m.chat, `prueba`, fkontak, fake)
};


handler.command = ['1']

export default handler
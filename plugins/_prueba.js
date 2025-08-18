

var handler = async (m, { conn, text }) => {
const res = await fetch('https://files.catbox.moe/oljc0e.png'); 
const thumb3 = Buffer.from(await res.arrayBuffer());

let userJid = m.sender; 

let fkontak = {
    key: {
        fromMe: false,
        remoteJid: m.chat,
        id: "deletedMessageFake",
        participant: userJid 
    },
    message: {
        imageMessage: {
            mimetype: 'image/jpeg',
            caption: botname ,
            jpegThumbnail: thumb3
        }
    }
};


  return conn.reply(m.chat, `prueba`, fkontak, fake)
};


handler.command = ['1']

export default handler
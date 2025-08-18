

var handler = async (m, { conn, text }) => {
// thumb3 es tu miniatura
const res = await fetch('https://files.catbox.moe/oljc0e.png'); // reemplaza con tu imagen
const thumb3 = Buffer.from(await res.arrayBuffer());

// El usuario que ejecutó el comando
let userJid = m.sender; // JID del usuario que ejecutó el comando

// Fake de mensaje eliminado simulando al usuario
let fkontak = {
    key: {
        fromMe: false,
        remoteJid: m.chat,
        id: "deletedMessageFake",
        participant: userJid // Aquí se asigna al usuario que ejecutó el comando
    },
    message: {
        imageMessage: {
            mimetype: 'image/jpeg',
            caption: '《✧》Este usuario eliminó un mensaje.',
            jpegThumbnail: thumb3
        }
    }
};


  return conn.reply(m.chat, `prueba`, fkontak, fake)
};


handler.command = ['1']

export default handler
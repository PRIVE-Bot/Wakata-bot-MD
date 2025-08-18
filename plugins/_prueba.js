

var handler = async (m, { conn, text }) => {
const res = await fetch('https://files.catbox.moe/875ido.png'); 
const imagenPerfil = Buffer.from(await res.arrayBuffer());

const mensajeContacto = {
    key: {
        participants: "0@s.whatsapp.net",
        remoteJid: "status@broadcast",
        fromMe: false,
        id: "ContactoIA"
    },
    message: {
        contactMessage: {
            displayName: "Mi Bot de Ayuda",
            vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;Mi Bot de Ayuda;;;\nFN:Mi Bot de Ayuda\nEND:VCARD`,
            jpegThumbnail: imagenPerfil
        }
    },
    participant: "0@s.whatsapp.net"
};

  return conn.reply(m.chat, `prueba`, mensajeContacto, fake)
};


handler.command = ['1']

export default handler
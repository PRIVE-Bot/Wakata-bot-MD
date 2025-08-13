var handler = async (m, { conn,usedPrefix, command, text }) => {

if (isNaN(text) && !text.match(/@/g)){

} else if (isNaN(text)) {
var number = text.split`@`[1]
} else if (!isNaN(text)) {
var number = text
}

    const res = await fetch('https://files.catbox.moe/9xene9.jpg');
    const thumb2 = Buffer.from(await res.arrayBuffer());

    const fkontak = {
        key: {
            participants: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            fromMe: false,
            id: "Halo"
        },
        message: {
            locationMessage: {
                name: '𝗡𝗨𝗘𝗩𝗢 𝗔𝗗𝗠𝗜𝗡',
                jpegThumbnail: thumb2
            }
        },
        participant: "0@s.whatsapp.net"
    };

if (!text && !m.quoted) return conn.reply(m.chat, `${emoji} Debes mencionar a un usuario para poder promoverlo a administrador.`, m, fake)
if (number.length > 13 || (number.length < 11 && number.length > 0)) return conn.reply(m.chat, `${emoji} Debe de responder o mensionar a una persona para usar este comando.`, m, fake)

try {
if (text) {
var user = number + '@s.whatsapp.net'
} else if (m.quoted.sender) {
var user = m.quoted.sender
} else if (m.mentionedJid) {
var user = number + '@s.whatsapp.net'
} 
} catch (e) {
} finally {
conn.groupParticipantsUpdate(m.chat, [user], 'promote')
conn.reply(m.chat, `${emoji}\n *Fue agregado como admin del grupo con exito.*`, fkontak, fake)
}

}
handler.help = ['promote']
handler.tags = ['grupo']
handler.command = ['promote','daradmin', 'promover']
handler.group = true
handler.admin = true
handler.botAdmin = true
handler.fail = null

export default handler
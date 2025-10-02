var handler = async (m, { conn, usedPrefix, command, text }) => {
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

    let user;

    
    if (m.quoted) {
        user = m.quoted.sender;
    }

    
    else if (m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
        user = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
    }

    
    else if (text) {
        let number = text.replace(/[^0-9]/g, '');
        if (number.length < 11 || number.length > 13) {
            return conn.reply(m.chat, `${emoji} Debe de responder o mencionar a una persona para usar este comando.`, m, rcanal);
        }
        user = number + "@s.whatsapp.net";
    }

 
    else {
        return conn.reply(m.chat, `${emoji} Debe de responder o mencionar a una persona para usar este comando.`, m, rcanal);
    }

    try {
        await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
        conn.reply(m.chat, `${emoji} @${user.split('@')[0]} fue promovido a administrador con éxito.`, fkontak, {
            mentions: [user]
        });
    } catch (e) {
        conn.reply(m.chat, `❌ Error al promover: ${e}`, m, rcanal);
    }
};

handler.help = ['promote']
handler.tags = ['grupo']
handler.command = ['promote', 'daradmin', 'promover']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler

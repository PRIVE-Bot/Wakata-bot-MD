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
    } else if (m.mentionedJid && m.mentionedJid.length > 0) {
      @
        user = m.mentionedJid[0];
    } else {
        return conn.reply(m.chat, `⚠️ Debes responder o mencionar a un usuario para promoverlo.`, m, fkontak);
    }

    try {
        await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
        conn.reply(m.chat, `✅ @${user.split('@')[0]} fue promovido a administrador con éxito.`, fkontak, {
            mentions: [user]
        });
    } catch (e) {
        conn.reply(m.chat, `❌ Error al promover: ${e}`, m, fkontak);
    }
};

handler.help = ['promote']
handler.tags = ['grupo']
handler.command = ['promote', 'daradmin', 'promover']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler

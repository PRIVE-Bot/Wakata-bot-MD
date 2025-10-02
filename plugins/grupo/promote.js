var handler = async (m, { conn }) => {
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

    
    const ctx = m.message?.extendedTextMessage?.contextInfo || {};
    let user = ctx.participant || (ctx.mentionedJid && ctx.mentionedJid[0]);

    
    if (!user && m.text) {
        let number = m.text.replace(/[^0-9]/g, '');
        if (number.length >= 8 && number.length <= 15) {
            user = number + "@s.whatsapp.net";
        }
    }

    if (!user) {
        return conn.reply(m.chat, `↷♛߹߬ Debe de responder o mencionar a una persona para usar este comando.`, m, fkontak);
    }

    try {
        await conn.groupParticipantsUpdate(m.chat, [user], 'promote');
        conn.reply(m.chat, `✅ @${user.split('@')[0]} fue promovido a administrador con éxito.`, fkontak, rcanal1, {
            mentions: [user]
        });
    } catch (e) {
        conn.reply(m.chat, `❌ Error al promover: ${e}`, m, fkontak);
    }
};

handler.help = ['promote']
handler.tags = ['grupo']
handler.command = ['promote','daradmin','promover']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler

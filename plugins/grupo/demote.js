var handler = async (m, { conn, usedPrefix, command, text }) => {
    const res = await fetch('https://files.catbox.moe/9xene9.jpg')
    const thumb2 = Buffer.from(await res.arrayBuffer())

    const fkontak = {
        key: {
            participants: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            fromMe: false,
            id: "Halo"
        },
        message: {
            locationMessage: {
                name: '𝗨𝗡 𝗔𝗗𝗠𝗜𝗡 𝗠𝗘𝗡𝗢𝗦',
                jpegThumbnail: thumb2
            }
        },
        participant: "0@s.whatsapp.net"
    }

    let user
    if (m.quoted) {
        user = m.quoted.sender
    } else if (m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length) {
        user = m.message.extendedTextMessage.contextInfo.mentionedJid[0]
    } else if (text) {
        let number = text.replace(/[^0-9]/g, '')
        if (number.length < 11 || number.length > 13) {
            return conn.reply(m.chat, `${emoji} Debes mencionar o responder a un usuario válido para poder degradarlo.`, m, fake)
        }
        user = number + "@s.whatsapp.net"
    } else {
        return conn.reply(m.chat, `${emoji} Debes mencionar o responder a un usuario válido para poder degradarlo.`, m, fake)
    }

    try {
        let name = await conn.getName(user)
        if (!name) name = user.split('@')[0]
        await conn.groupParticipantsUpdate(m.chat, [user], 'demote')
        await conn.sendMessage(m.chat, {
            text: `${emoji} @${name} fue degradado y ya no es administrador.`,
            contextInfo: { mentionedJid: [user], ...global.rcanal1 }
        }, { quoted: fkontak })
    } catch (e) {
        conn.reply(m.chat, `❌ Error al degradar: ${e}`, m, fake)
    }
}

handler.help = ['demote']
handler.tags = ['grupo']
handler.command = ['demote', 'quitarpija', 'degradar']
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
import fs from 'fs'
import path from 'path'

let handler = async (m, { conn }) => {
    let who
    let mentionedJid = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]
    let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender

    if (mentionedJid) {
        who = mentionedJid
    } else if (m.quoted) {
        who = m.quoted.sender
    } else {
        who = m.sender
    }

    let name2 = m.sender.split('@')[0]
    let name = who.split('@')[0]

    m.react('😔')

    let str
    if (who !== m.sender) {
        str = `😔 *@${name2}* está triste por *@${name}*`
    } else {
        str = `😔 *@${name2}* está muy triste... necesita apoyo`
    }

    if (m.isGroup) {
        const videos = [
            'https://tenor.com/b12jl.gif',
            'https://tenor.com/dUwxDSx2xTV.gif',
            'https://tenor.com/t3anM5GB7Yk.gif',
            'https://tenor.com/qkmyQGclPgU.gif',
            'https://tenor.com/p9OWwGadd1f.gif'
        ]

        const video = videos[Math.floor(Math.random() * videos.length)]

        conn.sendMessage(m.chat, {
            video: { url: video },
            gifPlayback: true,
            caption: str,
            mentions: [who, m.sender]
        }, { quoted: m })
    }
}

handler.help = ['sad @tag', 'triste @tag']
handler.tags = ['anime']
handler.command = ['sad', 'triste']
handler.group = true

export default handler
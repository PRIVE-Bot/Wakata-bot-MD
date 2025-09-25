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

    m.react('😊')

    let str
    if (who !== m.sender) {
        str = `😊 *@${name2}* está feliz por *@${name}*`
    } else {
        str = `😊 *@${name2}* está muy feliz... compartiendo alegría`
    }

    if (m.isGroup) {
        const videos = [
            'https://files.catbox.moe/x76lvq.mp4',
            'https://files.catbox.moe/9ml3vt.mp4',
            'https://files.catbox.moe/opgwm8.mp4',
            'https://files.catbox.moe/uj1i2j.mp4'
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

handler.help = ['feliz @tag', 'happy @tag']
handler.tags = ['anime']
handler.command = ['feliz', 'happy']
handler.group = true

export default handler
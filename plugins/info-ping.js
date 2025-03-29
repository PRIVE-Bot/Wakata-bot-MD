import speed from 'performance-now'
import { exec } from 'child_process'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let timestamp = speed();
    let latensi = speed() - timestamp;
    
    exec(`neofetch --stdout`, (error, stdout, stderr) => {
        let child = stdout.toString("utf-8");

        conn.reply(m.chat, `*¡Pong!*\n> ╭─────────────╮\n> │ *Tiempo:* ${latensi.toFixed(4)}ms\n> ╰─────────────╯`, m, fake);
    });
}

// Detecta con y sin prefijo
handler.command = ['ping', 'p']
handler.customPrefix = /^(ping|p)$/i
handler.check = (m) => handler.command.includes(m.text.toLowerCase()) || handler.customPrefix.test(m.text)

export default handler
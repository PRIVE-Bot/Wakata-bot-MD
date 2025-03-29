import speed from 'performance-now'
import { exec } from 'child_process'

let handler = async (m, { conn }) => {
    let timestamp = speed();
    let latensi = speed() - timestamp;
    
    exec(`neofetch --stdout`, (error, stdout, stderr) => {
        let child = stdout.toString("utf-8");

        conn.reply(m.chat, `*¡Pong!*\n> ╭─────────────╮\n> │ *Tiempo:* ${latensi.toFixed(4)}ms\n> ╰─────────────╯`, m);
    });
}


handler.customPrefix = /^(ping|p)$/i
handler.command = ['ping', 'p']

export default handler
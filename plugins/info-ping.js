import speed from 'performance-now'
import { spawn, exec, execSync } from 'child_process'

let handler = async (m, { conn }) => {
    let timestamp = speed();
    let latensi = speed() - timestamp;
    
    exec(`neofetch --stdout`, (error, stdout, stderr) => {
        let child = stdout.toString("utf-8");
        let ssd = child.replace(/Memory:/, "Ram:");

        conn.reply(m.chat, `*¡Pong!*\n> ╭─────────────╮\n> │ *Tiempo:* ${latensi.toFixed(4)}ms\n> ╰─────────────╯`, m);
    });
}

// Permitir comandos sin prefijos
handler.customPrefix = /^(ping|p)$/i
handler.command = new RegExp

export default handler
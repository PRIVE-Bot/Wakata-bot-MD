import speed from 'performance-now'
import { exec } from 'child_process'

let handler = async (m, { conn }) => {
    let timestamp = speed();
    let latensi = speed() - timestamp;

    exec('neofetch --stdout', (error, stdout, stderr) => {
        if (error) {
            conn.reply(m.chat, `❌ Error al obtener datos del sistema`, m);
            return;
        }

        let sysInfo = stdout.toString("utf-8");
        let respuesta = `
┏━━━『 *SISTEMA ONLINE* 』━━━⬣
┃ 💻 *RESPUESTA: PONG!*
┃ ⚙️ *LATENCIA:* ${latensi.toFixed(4)} ms
┗━━━━━━━━━━━━━━━━━━━━━━⬣

┌─〔 *INFO DEL SISTEMA* 〕
${sysInfo.trim().split('\n').map(line => `│ ${line}`).join('\n')}
└───────⬣
        `.trim();

        conn.reply(m.chat, respuesta, m);
    });
};

handler.command = ['ping', 'p'];
handler.before = async (m, { conn }) => {
    let text = m.text?.toLowerCase()?.trim();
    if (text === 'ping' || text === 'p') {
        return handler(m, { conn });
    }
};

export default handler;
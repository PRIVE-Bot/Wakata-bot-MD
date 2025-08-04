let cierresProgramados = {};
import { parse } from 'path';

function parseTiempo(entrada) {
    if (/^\d{1,2}:\d{2}$/.test(entrada)) {
        const [horas, minutos] = entrada.split(':').map(Number);
        const ahora = new Date();
        const objetivo = new Date();
        objetivo.setHours(horas);
        objetivo.setMinutes(minutos);
        objetivo.setSeconds(0);
        if (objetivo <= ahora) objetivo.setDate(objetivo.getDate() + 1); // Para mañana
        return objetivo.getTime() - ahora.getTime();
    }

    if (/^\d+h$/.test(entrada)) return parseInt(entrada) * 60 * 60 * 1000;
    if (/^\d+m$/.test(entrada)) return parseInt(entrada) * 60 * 1000;

    return null;
}

let handler = async (m, { conn, args, command }) => {
    

    if (!args[0]) return m.reply('⏰ Uso correcto:\n.cerrargrupo 07:00\n.cerrargrupo 1h\n.cerrargrupo 30m');

    let tiempoMs = parseTiempo(args[0]);
    if (tiempoMs === null) return m.reply('⛔ Formato inválido. Usa:\n07:00 o 1h o 30m');

    let chatId = m.chat;

    if (cierresProgramados[chatId]) clearTimeout(cierresProgramados[chatId]);

    cierresProgramados[chatId] = setTimeout(async () => {
        await conn.groupSettingUpdate(chatId, 'announcement');
        await conn.sendMessage(chatId, {
            text: `🔒 *El grupo ha sido cerrado automáticamente.*\nSolo los administradores pueden enviar mensajes.`
        });
        delete cierresProgramados[chatId];
    }, tiempoMs);

    let minutosRestantes = Math.floor(tiempoMs / 60000);
    m.reply(`✅ Grupo se cerrará automáticamente en *${minutosRestantes} minuto(s).*`);
};

handler.help = ['cerrargrupo <hora | 1h | 30m>'];
handler.tags = ['grupo'];
handler.command = /^cerrargrupo$/i;
handler.admin = true;
handler.group = true;

export default handler;
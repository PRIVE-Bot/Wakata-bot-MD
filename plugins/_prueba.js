let recordatorios = {};

async function handler(m, { args, command, isAdmin, isBotAdmin, groupMetadata }) {
    if (!isAdmin) return m.reply('Solo los administradores pueden usar este comando.');

    if (command === 'recordatorio') {
        if (args.length < 2) return m.reply('Uso: *!recordatorio [minutos] [mensaje]*');

        let tiempo = parseInt(args[0]);
        if (isNaN(tiempo) || tiempo <= 0) return m.reply('El tiempo debe ser un número válido en minutos.');

        let mensaje = args.slice(1).join(' ');
        let chatId = m.chat;

        if (recordatorios[chatId]) clearInterval(recordatorios[chatId]);

        recordatorios[chatId] = setInterval(() => {
            conn.sendMessage(chatId, { text: `🔔 *Recordatorio:* ${mensaje}` });
        }, tiempo * 60000);

        m.reply(`✅ Recordatorio activado: *"${mensaje}"* cada ${tiempo} minuto(s).`);
    }

    if (command === 'cancelarrecordatorio') {
        let chatId = m.chat;
        if (recordatorios[chatId]) {
            clearInterval(recordatorios[chatId]);
            delete recordatorios[chatId];
            m.reply('❌ Recordatorio cancelado.');
        } else {
            m.reply('No hay recordatorios activos en este grupo.');
        }
    }
}

handler.help = ['recordatorio', 'cancelarrecordatorio'];
handler.tags = ['grupo'];
handler.command = ['recordatorio', 'cancelarrecordatorio'];
handler.register = true;
handler.group = true;

export default handler;
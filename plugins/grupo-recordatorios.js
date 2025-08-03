let recordatorios = {};
import fetch from 'node-fetch';

async function handler(m, { args, command, conn, participants }) {
    const chatId = m.chat;

    
    const res = await fetch('https://files.catbox.moe/cduhlw.jpg');
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
                name: ' 𝗥𝗘𝗖𝗢𝗥𝗗𝗔𝗧𝗢𝗥𝗜𝗢',
                jpegThumbnail: thumb2
            }
        },
        participant: "0@s.whatsapp.net"
    };

    if (command === 'recordatorio') {
        if (args.length < 2) return m.reply('Uso: *!recordatorio [minutos] [mensaje]*');

        let tiempo = parseInt(args[0]);
        if (isNaN(tiempo) || tiempo <= 0) return m.reply('El tiempo debe ser un número válido en minutos.');

        let mensaje = args.slice(1).join(' ');

        if (recordatorios[chatId]) clearTimeout(recordatorios[chatId].timeout);

        let contador = 0;
        function enviarRecordatorio() {
            if (contador < 2) {
                let mencionados = participants.map(u => u.id);
                conn.sendMessage(chatId, {
                    text: `🔔 *Recordatorio:*\n\n${mensaje}`,
                    mentions: mencionados
                }, { quoted: fkontak });
                contador++;
                recordatorios[chatId].timeout = setTimeout(enviarRecordatorio, tiempo * 60000);
            } else {
                delete recordatorios[chatId];
            }
        }

        recordatorios[chatId] = { timeout: setTimeout(enviarRecordatorio, tiempo * 60000) };
        m.reply(`✅ Recordatorio activado: *"${mensaje}"* cada ${tiempo} minuto(s), se enviará 2 veces.`);
    }

    if (command === 'cancelarrecordatorio') {
        if (recordatorios[chatId]) {
            clearTimeout(recordatorios[chatId].timeout);
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
handler.admin = true;
handler.group = true;

export default handler;
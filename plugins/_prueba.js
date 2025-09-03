import { format } from 'util';
import { fileURLToPath } from 'url';
import path, { join } from 'path';
import { unwatchFile, watchFile, readFileSync, writeFileSync } from 'fs';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isOwner = async (m, conn) => {
    const detectwhat = m.sender.includes('@lid') ? '@lid' : '@s.whatsapp.net';
    const isROwner = [...global.owner.map(([number]) => number)].map(v => v.replace(/[^0-9]/g, '') + detectwhat).includes(m.sender);
    return isROwner;
};

const isAdmin = (m, participants) => {
    const user = participants.find(p => p.id === m.sender) || {};
    return !!user.admin;
};

let handler = async (m, { conn, args, text, usedPrefix, command, participants }) => {
    if (!m.isGroup) {
        if (!await isOwner(m, conn)) {
            m.reply(`Este comando solo puede ser usado por el Creador.`);
            return;
        }
    } else {
        if (!await isOwner(m, conn) && !isAdmin(m, participants)) {
            m.reply(`Este comando solo puede ser usado por un Creador o un Administrador del grupo.`);
            return;
        }
    }

    if (!text) {
        throw `Por favor, ingresa el nuevo prefijo. Ejemplo:\n*${usedPrefix + command} !*`;
    }

    const newPrefix = args[0];

    const settings = global.db.data.settings[conn.user.jid] || {};
    settings.prefix = newPrefix;
    global.db.data.settings[conn.user.jid] = settings;

    m.reply(`✅ Prefijo cambiado a: *${newPrefix}*`);
    
    // Opcional: Recargar el handler para que el cambio sea instantáneo
    global.reloadHandler(true).catch(console.error);
};

handler.help = ['setprefix <prefijo>'];
handler.tags = ['owner'];
handler.command = /^(setprefix|sprefix)$/i;

export default handler;

// Monitorear cambios en el archivo y recargar
let file = global.__filename(import.meta.url, true);
watchFile(file, async () => {
    unwatchFile(file);
    console.log(chalk.redBright("Se actualizo 'setprefix.js'"));
    if (global.conns && global.conns.length > 0) {
        const users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])];
        for (const userr of users) {
            userr.subreloadHandler(false);
        }
    }
});

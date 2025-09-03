import { format } from 'util';
import { fileURLToPath } from 'url';
import path, { join } from 'path';
import { unwatchFile, watchFile, readFileSync, writeFileSync } from 'fs';
import chalk from 'chalk';
import ws from 'ws';

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
            conn.reply(m.chat, `Este comando solo puede ser usado por el Creador.`, m);
            return;
        }
    } else {
        if (!await isOwner(m, conn) && !isAdmin(m, participants)) {
            conn.reply(m.chat, `Este comando solo puede ser usado por un Creador o un Administrador del grupo.`, m);
            return;
        }
    }

    if (!text) {
        conn.reply(m.chat, `Por favor, ingresa el nuevo prefijo o prefijos separados por un espacio.
Ejemplo:
*${usedPrefix + command} . # !*`, m);
    }

    const newPrefixes = text.split(/\s+/).filter(p => p.length > 0);

    const settings = global.db.data.settings[conn.user.jid] || {};
    settings.prefix = newPrefixes;
    global.db.data.settings[conn.user.jid] = settings;

    conn.reply(m.chat, `✅ Prefijos cambiados a: ${newPrefixes.map(p => `\`${p}\``).join(', ')}`, m);

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

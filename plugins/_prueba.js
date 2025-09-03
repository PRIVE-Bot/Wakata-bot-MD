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
           return conn.reply(m.chat, `${emoji} Este comando solo puede ser usado por el Creador.`, m, rcanal);
        }
    } else {
        if (!await isOwner(m, conn) && !isAdmin(m, participants)) {
           return conn.reply(m.chat, `${emoji} Este comando solo puede ser usado por un Creador o un Administrador del grupo.`, m, rcanal);
        }
    }

    
    if (text === 'resetprefix') {
        const settings = global.db.data.settings[conn.user.jid] || {};
        delete settings.prefix; 
        global.db.data.settings[conn.user.jid] = settings;
       return conn.reply(m.chat, `${emoji} Prefijo personalizado eliminado. El bot ahora usará el prefijo global por defecto.`, m, rcanal);
        global.reloadHandler(true).catch(console.error);
        return;
    }

 
    const newPrefix = args[0]; 
    if (!newPrefix || args.length > 1) {
      return conn.reply(m.chat, `${emoji} Por favor, ingresa solo un prefijo para el bot.
Ejemplo:
*${usedPrefix + command} .*\n\nPara resetear el prefijo y volver al global, usa:
*${usedPrefix + command} reset*`, m, rcanal);
    }

    const settings = global.db.data.settings[conn.user.jid] || {};
    settings.prefix = [newPrefix]; 
    global.db.data.settings[conn.user.jid] = settings;

   return conn.reply(m.chat, `${emoji} Prefijo del bot cambiado a: \`${newPrefix}\``, m, rcanal);

    global.reloadHandler(true).catch(console.error);
};

handler.help = ['setprefix <prefijo>'];
handler.tags = ['owner'];
handler.command = /^(setprefix|sprefix|resetprefix)$/i;

export default handler;

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

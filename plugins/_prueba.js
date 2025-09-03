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
           return conn.reply(m.chat, `Este comando solo puede ser usado por el Creador.`, m, rcanal);
            return;
        }
    } else {
        if (!await isOwner(m, conn) && !isAdmin(m, participants)) {
           return conn.reply(m.chat, `Este comando solo puede ser usado por un Creador o un Administrador del grupo.`, m, rcanal);
            return;
        }
    }

    if (!text) {
      return conn.reply(m.chat, `Por favor, ingresa el nuevo prefijo o prefijos separados por un espacio.
Ejemplo:
*${usedPrefix + command} . # !*`, m, rcanal);
    }

    const newPrefixes = text.split(/\s+/).filter(p => p.length > 0);

    const settings = global.db.data.settings[conn.user.jid] || {};
    settings.prefix = newPrefixes;
    global.db.data.settings[conn.user.jid] = settings;

   return conn.reply(m.chat, `${emoji} Prefijos cambiados a: ${newPrefixes.map(p => `\`${p}\``).join(', ')}`, m, rcanal);

    global.reloadHandler(true).catch(console.error);
};

handler.help = ['setprefix <prefijo>'];
handler.tags = ['owner'];
handler.command = /^(setprefix|sprefix)$/i;

export default handler;

let _prefix = plugin.customPrefix ? plugin.customPrefix : this.prefix ? (Array.isArray(this.prefix) ? this.prefix : [this.prefix]) : global.prefix;
let match = (Array.isArray(_prefix) ?
    _prefix.map(p => {
        let re = p instanceof RegExp ?
            p :
            new RegExp(str2Regex(p));
        return [re.exec(m.text), re];
    }) :
    _prefix instanceof RegExp ?
    [[_prefix.exec(m.text), _prefix]] :
    typeof _prefix === 'string' ?
    [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
    [[[], new RegExp]]
).find(p => p[1]);

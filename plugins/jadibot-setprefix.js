
import { promises as fs } from 'fs';
import path from 'path';

const prefixesFilePath = path.join(path.dirname(new URL(import.meta.url).pathname), '../prefixes.json');

const handler = async (m, { conn, args, usedPrefix, command, isROwner }) => {
    let prefixesData = {};
    try {
        prefixesData = JSON.parse(await fs.readFile(prefixesFilePath, 'utf-8'));
    } catch (e) {
        console.error('Error al leer prefixes.json:', e);
        m.reply('❌ Error al cargar los datos de prefijos.');
        return;
    }

    const botJid = conn.user.jid;

    if (command === 'setprefix') {
        if (!m.isGroup) {
            if (!isROwner) {
                return m.reply('Este comando solo puede ser usado por el Creador.');
            }
        } else {
            const groupMetadata = await conn.groupMetadata(m.chat);
            const isAdmin = groupMetadata.participants.find(p => p.id === m.sender)?.admin;
            if (!isAdmin && !isROwner) {
                return m.reply('Solo los administradores del grupo y el creador pueden usar este comando.');
            }
        }

        const newPrefixes = args.filter(arg => arg.trim() !== '');
        if (newPrefixes.length === 0) {
            return m.reply(`Usa \`${usedPrefix}setprefix <prefijo1> <prefijo2> ...\` para establecer nuevos prefijos.`);
        }

        prefixesData.bots[botJid] = newPrefixes;

        try {
            await fs.writeFile(prefixesFilePath, JSON.stringify(prefixesData, null, 2));
            m.reply(`✅ ¡Prefijos actualizados a: ${newPrefixes.join(', ')}!`);
        } catch (error) {
            console.error('Error al guardar los prefijos:', error);
            m.reply('❌ Ocurrió un error al guardar los prefijos. Inténtalo de nuevo más tarde.');
        }
    }

    else if (command === 'miprefix' || command === 'prefix') {
        const activePrefixes = prefixesData.bots[botJid] || prefixesData.default;
        m.reply(`Los prefijos activos para este bot son: ${activePrefixes.join(', ')}`);
    }

    else if (command === 'resetprefix') {
        if (!m.isGroup) {
            if (!isROwner) {
                return m.reply('Este comando solo puede ser usado por el Creador.');
            }
        } else {
            const groupMetadata = await conn.groupMetadata(m.chat);
            const isAdmin = groupMetadata.participants.find(p => p.id === m.sender)?.admin;
            if (!isAdmin && !isROwner) {
                return m.reply('Solo los administradores del grupo y el creador pueden usar este comando.');
            }
        }

        if (prefixesData.bots[botJid]) {
            delete prefixesData.bots[botJid];
            try {
                await fs.writeFile(prefixesFilePath, JSON.stringify(prefixesData, null, 2));
                const defaultPrefixes = prefixesData.default.join(', ');
                m.reply(`✅ ¡Los prefijos para este bot han sido restablecidos a los valores por defecto: ${defaultPrefixes}!`);
            } catch (error) {
                console.error('Error al restablecer los prefijos:', error);
                m.reply('❌ Ocurrió un error al restablecer los prefijos. Inténtalo de nuevo más tarde.');
            }
        } else {
            m.reply('Este bot ya está usando los prefijos por defecto.');
        }
    }
};

handler.help = ['setprefix', 'miprefix', 'resetprefix'];
handler.tags = ['main'];
handler.command = ['setprefix', 'miprefix', 'resetprefix'];

export default handler;

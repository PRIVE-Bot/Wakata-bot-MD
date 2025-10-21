import { rmSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return m.reply(`💡 Uso: ${usedPrefix + command} <número_de_teléfono_del_subbot>\n\nEjemplo: ${usedPrefix + command} 521999888777`);
    }

    const targetNumberRaw = args[0].replace(/\D/g, '');
    const targetSubBotConn = global.conns.find(c => c.user?.jid && c.user.jid.startsWith(targetNumberRaw));

    if (!targetSubBotConn) {
        return m.reply(`❌ No se encontró ningún subbot activo con el número *+${targetNumberRaw}*. Asegúrate de que esté conectado.`);
    }
    
    const subBotSessionPath = join(global.rutaJadiBot, targetNumberRaw);
    const mainSessionPath = `./${global.sessions}`;

    if (!existsSync(subBotSessionPath)) {
        return m.reply(`❌ La sesión del subbot *+${targetNumberRaw}* no existe en ${subBotSessionPath}.`);
    }

    await m.reply(`⚙️ Iniciando proceso de transferencia de sesión para *+${targetNumberRaw}*...\n\n1. Eliminando credenciales antiguas del bot principal.`);

    try {
        if (existsSync(mainSessionPath)) {
            rmSync(mainSessionPath, { recursive: true, force: true });
            await delay(1000);
        }
        await m.reply('✅ Credenciales principales eliminadas.');
    } catch (e) {
        console.error('Error al borrar sesión principal:', e);
        return m.reply('❌ Error al intentar borrar las credenciales principales.');
    }

    await m.reply('2. Copiando credenciales del subbot a la sesión principal...');
    
    try {
        mkdirSync(mainSessionPath, { recursive: true });
        
        await execPromise(`cp -r ${subBotSessionPath}/* ${mainSessionPath}/`);
        await delay(1000);

        if (!existsSync(join(mainSessionPath, 'creds.json'))) {
            throw new Error("La copia de creds.json falló.");
        }

        await m.reply('3. Eliminando la sesión del subbot original...');
        
        rmSync(subBotSessionPath, { recursive: true, force: true });
        
        await m.reply('✅ Sesión del subbot original eliminada. Reiniciando el Bot...');

    } catch (e) {
        console.error('Error durante la copia/eliminación:', e);
        return m.reply(`❌ Error crítico durante la transferencia de sesión:\n${e.message}`);
    }
    
    setTimeout(() => {
        process.exit(0);
    }, 3000);
}

handler.help = ['setofcbot'];
handler.tags = ['owner'];
handler.command = ['setofcbot'];
handler.owner = true;

export default handler;

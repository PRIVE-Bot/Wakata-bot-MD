import fs from 'fs';
import path from 'path';

var handler = async (m, { usedPrefix, command }) => {
    try {
        await m.react('🕒'); 
        conn.sendPresenceUpdate('composing', m.chat);

        const rootDir = './';  // Puedes cambiar esto si quieres que se empiece desde otra carpeta
        let response = `📂 *Revisión de Syntax Errors:*\n\n`;
        let hasErrors = false;

        // Función para recorrer carpetas y archivos recursivamente
        const checkErrorsInDir = (dir) => {
            const files = fs.readdirSync(dir);

            for (const file of files) {
                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);

                if (stat.isDirectory()) {
                    // Si es un directorio, hacer la llamada recursiva
                    checkErrorsInDir(filePath);
                } else if (file.endsWith('.js')) {
                    // Si es un archivo .js, revisar errores
                    try {
                        await import(filePath);
                    } catch (error) {
                        hasErrors = true;
                        response += `🚩 *Error en:* ${filePath}\n${error.message}\n\n`;
                    }
                }
            }
        };

        // Comienza a revisar desde el directorio raíz o el especificado
        checkErrorsInDir(rootDir);

        if (!hasErrors) {
            response += '✅ ¡Todo está en orden! No se detectaron errores de sintaxis.';
        }

        await conn.reply(m.chat, response, m);
        await m.react('✅');
    } catch (err) {
        await m.react('✖️'); 
        console.error(err);
        conn.reply(m.chat, '🚩 *Ocurrió un fallo al verificar los plugins.*', m);
    }
};

handler.command = ['errores'];
handler.help = ['errores'];
handler.tags = ['tools'];

export default handler;

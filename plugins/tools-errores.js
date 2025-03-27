import fs from 'fs';  
import path from 'path';  

var handler = async (m, { usedPrefix, command }) => {  
    try {  
        await m.react('🕒');   
        conn.sendPresenceUpdate('composing', m.chat);  

        const pluginsDir = './plugins';  
        const files = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js'));  

        let response = `📂 *Revisión de Errores en los Archivos:*\n\n`;  
        let hasErrors = false;  

        for (const file of files) {  
            try {  
                const filePath = path.resolve(pluginsDir, file);
                const plugin = await import(filePath);  // Intentar cargar el archivo
                
                // Intentar ejecutar el plugin si tiene una función principal
                if (plugin.default && typeof plugin.default === 'function') {
                    await plugin.default();
                }
            } catch (error) {  
                hasErrors = true;  
                response += `🚩 *Error en:* ${file}\n${error.stack}\n\n`;  
            }  
        }  

        if (!hasErrors) {  
            response += '✅ ¡Todo está en orden! No se detectaron errores en el código.';  
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

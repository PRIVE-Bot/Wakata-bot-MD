import { execSync } from 'child_process';

let handler = async (m, { conn, usedPrefix, command, args }) => {

  await conn.reply(m.chat, '🌪️ 𝐩𝐫𝐨𝐜𝐞𝐬𝐚𝐧𝐝𝐨 𝐬𝐨𝐥𝐢𝐜𝐢𝐭𝐮𝐝 𝐝𝐞 𝐚𝐜𝐭𝐮𝐚𝐥𝐢𝐳𝐚𝐜𝐢𝐨𝐧...', m); // Eliminado fake

  m.react('🚀'); 
  try {
    const stdout = execSync('git pull' + (m.fromMe && args.length ? ' ' + args.join(' ') : ''));
    let messager = stdout.toString();

    if (messager.includes('⚡ 𝐀𝐬𝐭𝐫𝐨-𝐁𝐨𝐭 𝐲𝐚 𝐞𝐬𝐭𝐚 𝐚𝐜𝐭𝐮𝐚𝐥𝐢𝐳𝐚𝐝𝐨.')) messager = '⚡ Ya estoy actualizado a la última versión.';
    if (messager.includes('👑 Actualizando.')) messager = '⚡ Procesando, espere un momento mientras me actualizo.\n\n' + stdout.toString();

    await conn.reply(m.chat, messager, m); // Eliminado fake
  } catch (error) { // Agregado error
    try {
      const status = execSync('git status --porcelain');

      if (status.length > 0) {
        const conflictedFiles = status.toString().split('\n').filter(line => line.trim() !== '').map(line => {
          if (line.includes('.npm/') || line.includes('.cache/') || line.includes('tmp/') || line.includes('kiritoSession/') || line.includes('npm-debug.log')) {
            return null;
          }
          return '*→ ' + line.slice(3) + '*';
        }).filter(Boolean);

        if (conflictedFiles.length > 0) {
          const errorMessage = `⚡ Se han hecho cambios locales que entran en conflicto con las actualizaciones del repositorio. Para actualizar, reinstala el bot o realiza las actualizaciones manualmente.\n\n✰ *ARCHIVOS EN CONFLICTO*\n\n${conflictedFiles.join('\n')}`;
          await conn.reply(m.chat, errorMessage, m); // Eliminado fake
        }
      }
    } catch (error) {
      console.error(error);
      let errorMessage2 = '⚠️ Ocurrió un error inesperado..';
      if (error.message) {
        errorMessage2 += '\n⚠️ Mensaje de error: ' + error.message;
      }
      await conn.reply(m.chat, errorMessage2, m); // Eliminado fake
    }
  }
};

handler.help = ['update', 'actualizar', 'fix'];
handler.tags = ['owner'];
handler.command = ['update', 'actualizar', 'fix'];
handler.customPrefix = /^(update|actualizar)$/i


export default handler
handler.rowner = true;

export default handler;

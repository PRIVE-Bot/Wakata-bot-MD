import { execSync } from 'child_process';

let handler = async (m, { conn, args }) => { try { await conn.reply(m.chat, '⏳ Actualizando el bot, por favor espere...', m); m.react('⚡');

const output = execSync('git pull' + (args.length ? ' ' + args.join(' ') : '')).toString();
let response;

if (output.includes('Already up to date')) {
  response = '✅ El bot ya está actualizado.';
} else {
  response = `🔄 Se han aplicado actualizaciones:

${output}`; }

await conn.reply(m.chat, response, m);

} catch (error) { try { const status = execSync('git status --porcelain').toString().trim(); if (status) { const conflictedFiles = status.split('\n').filter(line => !line.includes('kiritoSession/') && !line.includes('.cache/') && !line.includes('tmp/')); if (conflictedFiles.length > 0) { const conflictMsg = `⚠️ Conflictos detectados en los siguientes archivos:

${conflictedFiles.map(f => • ${f.slice(3)}).join('\n')}

🔹 Para solucionar esto, reinstala el bot o actualiza manualmente.`; return await conn.reply(m.chat, conflictMsg, m); } } } catch (statusError) { console.error(statusError); }

await conn.reply(m.chat, `❌ Error al actualizar: ${error.message || 'Error desconocido.'}`, m);

} };


handler.help = ['update', 'actualizar']
handler.command = ['update', 'actualizar']
handler.before = async (m, { conn }) => {
    let text = m.text?.toLowerCase()?.trim();
    if (text === 'actualizar' || text === 'update') {
        return handler(m, { conn });
handler.rowner = true;
    }
}

export default handler;

import { promises as fsPromises, existsSync } from "fs";
const fs = { ...fsPromises, existsSync };
import ws from 'ws';

let handler = async (m, { conn: _envio, command, usedPrefix }) => {
    const isDeleteSession = /^(deletesesion|deletebot|deletesession|deletesesaion)$/i.test(command);
    const isPauseBot = /^(stop|pausarai|pausarbot)$/i.test(command);
    const isListBots = /^(bots|bugs|listjadibots|subbots)$/i.test(command);

    async function reportError(e) {
        await m.reply(`⚠️  [SYS-ERR] ${global.emoji} ${global.botname} detectó una falla interna...`);
        console.error(e);
    }

    switch (true) {

        case isDeleteSession: {
            let mentionedJid = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
            let uniqid = `${mentionedJid.split`@`[0]}`;
            const sessionPath = `./${jadi}/${uniqid}`;

            if (!fs.existsSync(sessionPath)) {
                await conn.sendMessage(m.chat, { 
                    text: `
╭─╼━━━━━━━━━━╾─╮
┃ ${global.emoji} Sesión no encontrada  
┃ ➜ Usa: ${usedPrefix}serbot
┃ ➜ O vincula con: ${usedPrefix}serbot (ID)
╰─╼━━━━━━━━━━╾─╯
${global.emoji} ${global.botname}
                    `.trim() 
                }, { quoted: m });
                return;
            }

            if (global.conn.user.jid !== conn.user.jid) {
                await conn.sendMessage(m.chat, { 
                    text: `
╭─╼━━━━━━━━━━╾─╮
┃ ${global.emoji} Este comando solo funciona  
┃ en el *Bot Principal*.  
┃  
┃ 🔗 [Conectar al Principal]  
┃ https://api.whatsapp.com/send/?phone=${global.conn.user.jid.split`@`[0]}&text=${usedPrefix + command}
╰─╼━━━━━━━━━━╾─╯
${global.emoji} ${global.botname}
                    `.trim() 
                }, { quoted: m });
                return;
            }

            await conn.sendMessage(m.chat, { text: `
╭─╼━━━━━━━━━━╾─╮
┃ ${global.emoji} Sub-Bot desconectado  
┃ Tu sesión fue eliminada  
╰─╼━━━━━━━━━━╾─╯
${global.emoji} ${global.botname}
            `.trim() }, { quoted: m });

            try {
                fs.rmdir(`./${jadi}/` + uniqid, { recursive: true, force: true });
                await conn.sendMessage(m.chat, { text: `
╭─╼━━━━━━━━━━╾─╮
┃ ${global.emoji} Limpieza completa  
┃ Rastros de sesión eliminados  
╰─╼━━━━━━━━━━╾─╯
${global.emoji} ${global.botname}
                `.trim() }, { quoted: m });
            } catch (e) {
                reportError(e);
            }
        }
        break;

        case isPauseBot: {
            if (global.conn.user.jid === conn.user.jid) {
                conn.reply(m.chat, `
╭─╼━━━━━━━━━━╾─╮
┃ ${global.emoji} No eres SubBot  
┃ Conéctate desde el  
┃ Bot Principal para pausar  
╰─╼━━━━━━━━━━╾─╯
${global.emoji} ${global.botname}
                `.trim(), m);
            } else {
                await conn.reply(m.chat, `
╭─╼━━━━━━━━━━╾─╮
┃ ${global.emoji} Sub-Bot detenido  
┃ Conexión finalizada  
╰─╼━━━━━━━━━━╾─╯
${global.emoji} ${global.botname}
                `.trim(), m);
                conn.ws.close();
            }
        }
        break;

        
        case isListBots: {
            const users = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])];

            function formatUptime(ms) {
                let seg = Math.floor(ms / 1000);
                let min = Math.floor(seg / 60);
                let hr = Math.floor(min / 60);
                let d = Math.floor(hr / 24);
                seg %= 60; min %= 60; hr %= 24;
                return `${d ? d+"d " : ""}${hr ? hr+"h " : ""}${min ? min+"m " : ""}${seg ? seg+"s" : ""}`;
            }

            const message = users.map((v, index) => 
`╭─[ SubBot #${index + 1} ]─╮
┃ 🔗 wa.me/${v.user.jid.replace(/[^0-9]/g, '')}?text=${usedPrefix}serbot%20--code
┃ 👤 ${v.user.name || 'Sub-Bot'}
┃ 🕑 ${v.uptime ? formatUptime(Date.now() - v.uptime) : '??'}
╰─────────────────────╯`
            ).join('\n\n');

            const responseMessage = `
╭─╼━━━━━━━━━━━━━━━━━━━━╾─╮
┃ ${global.emoji} PANEL DE SUB-BOTS ${global.emoji} 
┃ Conectados: ${users.length || '0'}  
╰─╼━━━━━━━━━━━━━━━━━━━━╾─╯

${message || '🚫 No hay SubBots activos'}

${global.emoji} ${global.botname}
            `.trim();

            await _envio.sendMessage(m.chat, { text: responseMessage, mentions: _envio.parseMention(responseMessage) }, { quoted: m });
        }
        break;
    }
}

handler.command = ['deletesesion', 'deletebot', 'deletesession', 'deletesesaion', 'stop', 'pausarai', 'pausarbot', 'bots', 'bugs', 'listjadibots', 'subbots'];
export default handler;
const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (command === 'prefix') {
      if (!text.trim()) {
        return conn.reply(
          m.chat,
          `⚙️ *Ejemplo:* ${usedPrefix + command} !`,
          m,
          rcanal
        );
      }

      global.prefix = new RegExp(
        '^[' +
          (text || global.opts['prefix'] || '‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-')
            .replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') +
          ']'
      );

      return conn.reply(m.chat, `${emoji} *Prefijo actualizado con éxito! Nuevo prefijo:* ${text}`, m, rcanal);
    }

    if (command === 'resetprefix') {
      const nuevoPrefijo = './#';

      global.prefix = new RegExp(
        '^[' + nuevoPrefijo.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + ']'
      );

      return conn.reply(m.chat, `${emoji} *Prefijo restablecido con éxito a:* ${nuevoPrefijo}`, m, rcanal);
    }
  } catch (err) {
    console.error(err);
    conn.reply(m.chat, '❌ Error al ejecutar el comando.', m, rcanal);
  }
};

handler.help = ['prefix', 'resetprefix'];
handler.tags = ['owner'];
handler.command = ['prefix', 'resetprefix'];
handler.rowner = true;

export default handler;
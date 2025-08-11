let lastTimeoutError = null;

const handler = async (m, { conn }) => {
  if (!lastTimeoutError) {
    return conn.reply(m.chat, 'No se han detectado errores de timeout desde que el bot está activo.', m);
  }

  let texto = '*Último error de timeout detectado:*\n';
  texto += `Mensaje: ${lastTimeoutError.message}\n\n`;
  texto += 'Stack:\n';
  texto += '```' + (lastTimeoutError.stack || 'Sin stack disponible') + '```';

  await conn.reply(m.chat, texto, m);
};

handler.command = ['checktimeout'];

process.on('unhandledRejection', (reason) => {
  if (reason && reason.type === 'system' && reason.code === 'ETIMEDOUT') {
    lastTimeoutError = reason;
    console.error('⚠️ Timeout detectado:', reason.message);
    console.error(reason.stack);
  }
});

process.on('uncaughtException', (error) => {
  if (error && error.code === 'ETIMEDOUT') {
    lastTimeoutError = error;
    console.error('⚠️ Timeout detectado (uncaughtException):', error.message);
    console.error(error.stack);
  }
});

export default handler;
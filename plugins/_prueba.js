let ovsenHandler = async (m, { conn, text }) => {
  // Validar que se haya proporcionado un argumento (mención o número)
  if (!text) return m.reply(`❌ Debes mencionar a un usuario o proporcionar su número.`);

  let userId;
  // Si se menciona al usuario en el mensaje (usado en grupo)
  if (m.mentionedJid && m.mentionedJid.length > 0) {
    userId = m.mentionedJid[0];
  } else {
    // Si se pasó el número manualmente, se limpia y se forma el ID
    let num = text.replace(/[^0-9]/g, '');
    if (!num) return m.reply(`❌ No se encontró un número válido.`);
    userId = num + "@s.whatsapp.net";
  }

  // Se asume que global.privateMessages es un objeto en el que cada clave es un ID de usuario
  // y su valor es un arreglo con los mensajes que el usuario ha enviado al chat privado del bot.
  let mensajes = global.privateMessages && global.privateMessages[userId];
  if (!mensajes || mensajes.length === 0) {
    return m.reply(`❌ No se encontraron mensajes del usuario ${userId} en el chat privado del bot.`);
  }

  // Unir los mensajes en un solo contenido, separándolos por un salto de línea doble
  let contenido = mensajes.join("\n\n");

  // Se envía el contenido como un archivo de texto al número privado del bot.
  // Se asume que el número privado del bot es el mismo que su ID de usuario (conn.user.jid).
  await conn.sendMessage(conn.user.jid, {
    document: Buffer.from(contenido, "utf-8"),
    mimetype: "text/plain",
    fileName: "mensajes.txt"
  });

  m.reply(`✅ Se han enviado ${mensajes.length} mensajes del usuario ${userId} al chat privado del bot.`);
};

ovsenHandler.help = ['ovsen'];
ovsenHandler.tags = ['staff'];
ovsenHandler.command = ['ovsen'];
export default ovsenHandler;
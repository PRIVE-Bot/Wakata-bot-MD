// ====================================================
// Función: Sugerir Comando (.sugerir o .suggest)
// ====================================================
const sugerirHandler = async (m, { conn, text, usedPrefix }) => {
  try {
    // Validar que se haya proporcionado texto
    if (!text) {
      return await conn.reply(m.chat, 
        `❗️ Ingresa tu sugerencia con el siguiente formato:\n\ncomando | descripción\n\nEjemplo:\n!saludo | Envía un mensaje de bienvenida.`, 
        m
      );
    }
    
    // Separar el comando y la descripción usando "|" como separador
    let partes = text.split("|").map(p => p.trim());
    if (partes.length < 2) {
      return await conn.reply(m.chat, `❗️ Formato incorrecto. Usa:\ncomando | descripción`, m);
    }
    
    let [nuevoComando, descripcion] = partes;
    if (nuevoComando.length < 3) {
      return await conn.reply(m.chat, `❗️ El nombre del comando es muy corto.`, m);
    }
    if (descripcion.length < 10) {
      return await conn.reply(m.chat, `❗️ La descripción debe tener al menos 10 caracteres.`, m);
    }
    if (descripcion.length > 1000) {
      return await conn.reply(m.chat, `❗️ La descripción debe tener máximo 1000 caracteres.`, m);
    }
    
    // Construir el mensaje de sugerencia
    let teks = `*✳️ S U G E R E N C I A   D E   C O M A N D O S ✳️*\n\n` +
               `📌 Comando propuesto:\n• ${nuevoComando}\n\n` +
               `📋 Descripción:\n• ${descripcion}\n\n` +
               `👤 Usuario:\n• ${m.pushName || 'Anónimo'}\n` +
               `• Número: wa.me/${m.sender.split('@')[0]}\n\n` +
               `_Para aprobar o rechazar la sugerencia, el staff debe responder a este mensaje con .aceptar o .noaceptar seguido de una razón (opcional)._`;
    
    // Enviar la sugerencia al creador y al grupo de staff
    // Cambia estos ID por los correspondientes en tu bot
    await conn.reply('50488198573@s.whatsapp.net', teks, m, { mentions: conn.parseMention(teks) });
    await conn.reply('120363416199047560@g.us', teks, m, { mentions: conn.parseMention(teks) });
    
    // Confirmación al usuario
    await conn.reply(m.chat, `✅ Tu sugerencia se ha enviado al staff. Recibirás una notificación cuando se revise.`, m);
  } catch (error) {
    console.error("Error en sugerirHandler:", error);
    await conn.reply(m.chat, `❌ Ocurrió un error al enviar tu sugerencia.`, m);
  }
};

sugerirHandler.help = ['sugerir'];
sugerirHandler.tags = ['info'];
sugerirHandler.command = ['sugerir', 'suggest'];


// ====================================================
// Función: Aceptar Sugerencia (.aceptar)
// ====================================================
const aceptarHandler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    // Este comando solo se usa en grupo y debe ser ejecutado por staff
    if (!m.isGroup) return await m.reply(`Este comando solo se puede usar en el grupo del staff.`);
    if (!global.staffs || !global.staffs.includes(m.sender)) return await m.reply(`❌ No tienes permisos para usar este comando.`);
    if (!m.quoted) return await m.reply(`❗️ Responde al mensaje de sugerencia para aprobarlo.`);
    
    let razon = text.trim() || 'Sin razón especificada.';
    
    // Extraer el número del usuario de la sugerencia (se espera "wa.me/XXXXXXXXXXX")
    let regex = /wa\.me\/(\d+)/i;
    let match = m.quoted.text.match(regex);
    if (!match) {
      return await m.reply(`❗️ No se pudo extraer el número del usuario de la sugerencia.`);
    }
    let userId = match[1] + "@s.whatsapp.net";
    
    // Notificar al usuario que su sugerencia fue aceptada
    await conn.reply(userId, 
      `✅ *¡Tu sugerencia fue ACEPTADA!*\n\n_El staff ha revisado tu propuesta y la ha aprobado._\nRazón: ${razon}`, 
      m
    );
    await m.reply(`✅ Sugerencia aceptada y notificada al usuario.`);
  } catch (error) {
    console.error("Error en aceptarHandler:", error);
    await m.reply(`❌ Ocurrió un error al procesar la aceptación.`);
  }
};

aceptarHandler.help = ['aceptar'];
aceptarHandler.tags = ['staff'];
aceptarHandler.command = ['aceptar'];


// ====================================================
// Función: Rechazar Sugerencia (.noaceptar)
// ====================================================
const noAceptarHandler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    // Este comando solo se usa en grupo y debe ser ejecutado por staff
    if (!m.isGroup) return await m.reply(`Este comando solo se puede usar en el grupo del staff.`);
    if (!global.staffs || !global.staffs.includes(m.sender)) return await m.reply(`❌ No tienes permisos para usar este comando.`);
    if (!m.quoted) return await m.reply(`❗️ Responde al mensaje de sugerencia para rechazarlo.`);
    
    let razon = text.trim() || 'Sin razón especificada.';
    
    // Extraer el número del usuario de la sugerencia
    let regex = /wa\.me\/(\d+)/i;
    let match = m.quoted.text.match(regex);
    if (!match) {
      return await m.reply(`❗️ No se pudo extraer el número del usuario de la sugerencia.`);
    }
    let userId = match[1] + "@s.whatsapp.net";
    
    // Notificar al usuario que su sugerencia fue rechazada
    await conn.reply(userId, 
      `❌ *Tu sugerencia fue RECHAZADA*\n\n_El staff ha revisado tu propuesta y decidió no implementarla._\nRazón: ${razon}`, 
      m
    );
    await m.reply(`❌ Sugerencia rechazada y notificada al usuario.`);
  } catch (error) {
    console.error("Error en noAceptarHandler:", error);
    await m.reply(`❌ Ocurrió un error al procesar el rechazo.`);
  }
};

noAceptarHandler.help = ['noaceptar'];
noAceptarHandler.tags = ['staff'];
noAceptarHandler.command = ['noaceptar'];


// ====================================================
// Función Principal para Dirigir los Comandos
// ====================================================
const handler = async (m, { conn, text, usedPrefix, command }) => {
  switch (command) {
    case 'sugerir':
    case 'suggest':
      await sugerirHandler(m, { conn, text, usedPrefix });
      break;
    case 'aceptar':
      await aceptarHandler(m, { conn, text, usedPrefix, command });
      break;
    case 'noaceptar':
      await noAceptarHandler(m, { conn, text, usedPrefix, command });
      break;
    default:
      await m.reply(`Comando no reconocido.`);
  }
};

handler.help = [
  ...sugerirHandler.help,
  ...aceptarHandler.help,
  ...noAceptarHandler.help
];
handler.tags = ['sugerencias', 'staff'];

// Exporta el handler para que sea utilizado por el bot
export default handler;
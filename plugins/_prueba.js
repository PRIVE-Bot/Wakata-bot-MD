import { jidNormalizedUser, jidDecode } from '@whiskeysockets/baileys'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  // Une todos los argumentos para manejar números con espacios
  const fullNumber = args.join('');
  
  if (!fullNumber) {
    return m.reply(`📌 Uso: ${usedPrefix + command} 50499999999`);
  }

  // Limpia el número de entrada de cualquier caracter que no sea un dígito
  const rawNumber = fullNumber.replace(/\D/g, '');
  
  // Ahora la longitud del número será la correcta
  if (rawNumber.length < 8) {
    return m.reply('❌ Por favor, ingresa un número de teléfono válido con código de país.');
  }
  
  // Normaliza el JID
  const jid = jidNormalizedUser(rawNumber + '@s.whatsapp.net');

  // Verifica si el número existe en WhatsApp
  let exists = false;
  try {
    const results = await conn.onWhatsApp(rawNumber);
    if (results && results[0] && results[0].exists) {
      exists = true;
    }
  } catch (e) {
    console.error("Error al verificar la existencia del número en WhatsApp:", e);
  }

  if (!exists) {
    return m.reply('❌ Ese número no está en WhatsApp o no se pudo verificar.');
  }

  // Define variables para los datos del perfil
  let ppUrl = 'https://i.imgur.com/Qj4S7o7.png'; // URL por defecto para la foto de perfil no encontrada
  let name = 'No disponible';
  let statusText = 'No disponible';
  let businessInfo = null;

  // Obtiene los datos del perfil de forma segura
  try {
    ppUrl = await conn.profilePictureUrl(jid, 'image');
  } catch (e) { /* La URL por defecto se mantiene */ }
  
  try {
    name = await conn.getName(jid);
  } catch (e) { /* El nombre por defecto se mantiene */ }
  
  try {
    const status = await conn.fetchStatus(jid);
    if (status && status.status) {
      statusText = status.status;
    }
  } catch (e) { /* El estado por defecto se mantiene */ }

  // Intenta obtener el perfil de negocio (si la función existe)
  try {
    if (typeof conn.getBusinessProfile === 'function') {
      businessInfo = await conn.getBusinessProfile(jid);
    }
  } catch (e) {
    console.error("Error al obtener el perfil de negocios:", e);
  }

  // Decodifica el JID para obtener información de dispositivo
  const d = jidDecode(jid) || {};
  const decodedLines = [];
  if (d.user) decodedLines.push(`• Usuario: ${d.user}`);
  if (d.server) decodedLines.push(`• Servidor: ${d.server}`);
  if (typeof d.device !== 'undefined') decodedLines.push(`• Dispositivo: ${d.device === 0 ? 'Principal' : 'Compañero'}`);

  // Construye el mensaje de respuesta
  const info = [
    `*INFORMACIÓN DEL NÚMERO:*`,
    `> Número: ${rawNumber}`,
    `> JID: ${jid}`,
    `> Nombre: ${name}`,
    `> Estado: ${statusText}`,
    `> Foto de perfil: ${ppUrl !== 'https://i.imgur.com/Qj4S7o7.png' ? 'Sí ✅' : 'No ❌'}`,
    businessInfo ? `> Cuenta Business: Sí ✅` : `> Cuenta Business: No detectado ❌`,
    businessInfo?.description ? `> Descripción Business: ${businessInfo.description}` : '',
    businessInfo?.categories?.length ? `> Categorías Business: ${businessInfo.categories.join(', ')}` : '',
    decodedLines.length ? `\n*JID Decodificado:*\n${decodedLines.map(l => `  ${l}`).join('\n')}` : '',
    `\n*🚨 Nota:* Solo se muestra información pública. No se accede a datos privados como IP o ubicación.`
  ].filter(Boolean).join('\n');

  // Envía el mensaje y la foto de perfil
  await conn.sendMessage(m.chat, {
    image: { url: ppUrl },
    caption: info,
    contextInfo: {
      externalAdReply: {
        title: name,
        body: 'Información de WhatsApp',
        thumbnailUrl: ppUrl,
        sourceUrl: 'https://whatsapp.com'
      }
    }
  }, { quoted: m });
};

handler.help = ['whois <número>']
handler.tags = ['herramientas']
handler.command = /^whois|info$/i

export default handler

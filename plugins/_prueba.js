// plugins/report.js
import fs from 'fs';
import path from 'path';

let reports = {}; // Para almacenar temporalmente los reportes en memoria (puedes usar DB)

let handler = async (m, { conn, text, usedPrefix, command }) => {

  if (!text && !m.quoted) {
    return conn.reply(m.chat, `${emoji} Por favor, ingrese su reporte en el siguiente formato:\n\nerror | descripción detallada\n\nEjemplo:\n${usedPrefix}report | El comando /sticker no funciona y arroja un error.\nTambién puedes adjuntar capturas o logs como mensaje citado.`, m, rcanal);
  }

  let content = text;
  if (!content && m.quoted && m.quoted.text) content = m.quoted.text;

  let parts = content.split("|").map(p => p.trim());
  if (parts.length < 2) {
    return conn.reply(m.chat, `${emoji} Formato incorrecto. Use:\nerror | descripción`, m, rcanal);
  }

  let [errorNombre, descripcion] = parts;
  if (errorNombre.length < 1) return conn.reply(m.chat, `${emoji} El nombre del error es muy corto.`, m, rcanal);
  if (descripcion.length < 10) return conn.reply(m.chat, `${emoji} La descripción debe tener al menos 10 caracteres.`, m, rcanal);
  if (descripcion.length > 1000) return conn.reply(m.chat, `${emoji} La descripción debe tener máximo 1000 caracteres.`, m, rcanal);

  // Generar ID único para el reporte
  let reportId = `RPT-${Date.now()}`;

  // Guardar reporte en memoria
  reports[reportId] = {
    id: reportId,
    error: errorNombre,
    descripcion,
    user: m.sender,
    pushName: m.pushName || 'Anónimo',
    chat: m.chat,
    status: 'pendiente',
    timestamp: new Date(),
  };

  // Construir mensaje profesional
  let teks = `*🚨 NUEVO REPORTE DE ERROR 🚨*\n\n*ID:* ${reportId}\n*Error reportado:* ${errorNombre}\n*Descripción:* ${descripcion}\n*Usuario:* ${m.pushName || 'Anónimo'}\n*Número:* wa.me/${m.sender.split`@`[0]}\n*Estado:* Pendiente\n\n_Para marcar este reporte como resuelto use:_\n.resuelto ${reportId} [opcional: comentario]\n_Para marcar como no resuelto use:_\n.noresuelto ${reportId} [opcional: comentario]`;

  // Si hay media adjunta (imagen, video, documento)
  let quotedMsg = m.quoted ? m.quoted : null;

  const ownerJid = '50432955554@s.whatsapp.net';
  const staffGroup = '120363420911001779@g.us';

  // Enviar al owner
  if (quotedMsg && quotedMsg.message) {
    await conn.sendMessage(ownerJid, { 
      text: teks, 
      mentions: [m.sender], 
      contextInfo: { externalAdReply: { mediaUrl: '', title: 'Reporte de Error', body: descripcion } }, 
      quoted: quotedMsg 
    });
    await conn.sendMessage(staffGroup, { 
      text: teks, 
      mentions: [m.sender], 
      contextInfo: { externalAdReply: { mediaUrl: '', title: 'Reporte de Error', body: descripcion } }, 
      quoted: quotedMsg 
    });
  } else {
    await conn.sendMessage(ownerJid, { text: teks, mentions: [m.sender] });
    await conn.sendMessage(staffGroup, { text: teks, mentions: [m.sender] });
  }

  await conn.reply(m.chat, `${emoji} *Tu reporte se ha enviado al staff.*\nRecibirás una notificación cuando sea revisado.`, m, rcanal);
}

// Comando para marcar como resuelto
let resolveHandler = async (m, { conn, text }) => {
  const emoji = '✅';
  let args = text.split(" ");
  let id = args[0];
  let comment = args.slice(1).join(" ") || 'Sin comentario';

  if (!reports[id]) return conn.reply(m.chat, `${emoji} No se encontró el reporte con ID: ${id}`, m);

  reports[id].status = 'resuelto';
  reports[id].staffComment = comment;

  let userJid = reports[id].user;
  await conn.sendMessage(userJid, { text: `✅ Tu reporte *${reports[id].error}* ha sido marcado como *resuelto*.\nComentario del staff: ${comment}` });
  await conn.reply(m.chat, `${emoji} El reporte ${id} se ha marcado como resuelto.`, m);
}

// Comando para marcar como no resuelto
let notResolveHandler = async (m, { conn, text }) => {
  const emoji = '❌';
  let args = text.split(" ");
  let id = args[0];
  let comment = args.slice(1).join(" ") || 'Sin comentario';

  if (!reports[id]) return conn.reply(m.chat, `${emoji} No se encontró el reporte con ID: ${id}`, m);

  reports[id].status = 'no resuelto';
  reports[id].staffComment = comment;

  let userJid = reports[id].user;
  await conn.sendMessage(userJid, { text: `❌ Tu reporte *${reports[id].error}* ha sido marcado como *no resuelto*.\nComentario del staff: ${comment}` });
  await conn.reply(m.chat, `${emoji} El reporte ${id} se ha marcado como no resuelto.`, m);
}

handler.help = ['report']
handler.tags = ['main']
handler.command = ['report', 'bug', 'error']

resolveHandler.help = ['resuelto']
resolveHandler.tags = ['staff']
resolveHandler.command = ['resuelto']

notResolveHandler.help = ['noresuelto']
notResolveHandler.tags = ['staff']
notResolveHandler.command = ['noresuelto']

export { handler, resolveHandler, notResolveHandler }
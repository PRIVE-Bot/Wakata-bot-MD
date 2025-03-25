// Código creado por Deylin
// https://github.com/deylinqff
// No quites créditos

import PhoneNumber from 'awesome-phonenumber';

async function handler(m, { conn }) {
  m.react('👑');

  const creadores = [
    { numero: '50488198573', nombre: 'Deylin', empresa: 'Deylin - creador de bots' },
    { numero: '526633900512', nombre: 'Brayan', empresa: 'Creador de bots' }
  ];

  const contactos = [];

  for (const creador of creadores) {
    const ownerJid = creador.numero + '@s.whatsapp.net';
    
    let name = creador.nombre;
    let about = 'Sin descripción';

    try {
      name = await conn.getName(ownerJid) || creador.nombre;
    } catch (e) {
      console.error(`Error al obtener el nombre de ${creador.numero}:`, e);
    }

    try {
      const status = await conn.fetchStatus(ownerJid);
      if (status?.status) {
        about = status.status;
      }
    } catch (e) {
      console.error(`Error al obtener la descripción de ${creador.numero}:`, e);
    }

    const vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${name};;;
FN:${name}
ORG:${creador.empresa};
TITLE:CEO & Fundador
TEL;waid=${creador.numero}:${new PhoneNumber('+' + creador.numero).getNumber('international')}
EMAIL:correo@empresa.com
URL:https://www.tuempresa.com
NOTE:${about}
ADR:;;Dirección de tu empresa;;;;
X-ABADR:ES
X-ABLabel:Dirección Web
X-ABLabel:Correo Electrónico
X-ABLabel:Teléfono de contacto
X-WA-BIZ-NAME:${name}
X-WA-BIZ-DESCRIPTION:${about}
END:VCARD
    `.trim();

    contactos.push({ vcard });
  }

  await conn.sendMessage(
    m.chat,
    { contacts: { displayName: 'Creadores', contacts: contactos } },
    { quoted: m }
  );
}

handler.help = ['owner'];
handler.tags = ['main'];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;
// Código creado por Deylin
// https://github.com/deylinqff
// No quites créditos

import PhoneNumber from 'awesome-phonenumber';

async function handler(m, { conn }) {
  m.react('👑');

  const creadores = [
    { numero: '526641804242', nombre: 'Brayan', descripcion: 'Creador de bots y desarrollador' },
    { numero: '50488198573', nombre: 'Deylin', descripcion: 'Experto en tecnología y automatización' }
  ];

  for (const creador of creadores) {
    const vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${creador.nombre};;;
FN:${creador.nombre}
TEL;waid=${creador.numero}:${new PhoneNumber('+' + creador.numero).getNumber('international')}
NOTE:${creador.descripcion}
END:VCARD
    `.trim();

    await conn.sendMessage(
      m.chat,
      { contacts: { displayName: creador.nombre, contacts: [{ vcard }] } },
      { quoted: m }
    );
  }
}

handler.help = ['owner'];
handler.tags = ['main'];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;
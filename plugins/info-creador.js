import PhoneNumber from 'awesome-phonenumber';
import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

async function handler(m, { conn }) {
  m.react('👑');

  const numCreador = '50433191934';
  const ownerJid = numCreador + '@s.whatsapp.net';
  const name = await conn.getName(ownerJid) || 'Deylin';
  const about = (await conn.fetchStatus(ownerJid).catch(() => {}))?.status || 'Servicios técnicos de software para WhatsApp';
  const empresa = 'Servicios Tecnológicos';

  const vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${name};;;
FN:${name}
ORG:${empresa};
TITLE:CEO & Fundador
TEL;waid=${numCreador}:${new PhoneNumber('+' + numCreador).getNumber('international')}
EMAIL:correo@empresa.com
URL:https://www.tuempresa.com
NOTE:${about}
END:VCARD
  `.trim();

  // Mensaje con botones + vCard
  const template = generateWAMessageFromContent(m.chat, {
    templateMessage: {
      hydratedTemplate: {
        hydratedContentText: `📇 Contacto del Creador\n\n${name}\n${about}`,
        locationMessage: { jpegThumbnail: Buffer.from(await (await fetch('https://files.catbox.moe/cduhlw.jpg')).arrayBuffer()) },
        hydratedFooterText: 'Guarda el contacto o visita la web',
        hydratedButtons: [
          {
            callButton: {
              displayText: '📞 Llamar',
              phoneNumber: numCreador
            }
          },
          {
            urlButton: {
              displayText: '🌐 Visitar Web',
              url: 'https://www.tuempresa.com'
            }
          },
          {
            quickReplyButton: {
              displayText: '💾 Guardar Contacto',
              id: 'guardar_contacto'
            }
          }
        ],
        // Aquí incluimos la vCard dentro del template
        hydratedContentMessage: {
          contactsMessage: {
            displayName: name,
            contacts: [{ vcard }]
          }
        }
      }
    }
  }, { quoted: m });

  await conn.relayMessage(m.chat, template.message, { messageId: template.key.id });
}

handler.help = ['owner'];
handler.tags = ['main'];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;
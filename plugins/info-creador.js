// código creado por Deylin 
// https://github.com/deylin-eliac 
// no quites créditos

import PhoneNumber from 'awesome-phonenumber';

const handler = async (m, { conn }) => {
  const numero = '50432955554';
  const jid = numero + '@s.whatsapp.net';
  const nombre = await conn.getName(jid) || 'Deylin';
  const about = (await conn.fetchStatus(jid).catch(() => {}))?.status || 'Desarrollador del bot';

  const vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${nombre};;;
FN:${nombre}
TEL;waid=${numero}:+${numero}
NOTE:${about}
END:VCARD`.trim();

  await conn.sendMessage(m.chat, {
    contacts: {
      displayName: nombre,
      contacts: [{ vcard }]
    }
  }, { quoted: m });

  const info = `
*👤 Propietario Oficial del Bot*
━━━━━━━━━━━━━━━━━━━━
📛 *Nombre:* ${nombre}
🌐 *País:* Honduras 🇭🇳
📱 *Número:* wa.me/${numero}
💼 *Rol:* Creador y Desarrollador Principal
🧠 *Estado:* ${about}

_“No soy un héroe... solo soy un ninja que sigue su camino.”_
`.trim();

  await conn.sendMessage(m.chat, {
    text: info,
    contextInfo: {
      externalAdReply: {
        title: "👑 Naruto-Bot Oficial",
        body: "Contacto directo con el creador",
        thumbnailUrl: https://d.uguu.se/fYzeJFuN.jpg,
        sourceUrl: redes,
        mediaType: 1,
        renderLargerThumbnail: true,
        showAdAttribution: true
      }
    }
  }, { quoted: m });
};

handler.help = ['owner', 'creator'];
handler.tags = ['main'];
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;
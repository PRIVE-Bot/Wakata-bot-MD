// código creado por Deylin 
// https://github.com/deylinqff
// no quites créditos 

import PhoneNumber from 'awesome-phonenumber';

async function handler(m, { conn }) {
    const creadores = [
        { numero: '526641804242', nombre: 'Brayan' },
        { numero: '50488198573', nombre: 'Deylin' }
    ];

    for (const creador of creadores) {
        let numcreador = creador.numero;
        let ownerJid = numcreador + '@s.whatsapp.net';

        let name = await conn.getName(ownerJid) || creador.nombre;
        let about = (await conn.fetchStatus(ownerJid).catch(() => {}))?.status || 'Sin descripción';

        let vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${name};;;
FN:${name}
TEL;waid=${numcreador}:${new PhoneNumber('+' + numcreador).getNumber('international')}
NOTE:${about}
END:VCARD`.trim();

        await conn.sendMessage(m.chat, {
            contacts: {
                displayName: name,
                contacts: [{ vcard }]
            }
        }, { quoted: m });
    }
}

handler.help = ['owner']; 
handler.tags = ['main']; 
handler.command = ['owner', 'creator', 'creador', 'dueño'];

export default handler;
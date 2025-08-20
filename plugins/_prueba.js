export async function mododev(m, { conn }) {
    const numero = m.sender.split('@')[0];
    const isOwner = [conn.decodeJid(global.conn.user.id), ...global.owner.map(([number]) => number)]
                      .map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
                      .includes(m.sender) || m.fromMe;

    if (!isOwner) return; // solo owners pueden activar/desactivar

    if (m.text.toLowerCase() === '.mododev') {
        global.modoDevActivo = true;
        return conn.reply(m.chat, '✅ Modo desarrollador activado. Solo los developers pueden usar comandos ahora.', m);
    }

    if (m.text.toLowerCase() === '.unmododev') {
        global.modoDevActivo = false;
        return conn.reply(m.chat, '✅ Modo desarrollador desactivado. Todos los usuarios pueden usar comandos nuevamente.', m);
    }
}

mododev.command = ['mododev', 'unmododev'];
mododev.rowner = true; // solo para owners
export default mododev;
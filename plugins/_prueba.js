let handler = async (m, { conn }) => {
    const numero = m.sender.split('@')[0];
    const isOwner = [conn.decodeJid(global.conn.user.id), ...global.owner.map(([number]) => number)]
                        .map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
                        .includes(m.sender) || m.fromMe;

    // Si el modo dev está activo y no es owner, bloquea la ejecución de este plugin
    if (global.modoDevActivo && !isOwner) return true; // true cancela la ejecución del plugin
}

const handler = async (m, { conn }) => {
    if (!isOwner) return; // solo los developers pueden ejecutar estos comandos

    if (m.text.toLowerCase() === '.mododev') {
        global.modoDevActivo = true;
        return conn.reply(m.chat, '✅ Modo desarrollador activado.', m);
    }

    if (m.text.toLowerCase() === '.unmododev') {
        global.modoDevActivo = false;
        return conn.reply(m.chat, '✅ Modo desarrollador desactivado.', m);
    }
};

handler.command = ['mododev', 'unmododev'];
export default handler;
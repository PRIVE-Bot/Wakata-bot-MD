// plugins/mododev.js
let modoDevActivo = false; // estado inicial

export async function before(m, { conn }) {
    const numero = m.sender.split('@')[0];
    const isOwner = global.owner.some(o => o[0] === numero || o === numero);

    // Bloquear todo si modo dev está activo y el remitente NO es owner
    if (modoDevActivo && !isOwner) return true; // true cancela el mensaje para otros handlers
}

const handler = async (m, { conn }) => {
    const numero = m.sender.split('@')[0];
    const isOwner = global.owner.some(o => o[0] === numero || o === numero);

    if (!isOwner) return; // solo los developers pueden ejecutar estos comandos

    if (m.text.toLowerCase() === '.mododev') {
        modoDevActivo = true;
        return conn.reply(m.chat, '✅ Modo desarrollador activado.', m);
    }

    if (m.text.toLowerCase() === '.unmododev') {
        modoDevActivo = false;
        return conn.reply(m.chat, '✅ Modo desarrollador desactivado.', m);
    }
};

handler.command = ['mododev', 'unmododev'];
export default handler;
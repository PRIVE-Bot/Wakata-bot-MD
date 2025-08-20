
let modoDevActivo = false; 

const handler = async (m, { conn, args }) => {
    const numero = m.sender.split('@')[0]; 
    const isOwner = global.owner.some(o => o[0] === numero || o === numero);

    // Comando para activar el modo desarrollador
    if (m.text.toLowerCase() === '.mododev') {
        if (!isOwner) return conn.reply(m.chat, '❌ Solo los desarrolladores pueden activar esto.', m);
        modoDevActivo = true;
        return conn.reply(m.chat, '✅ Modo desarrollador activado. El bot solo responderá a los developers.', m);
    }

    
    if (m.text.toLowerCase() === '.unmododev') {
        if (!isOwner) return conn.reply(m.chat, '❌ Solo los desarrolladores pueden desactivar esto.', m);
        modoDevActivo = false;
        return conn.reply(m.chat, '✅ Modo desarrollador desactivado. El bot responde normalmente.', m);
    }

    
    if (modoDevActivo && !isOwner) {
        return; 
    }

    
};

handler.command = ['mododev', 'unmododev'];
export default handler;
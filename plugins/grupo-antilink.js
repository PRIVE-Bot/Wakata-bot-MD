let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i;
let linkRegex1 = /whatsapp.com\/channel\/([0-9A-Za-z]{20,24})/i;

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, participants }) {
    if (!m.isGroup) return;
    let chat = global.db.data.chats[m.chat];

    // Comandos para activar y desactivar antilink
    if (m.text === ".on antilink" && (isAdmin || isOwner || isROwner)) {
        chat.antiLink = true;
        return conn.sendMessage(m.chat, { text: "✅ *Antilink activado correctamente.*" }, { quoted: m });
    }
    if (m.text === ".off antilink" && (isAdmin || isOwner || isROwner)) {
        chat.antiLink = false;
        return conn.sendMessage(m.chat, { text: "❌ *Antilink desactivado correctamente.*" }, { quoted: m });
    }

    // Si el antilink está desactivado, no hacer nada
    if (!chat.antiLink) return;

    // Si el usuario es admin o el bot, no hacer nada
    if (isAdmin || isOwner || m.fromMe || isROwner) return;

    let delet = m.key.participant;
    let bang = m.key.id;
    const user = `@${m.sender.split`@`[0]}`;
    const groupAdmins = participants.filter(p => p.admin);
    const listAdmin = groupAdmins.map((v, i) => `*» ${i + 1}. @${v.id.split('@')[0]}*`).join('\n');
    let bot = global.db.data.settings[this.user.jid] || {};
    const isGroupLink = linkRegex.exec(m.text) || linkRegex1.exec(m.text);
    const grupo = `https://chat.whatsapp.com`;

    if (isAdmin && m.text.includes(grupo)) return m.reply(`🏷 *Hey!! El antilink está activo, pero eres admin, ¡salvado!*`);

    if (isGroupLink) {
        if (isBotAdmin) {
            const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`;
            if (m.text.includes(linkThisGroup)) return;
        }
        await conn.sendMessage(m.chat, { 
            text: `📎 *¡Enlace detectado!*\n\n*${await this.getName(m.sender)} —_— Mandaste un enlace prohibido, por lo cual serás eliminado.*`, 
            mentions: [m.sender] 
        }, { quoted: m });

        if (!isBotAdmin) {
            return conn.sendMessage(m.chat, { 
                text: `⚠️ *No soy admin, no puedo eliminar desobedientes.*`, 
                mentions: [...groupAdmins.map(v => v.id)] 
            }, { quoted: m });
        }

        // Eliminar mensaje y expulsar al usuario
        await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet } });
        let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
        if (responseb[0]?.status === "404") return;
    }

    return true;
}
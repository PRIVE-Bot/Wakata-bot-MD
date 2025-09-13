import { generateWAMessageFromContent } from '@whiskeysockets/baileys';
import fs from 'fs';

const welcomeSent = {};
const filePath = './src/database/sent_welcome.json';

if (fs.existsSync(filePath)) {
    Object.assign(welcomeSent, JSON.parse(fs.readFileSync(filePath, 'utf-8')));
}

function saveState() {
    fs.writeFileSync(filePath, JSON.stringify(welcomeSent, null, 2), 'utf-8');
}

export async function before(m, { conn }) {
    if (m.isBaileys && m.fromMe) return true;
    if (m.isGroup) return false;
    if (!m.message) return true;

    const user = m.sender;
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (welcomeSent[user] && (now - welcomeSent[user]) < oneDay) {
        return true;
    }

    const content = {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    body: { text: `👋 Hola @${user.split('@')[0]}!\n\n¿Presiona el botón? 🚀\n> ¡No tengas miedo!` },
                    footer: { text: "TE ESPERO" },
                    header: { title: "TOCA", hasMediaAttachment: false },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: "cta_url",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "👉🏻 TOCAME TOCAME 🫵🏻",
                                    url: `https://wa.me/?text=*🔥+HOLA+ÚNETE+ENTRA!+YA+AL+CANAL+PARA+NO+PERDERTE+DE+AVISS+Y+ACTUALIZACIONES:*+https://whatsapp.com/channel/0029VbAzn9GGU3BQw830eA0F?mode=_Developed_by_Deylin`,
                                    merchant_url: "https://wa.me"
                                })
                            }
                        ]
                    }
                }
            }
        }
    };

    const msg = generateWAMessageFromContent(m.chat, content, { quoted: m });
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id }, {mentions: [m.sender]});

    welcomeSent[user] = now;
    saveState();

    return true;
}

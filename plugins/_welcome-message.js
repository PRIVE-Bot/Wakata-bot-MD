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
                    body: { text: `👋 Hola @${user.split('@')[0]}!\n\n¿Te presiona el botón? 🚀\n> ¡No tengas miedo!` },
                    footer: { text: "
TE ESPERO" },
                    header: { title: "TOCA", hasMediaAttachment: false },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: "cta_url",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "👉🏻 TOCAME TOCAME 🫵🏻",
                                    url: `https://wa.me/?text=🔥+HOLA+ÚNETE+ENTRA!+YA+AL+GRUPO:+https://chat.whatsapp.com/HuMh41LJftl4DH7G5MWcHP?mode=_Developed_by_Deylin`,
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
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    welcomeSent[user] = now;
    saveState();

    return true;
}

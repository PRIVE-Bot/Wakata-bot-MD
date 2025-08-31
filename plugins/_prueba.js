import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { conn }) => {
    const user = m.sender;

    const content = {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    body: { text: `No tengas miedo y presiona el botón y selecciona tus grupos.` },
                    footer: { text: "sin miedo al éxito" },
                    header: { title: "Ándale", hasMediaAttachment: false },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: "cta_url",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "Tocame y mira lo que pasa.",
                                    url: `https://wa.me/?text=🔥+Prueba+SPARK-BOT+ahora!+Entra+al+grupo:+https://chat.whatsapp.com/HuMh41LJftl4DH7G5MWcHP`,
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

    //m.reply("✅ Mensaje enviado.");
};

handler.command = ['1'];

export default handler;
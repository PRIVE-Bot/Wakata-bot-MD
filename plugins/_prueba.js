import { generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { conn }) => {
  const canal = "120363403593951965@newsletter"; // tu canal

  try {
    const content = {
      interactiveMessage: {
        body: { 
          text: `👋 Hola!\n\n¿Te gusta Spark-Bot? 🚀\n¡Compártelo con tus amigos!` 
        },
        footer: { 
          text: "SPARK-BOT Official ©" 
        },
        header: { 
          title: "🔥 SPARK-BOT 🔥", 
          hasMediaAttachment: false 
        },
        nativeFlowMessage: {
          buttons: [
            {
              name: "cta_copy",
              buttonParamsJson: JSON.stringify({
                display_text: "📋 Copiar mensaje",
                copy_code: "🔥 Prueba SPARK-BOT ahora! Entra al grupo: https://chat.whatsapp.com/HuMh41LJftl4DH7G5MWcHP"
              })
            }
          ]
        }
      }
    };

    const msg = generateWAMessageFromContent(canal, content, {});
    await conn.relayMessage(canal, msg.message, { messageId: msg.key.id });

    m.reply("✅ Mensaje con botón de copiar enviado al canal.");
  } catch (e) {
    console.error("Error al enviar al canal:", e);
    m.reply(`❌ Error: ${e.message}`);
  }
};

handler.command = /^canalcopy$/i;
export default handler;
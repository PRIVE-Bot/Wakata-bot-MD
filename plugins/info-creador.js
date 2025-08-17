// Código creado por Deylin
// https://github.com/Deylin-eliac 
// codigo creado para https://github.com/Deylin-eliac
// No quites créditos

import axios from 'axios'
const { generateWAMessageContent, generateWAMessageFromContent, proto } = (await import('@whiskeysockets/baileys')).default

let handler = async (m, { conn }) => {
  const proses = `*Obteniendo información de mi creador...*`
  await conn.sendMessage(m.chat, { text: proses }, { quoted: m })

  async function createButtonMessage(image, text, buttons) {
    const buttonList = buttons.map((btn, index) => ({
      name: 'quick_reply',
      buttonParamsJson: JSON.stringify({
        display_text: btn.name,
        id: `link_${index}`
      })
    }));

    const messageContent = {
      imageMessage: await generateWAMessageContent({ image: { url: image } }, { upload: conn.waUploadToServer }).imageMessage,
      interactiveMessage: {
        body: proto.Message.InteractiveMessage.Body.fromObject({ text }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: "Toca el botón para ver más" }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          hasMediaAttachment: true,
          imageMessage: await generateWAMessageContent({ image: { url: image } }, { upload: conn.waUploadToServer }).imageMessage
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
          buttons: buttonList
        })
      }
    };
    
    return messageContent;
  }

  const owners = [
    {
      name: 'Deylin',
      desc: '👑 Creador Principal de Naruto-MD',
      image: 'https://files.catbox.moe/51epch.jpg',
      buttons: [
        { name: 'Ver enlaces de Deylin' }
      ]
    },
    {
      name: '𝑪𝒉𝒐𝒍𝒊𝒕𝒐-𝑿𝒚𝒛⁩',
      desc: '🌀 Co-creador y tester oficial',
      image: 'https://files.catbox.moe/29tejb.jpg',
      buttons: [
        { name: 'Ver enlaces de Cholito' }
      ]
    },
    {
      name: 'davi zuni 17⁩',
      desc: '⚡ Colaborador y desarrollador base',
      image: 'https://files.catbox.moe/dign93.jpg',
      buttons: [
        { name: 'Ver enlaces de Davi' }
      ]
    }
  ];

  for (let owner of owners) {
    const message = await createButtonMessage(
      owner.image,
      `*${owner.name}*\n${owner.desc}`,
      owner.buttons
    );

    const generatedMessage = generateWAMessageFromContent(m.chat, message, { quoted: m });
    await conn.relayMessage(m.chat, generatedMessage.message, { messageId: generatedMessage.key.id });
  }

  // Nota: La respuesta al botón debe ser manejada por otra parte del código del bot
}

handler.tags = ['main']
handler.command = handler.help = ['donar', 'owner', 'cuentasoficiales', 'creador', 'cuentas']

export default handler

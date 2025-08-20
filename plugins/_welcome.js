/*import { WAMessageStubType } from '@whiskeysockets/baileys';
import fetch from 'node-fetch';

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true;

  let totalMembers = participants.length;
  let date = new Date().toLocaleString('es-ES', { timeZone: 'America/Mexico_City' });
  let who = m.messageStubParameters[0];
  let taguser = `@${who.split('@')[0]}`;
  let chat = global.db.data.chats[m.chat];
  let botname = global.botname || "Bot";

  
  const res1 = await fetch('https://files.catbox.moe/qhxt7c.png');
  const img1 = Buffer.from(await res1.arrayBuffer());

  const fkontak = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
      productMessage: {
        product: {
          productImage: { jpegThumbnail: img1 },
          title: `ʙɪᴇɴᴠᴇɴɪᴅᴏ, ᴀʜᴏʀᴀ sᴏᴍᴏs "${totalMembers}"`,
          description: botname,
          currencyCode: "USD",
          priceAmount1000: "5000",
          retailerId: "BOT"
        },
        businessOwnerJid: "0@s.whatsapp.net"
      }
    }
  };

  const res2 = await fetch('https://files.catbox.moe/8alfhv.png');
  const img2 = Buffer.from(await res2.arrayBuffer());

  const fkontak1 = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
      productMessage: {
        product: {
          productImage: { jpegThumbnail: img2 },
          title: `₳ĐłØ₴ Ʉ₴ɆⱤ ₳ⱧØⱤ₳ ₴Ø₥Ø₴ "${totalMembers}"`,
          description: botname,
          currencyCode: "USD",
          priceAmount1000: "5000",
          retailerId: "BOT"
        },
        businessOwnerJid: "0@s.whatsapp.net"
      }
    }
  };

  let imageUrl =  'https://files.catbox.moe/0183v7.png';

  if (chat.welcome) {
    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      let bienvenida = `
┏╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⚁
┃   ฿łɆ₦VɆ₦łĐØ ✦ ₳
┣╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⚄
┃ 
┃  ✎ *Usuario:* ${taguser}  
┃  ✎ *Grupo:* ${groupMetadata.subject}  
┃  ✎ *Miembros:* ${totalMembers}  
┃  ✎ *Fecha:* ${date}  
┃    
┗╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⚁


> *sɪɢᴜᴇ ᴇʟ ᴄᴀɴᴀʟ ᴏғɪᴄɪᴀʟ:*
> whatsapp.com/channel/0029VbAzn9GGU3BQw830eA0F`;
      await conn.sendMessage(m.chat, { image: { url: imageUrl }, caption: bienvenida, mentions: [who] }, { quoted: fkontak });
    }

    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE ||
        m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE) {
      let despedida = `
┏╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⚁
┃             ₳ĐłØ₴ ✦ ₳
┣╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⚄
┃ 
┃  ✎ *Usuario:* ${taguser}  
┃  ✎ *Grupo:* ${groupMetadata.subject}  
┃  ✎ *Miembros:* ${totalMembers}  
┃  ✎ *Fecha:* ${date}  
┃    
┗╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⚁


> *sɪɢᴜᴇ ᴇʟ ᴄᴀɴᴀʟ ᴏғɪᴄɪᴀʟ:*
> whatsapp.com/channel/0029VbAzn9GGU3BQw830eA0F`;
      await conn.sendMessage(m.chat, { image: { url: imageUrl }, caption: despedida, mentions: [who] }, { quoted: fkontak1 });
    }
  }
}*/


import { wamessagestubtype } from 'whiskeysockets/baileys';
import fetch from 'node-fetch';
import Jimp from 'jimp';

export async function before(m, { conn, participants, groupmetadata }) {
 if (!m.messagestubtype || !m.isgroup) return true;

 let totalmembers = participants.length;
 let date = new Date().toLocaleString('es-ES', { timeZone: 'America/Mexico_City' });
 let who = m.messagestubparameters ? m.messagestubparameters.find(param => param.endsWith('@s.whatsapp.net')) : '';
 let taguser = who ? `@${who.split('@')[0]}` : '';
 let chat = global.db.data.chats ? global.db.data.chats [m.chat] : {};
 let botname = global.botname || "bot";

 // imágenes para contactos simulados
 const res1 = await fetch('https://files.catbox.moe/qhxt7c.png');
 const img1 = Buffer.from(await res1.arraybuffer());

 const fkontak = {
  key: { fromMe: false, participant: "0@s.whatsapp.net" },
  message: {
   productMessage: {
    product: {
     productImage: { jpegThumbnail: img1 },
     title: `ʙɪᴇɴᴠᴇɴɪᴅᴏ, ᴀʜᴏʀᴀ sᴏᴍᴏs ${totalmembers + 1}`,
     description: botname,
     currencyCode: "USD",
     priceAmount1000: "5000",
     retailerId: "bot"
    },
    businessOwnerJid: "0@s.whatsapp.net"
   }
  }
 };

 const res2 = await fetch('https://files.catbox.moe/8alfhv.png');
 const img2 = Buffer.from(await res2.arraybuffer());

 const fkontak1 = {
  key: { fromMe: false, participant: "0@s.whatsapp.net" },
  message: {
   productMessage: {
    product: {
     productImage: { jpegThumbnail: img2 },
     title: `₳ĐłØ₴ Ʉ₴ɆⱤ ₳ⱧØⱤ₳ ₴Ø₥Ø₴ ${totalmembers - 1}`,
     description: botname,
     currencyCode: "USD",
     priceAmount1000: "5000",
     retailerId: "bot"
    },
    businessOwnerJid: "0@s.whatsapp.net"
   }
  }
 };

 let defaultWelcomeBg = 'https://files.catbox.moe/8alfhv.png'; // URL de fondo por defecto

 async function generateWelcomeImage(background, avatar, text1, text2, text3) {
  try {
   const bgBuffer = await fetch(background).then(res => res.buffer());
   const avatarBuffer = await fetch(avatar).then(res => res.buffer());
   const bgImage = await Jimp.read(bgBuffer);
   const avatarImage = await Jimp.read(avatarBuffer);
   avatarImage.resize(200, 200);
   const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
   const fontSmall = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
   const x = (bgImage.getWidth() / 2) - (avatarImage.getWidth() / 2);
   const y = 300;
   bgImage.composite(avatarImage, x, y);
   const text1Width = Jimp.measureText(font, text1);
   const text2Width = Jimp.measureText(fontSmall, text2);
   const text3Width = Jimp.measureText(fontSmall, text3);
   const text1X = (bgImage.getWidth() / 2) - (text1Width / 2);
   const text2X = (bgImage.getWidth() / 2) - (text2Width / 2);
   const text3X = (bgImage.getWidth() / 2) - (text3Width / 2);
   bgImage.print(font, text1X, 100, text1);
   bgImage.print(fontSmall, text2X, 550, text2);
   bgImage.print(fontSmall, text3X, 600, text3);
   return await bgImage.getBufferAsync(Jimp.MIME_PNG);
  } catch (error) {
   console.error('Error al generar la imagen:', error);
   return null;
  }
 }

 if (chat?.welcome) {
  if (m.messagestubtype === wamessagestubtype.group_participant_add) {
   let who = m.messagestubparameters ? m.messagestubparameters.find(param => param.endsWith('@s.whatsapp.net')) : '';
   if (!who) return;
   let profilePicture = 'https://files.catbox.moe/0183v7.png'; // Imagen por defecto si falla
   try {
    profilePicture = await conn.profilePictureUrl(who, 'image');
   } catch (error) {
    console.error('No se pudo obtener la foto de perfil:', error);
   }

   const welcomeImageBuffer = await generateWelcomeImage(
    defaultWelcomeBg, // Puedes personalizar esto por grupo si lo deseas
    profilePicture,
    `¡Hola ${taguser}! 👋`,
    `Bienvenido a ${groupmetadata.subject}`,
    `Miembro ${totalmembers + 1}`
   );

   if (welcomeImageBuffer) {
    await conn.sendMessage(m.chat, {
     image: welcomeImageBuffer,
     caption: `
┏╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⚁
┃   ฿łɆ₦vɆ₦łĐØ ✦ ₳
┣╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⚄
┃
┃  ✎ *usuario:* ${taguser}
┃  ✎ *grupo:* ${groupmetadata.subject}
┃  ✎ *miembros:* ${totalmembers + 1}
┃  ✎ *fecha:* ${date}
┃
┗╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⚁


> *sɪɢᴜᴇ ᴇʟ ᴄᴀɴᴀʟ ᴏғɪᴄɪᴀʟ:*
> whatsapp.com/channel/0029vbazn9ggu3bqw830ea0f`
    }, { quoted: fkontak });
   } else {
    // Enviar un mensaje de bienvenida de texto si falla la generación de la imagen
    let bienvenida = `
┏╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⚁
┃   ฿łɆ₦vɆ₦łĐØ ✦ ₳
┣╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⚄
┃
┃  ✎ *usuario:* ${taguser}
┃  ✎ *grupo:* ${groupmetadata.subject}
┃  ✎ *miembros:* ${totalmembers + 1}
┃  ✎ *fecha:* ${date}
┃
┗╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⚁


> *sɪɢᴜᴇ ᴇʟ ᴄᴀɴᴀʟ ᴏғɪᴄɪᴀʟ:*
> whatsapp.com/channel/0029vbazn9ggu3bqw830ea0f`;
    await conn.sendMessage(m.chat, { text: bienvenida, mentions: [who] }, { quoted: fkontak });
   }
  }

  // La lógica para el mensaje de despedida se mantiene igual por ahora
  if (m.messagestubtype === wamessagestubtype.group_participant_leave ||
   m.messagestubtype === wamessagestubtype.group_participant_remove) {
   let who = m.messagestubparameters ? m.messagestubparameters.find(param => param.endsWith('@s.whatsapp.net')) : '';
   let despedida = `
┏╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⚁
┃             ₳ĐłØ₴ ✦ ₳
┣╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⚄
┃
┃  ✎ *usuario:* ${taguser}
┃  ✎ *grupo:* ${groupmetadata.subject}
┃  ✎ *miembros:* ${totalmembers - 1}
┃  ✎ *fecha:* ${date}
┃
┗╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⚁


> *sɪɢᴜᴇ ᴇʟ ᴄᴀɴᴀʟ ᴏғɪᴄɪᴀʟ:*
> whatsapp.com/channel/0029vbazn9ggu3bqw830ea0f`;
   await conn.sendMessage(m.chat, { image: { url: 'https://files.catbox.moe/0183v7.png' }, caption: despedida, mentions: [who] }, { quoted: fkontak1 });
  }
 }
}

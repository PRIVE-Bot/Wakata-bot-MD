import { WAMessageStubType } from '@whiskeysockets/baileys';
import fetch from 'node-fetch';

export async function before(m, { conn, participants, groupMetadata }) {
    if (!m.messageStubType || !m.isGroup) return true;

    const totalMembers = participants.length;
    const who = m.messageStubParameters[0];
    const taguser = `@${who.split('@')[0]}`;
    const chat = global.db.data.chats[m.chat];
    const botname = global.botname || "Bot";

    // Configura aquí tu número WhatsApp Business y productId reales
    const businessOwnerJid = "50433191934@s.whatsapp.net"; // tu número Business
    const productIdAdd = "24502048122733040"; // ID del producto para bienvenida
    const productIdLeave = "24502048122733041"; // ID del producto para despedida

    // Imagen de portada del catálogo (puede ser URL)
    const icono = "https://files.catbox.moe/oa0hg3.jpg";
    const res = await fetch(icono);
    const buffer = Buffer.from(await res.arrayBuffer());

    if (!chat.welcome) return true;

    // 🚪 Bienvenida
    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
        const productMessage = {
            product: {
                productImage: { url: buffer },
                title: `¡Bienvenido a ${groupMetadata.subject}!`,
                description: `Hola ${taguser}, ahora somos ${totalMembers} miembros.`,
                currencyCode: "USD",
                priceAmount1000: 5000,
                retailerId: "BOT",
                productId: productIdAdd,
                productImageCount: 1
            },
            businessOwnerJid
        };
        await conn.sendMessage(m.chat, productMessage, { messageType: 'product' });
    }

    // 👋 Despedida
    if (
        m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE ||
        m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE
    ) {
        const productMessage = {
            product: {
                productImage: { url: buffer },
                title: `¡Adiós de ${groupMetadata.subject}!`,
                description: `Hasta luego ${taguser}, ahora somos ${totalMembers} miembros.`,
                currencyCode: "USD",
                priceAmount1000: 5000,
                retailerId: "BOT",
                productId: productIdLeave,
                productImageCount: 1
            },
            businessOwnerJid
        };
        await conn.sendMessage(m.chat, productMessage, { messageType: 'product' });
    }
}






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

  const fondoUrl = encodeURIComponent('https://files.catbox.moe/ijud3n.jpg');
  const defaultAvatar = encodeURIComponent('https://files.catbox.moe/6al8um.jpg');

  let avatarUrl = defaultAvatar;
  try {
    const userProfilePic = await conn.profilePictureUrl(who, 'image');
    avatarUrl = encodeURIComponent(userProfilePic);
  } catch (e) {
    avatarUrl = defaultAvatar; 
  }

  if (chat.welcome) {
    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      const canvasUrl = `https://gokublack.xyz/canvas/welcome?background=${fondoUrl}&text1=Hola+${taguser.replace('@','')}&text2=Bienvenido&text3=Miembro+${totalMembers}&avatar=${avatarUrl}`;

        const res2 = await fetch('https://files.catbox.moe/qhxt7c.png');
      const img2 = Buffer.from(await res2.arrayBuffer());
const res = await fetch(canvasUrl);
      const img = Buffer.from(await res.arrayBuffer());

      const fkontak = {
        key: { fromMe: false, participant: "0@s.whatsapp.net" },
        message: {
          productMessage: {
            product: {
              productImage: { jpegThumbnail: img3 },
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

      await conn.sendMessage(m.chat, { image: img, caption: bienvenida, mentions: [who] }, { quoted: fkontak });
    }

    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE ||
        m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE) {

      const canvasUrl = `https://gokublack.xyz/canvas/welcome?background=${fondoUrl}&text1=Adiós+${taguser.replace('@','')}&text2=Hasta+Luego&text3=Miembro+${totalMembers}&avatar=${avatarUrl}`;

      const res1 = await fetch('https://files.catbox.moe/8alfhv.png');
      const img3 = Buffer.from(await res1.arrayBuffer());
const res = await fetch(canvasUrl);
      const img = Buffer.from(await res.arrayBuffer());


      const fkontak1 = {
        key: { fromMe: false, participant: "0@s.whatsapp.net" },
        message: {
          productMessage: {
            product: {
              productImage: { jpegThumbnail: img3 },
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

      await conn.sendMessage(m.chat, { image: img, caption: despedida, mentions: [who] }, { quoted: fkontak1 });
    }
  }
}*/



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
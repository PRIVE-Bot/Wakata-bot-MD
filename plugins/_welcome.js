import { WAMessageStubType } from '@whiskeysockets/baileys';
import fetch from 'node-fetch';

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true;

  let totalMembers = participants.length;
  let date = new Date().toLocaleString('es-ES', { timeZone: 'America/Mexico_City' });
  let who = m.messageStubParameters[0];
  let taguser = `@${who.split('@')[0]}`;
  let chat = global.db.data.chats[m.chat];
  let botname = global.botname || "Bot";

  const fondoUrl = encodeURIComponent('https://files.catbox.moe/xdz07l.jpg');
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

      const res = await fetch(canvasUrl);
      const img = Buffer.from(await res.arrayBuffer());

      const fkontak = {
        key: { fromMe: false, participant: "0@s.whatsapp.net" },
        message: {
          productMessage: {
            product: {
              productImage: { jpegThumbnail: img },
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

      const res = await fetch(canvasUrl);
      const img = Buffer.from(await res.arrayBuffer());

      const fkontak1 = {
        key: { fromMe: false, participant: "0@s.whatsapp.net" },
        message: {
          productMessage: {
            product: {
              productImage: { jpegThumbnail: img },
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
}
import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

async function getBuffer(url) {
  try {
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`Error al descargar la imagen: ${res.statusText}`)
    }
    return Buffer.from(await res.arrayBuffer())
  } catch (e) {
    console.error(`Error en getBuffer para URL ${url}:`, e)
    return null // Retorna null en caso de error
  }
}

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.isGroup) return true

  const chat = global.db.data.chats[m.chat]
  if (!chat.welcome) return true

  if (!m.messageStubType || !m.messageStubParameters || !m.messageStubParameters[0]) return true

  const totalMembers = participants.length
  const date = new Date().toLocaleString('es-ES', { timeZone: 'America/Mexico_City' })
  const who = m.messageStubParameters[0]
  const taguser = `@${(who || '').split('@')[0]}`
  const botname = global.botname || "Bot"

  let tipo = ''
  let tipo1 = ''
  let tipo2 = global.img || "https://i.postimg.cc/c4t9wwCw/1756162596829.jpg"

  if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    tipo = 'Bienvenido'
    tipo1 = 'al grupo'
  }

  if ([WAMessageStubType.GROUP_PARTICIPANT_LEAVE, WAMessageStubType.GROUP_PARTICIPANT_REMOVE].includes(m.messageStubType)) {
    tipo = 'Adiós'
    tipo1 = 'del grupo'
  }

  if (!tipo) return true

  let fkontak
  try {
    const img3Buffer = await getBuffer("https://i.postimg.cc/c4t9wwCw/1756162596829.jpg")
    if (img3Buffer) {
      fkontak = {
        key: { fromMe: false, participant: "0@s.whatsapp.net" },
        message: {
          productMessage: {
            product: {
              productImage: { jpegThumbnail: img3Buffer },
              title: `${tipo} ${tipo1}`,
              description: `${botname} da la bienvenida a ${taguser}`,
              currencyCode: "USD",
              priceAmount1000: 5000,
              retailerId: "BOT"
            },
            businessOwnerJid: "0@s.whatsapp.net"
          }
        }
      }
    } else {
      console.error("No se pudo obtener la imagen para fkontak. El mensaje se enviará sin esta parte.")
    }
  } catch (e) {
    console.error("Error al generar fkontak:", e)
  }

  const imageBuffer = await getBuffer(tipo2)
  if (!imageBuffer) {
    console.error("Error: No se pudo obtener la imagen principal (tipo2). No se puede enviar el mensaje de bienvenida/despedida.")
    return false // Detiene la ejecución si la imagen principal no se puede obtener
  }

  const productMessage = {
    productMessage: {
      product: {
        productImage: global.img, 
        title: `${tipo}, ahora somos ${totalMembers}`,
        description: `
✎ Usuario: ${taguser}
✎ Grupo: ${groupMetadata.subject}
✎ Miembros: ${totalMembers}
✎ Fecha: ${date}
        `.trim(),
        currencyCode: "USD",
        priceAmount1000: 5000,
        retailerId: "1677",
        productId: "24628293543463627"
      },
      businessOwnerJid: "50432955554@s.whatsapp.net"
    }
  }

  await conn.sendMessage(m.chat, productMessage, { 
    quoted: fkontak,
    contextInfo: { mentionedJid: [who] }
  })
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
      const canvasUrl = `https://gokublack.xyz/canvas/welcome?background=${fondoUrl}&text1=Hola+user&text2=Bienvenido&text3=Miembro+${totalMembers}&avatar=${avatarUrl}`;

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

      const canvasUrl = `https://gokublack.xyz/canvas/welcome?background=${fondoUrl}&text1=Adiós+del+grupo&text2=Hasta+Luego&text3=Miembro+${totalMembers}&avatar=${avatarUrl}`;

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
import { WAMessageStubType } from '@whiskeysockets/baileys'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;

const res = await fetch('https://files.catbox.moe/qhxt7c.png');
const img = Buffer.from(await res.arrayBuffer());

const fkontak = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
        productMessage: {
            product: {
                productImage: { jpegThumbnail: img },
                title: `ʙɪᴇɴᴠᴇɴɪᴅᴏ, ᴀʜᴏʀᴀ sᴏᴍᴏs ${totalMembers + 1}`,
                description: botname ,
                currencyCode: "USD",
                priceAmount1000: "5000", 
                retailerId: "BOT"
            },
            businessOwnerJid: "0@s.whatsapp.net"
        }
    }
};

const res = await fetch('https://files.catbox.moe/8alfhv.png');
const img = Buffer.from(await res.arrayBuffer());

const fkontak1 = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
        productMessage: {
            product: {
                productImage: { jpegThumbnail: img },
                title: `₳ĐłØ₴ Ʉ₴ɆⱤ ₳ⱧØⱤ₳ ₴Ø₥Ø₴ ${totalMembers - 1}`,
                description: botname ,
                currencyCode: "USD",
                priceAmount1000: "5000", 
                retailerId: "BOT"
            },
            businessOwnerJid: "0@s.whatsapp.net"
        }
    }
};


  let who = m.messageStubParameters[0]
  let taguser = `@${who.split('@')[0]}`
  let chat = global.db.data.chats[m.chat]
  let totalMembers = participants.length
  let date = new Date().toLocaleString('es-ES', { timeZone: 'America/Mexico_City' })

  

  let imageUrl = 'https://files.catbox.moe/0183v7.png'

  if (chat.welcome) {
    if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
      let bienvenida = `
┏╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⚁
┃   ฿łɆ₦VɆ₦łĐØ ✦ ₳
┣╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⚄
┃ 
┃  ✎ *Usuario:* ${taguser}  
┃  ✎ *Grupo:* ${groupMetadata.subject}  
┃  ✎ *Miembros:* ${totalMembers + 1}  
┃  ✎ *Fecha:* ${date}  
┃    
┗╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⚁


> *sɪɢᴜᴇ ᴇʟ ᴄᴀɴᴀʟ ᴏғɪᴄɪᴀʟ:*
> whatsapp.com/channel/0029VbAzn9GGU3BQw830eA0F` 
      await conn.sendMessage(m.chat, { image: { url: imageUrl }, caption: bienvenida, mentions: [who], { quoted: fkontak } })
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
┃  ✎ *Miembros:* ${totalMembers - 1}  
┃  ✎ *Fecha:* ${date}  
┃    
┗╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍⚁


> *sɪɢᴜᴇ ᴇʟ ᴄᴀɴᴀʟ ᴏғɪᴄɪᴀʟ:*
> whatsapp.com/channel/0029VbAzn9GGU3BQw830eA0F` 
      await conn.sendMessage(m.chat, { image: { url: imageUrl }, caption: despedida, mentions: [who], { quoted: fkontak1 } })
    }
  }
}
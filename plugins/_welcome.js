/*import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  let botSettings = global.db.data.settings[conn.user.jid] || {}
  if (botSettings.soloParaJid) return
  if (!m.messageStubType || !m.isGroup) return true

 
  const totalMembers = participants.length
  const date = new Date().toLocaleString('es-ES', { timeZone: 'America/Mexico_City' })
  const who = m.messageStubParameters[0]
  const taguser = `@${who.split('@')[0]}`
  const chat = global.db.data.chats[m.chat]
  const botname = global.botname || "Bot"

  if (!chat.welcome) return

  let tipo = ''
  let tipo1 = ''
  let tipo2 = ''

  if (m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    tipo = 'Bienvenido'
    tipo1 = `al grupo: ${groupMetadata.subject}`
    tipo2 = global.img
  }

  if (
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_LEAVE ||
    m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_REMOVE
  ) {
    tipo = 'Adiós'
    tipo1 = `del grupo: ${groupMetadata.subject}`
    tipo2 = global.img
  }

  if (!tipo) return

let avatar = await conn.profilePictureUrl(who).catch(() => tipo2)
let urlapi = `https://canvas-8zhi.onrender.com/api/welcome2?title=${encodeURIComponent(tipo)}&desc=${encodeURIComponent(tipo1)}&profile=${encodeURIComponent(avatar)}&background=${encodeURIComponent(tipo2)}`

  let fkontak
  try {
    const res2 = await fetch('https://i.postimg.cc/c4t9wwCw/1756162596829.jpg')
    const img3 = Buffer.from(await res2.arrayBuffer())

    fkontak = {
      key: { fromMe: false, participant: "0@s.whatsapp.net" },
      message: {
        productMessage: {
          product: {
            productImage: { jpegThumbnail: img3 },
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
  } catch (e) {
    console.error("Error al generar fkontak:", e)
  }

  const productMessage = {
    product: {
      productImage: { url: urlapi },
      title: `${tipo}, ahora somos ${totalMembers}`,
      description: `
✎ Usuario: ${taguser}
✎ Grupo: ${groupMetadata.subject}
✎ Miembros: ${totalMembers}
✎ Fecha: ${date}
      `,
      currencyCode: "USD",
      priceAmount1000: 5000,
      retailerId: "1677",
      productId: "24526030470358430",
      productImageCount: 1,
    },
    businessOwnerJid: "50432955554@s.whatsapp.net"
  }

  await conn.sendMessage(m.chat, productMessage, {
    quoted: fkontak,
    contextInfo: { mentionedJid: [who] }
  })
}

*/


/*
██████╗░██╗░░░██╗███████╗███████╗
██╔══██╗╚██╗░██╔╝╚════██║██╔════╝
██████╔╝░╚████╔╝░░░███╔═╝█████╗░░
██╔══██╗░░╚██╔╝░░██╔══╝░░██╔══╝░░
██║░░██║░░░██║░░░███████╗███████╗
╚═╝░░╚═╝░░░╚═╝░░░╚══════╝╚══════╝
*/
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createCanvas, loadImage } from '@napi-rs/canvas'
import { jidNormalizedUser } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function ensureDir(p) { try { fs.mkdirSync(p, { recursive: true }) } catch {} }

async function loadImageSmart(src) {
  if (!src) return null
  try {
    if (/^https?:\/\//i.test(src)) {
      const res = await fetch(src)
      if (!res.ok) throw new Error('fetch fail')
      const buf = Buffer.from(await res.arrayBuffer())
      return await loadImage(buf)
    }
    return await loadImage(src)
  } catch { return null }
}

export async function makeCard({ title = 'Bienvenida', subtitle = '', avatarUrl = '', bgUrl = '', badgeUrl = '' }) {
  const width = 900, height = 380
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  const radius = 30
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#06141f')
  gradient.addColorStop(1, '#0b2a3b')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  ctx.lineWidth = 12
  ctx.strokeStyle = '#19c3ff'
  ctx.strokeRect(6, 6, width - 12, height - 12)

  if (bgUrl) {
    try {
      const bg = await loadImageSmart(bgUrl)
      const pad = 18
      ctx.globalAlpha = 0.9
      if (bg) ctx.drawImage(bg, pad, pad, width - pad * 2, height - pad * 2)
      ctx.globalAlpha = 1
      ctx.fillStyle = 'rgba(0,0,0,0.35)'
      ctx.fillRect(pad, pad, width - pad * 2, height - pad * 2)
    } catch {}
  }

  let avatarUsedInCenter = false
  let centerR = 54
  let centerCX = Math.round(width / 2)
  let centerCY = 86
  try {
    const useCenterAvatar = !badgeUrl && !!avatarUrl
    centerR = useCenterAvatar ? 80 : 54
    centerCY = useCenterAvatar ? Math.round(height / 2) : 86
    const centerSrc = (badgeUrl && badgeUrl.trim()) ? badgeUrl : (avatarUrl || '')
    if (centerSrc) {
      const badge = await loadImageSmart(centerSrc)
      ctx.save()
      ctx.beginPath(); ctx.arc(centerCX, centerCY, centerR, 0, Math.PI * 2); ctx.closePath(); ctx.clip()
      if (badge) ctx.drawImage(badge, centerCX - centerR, centerCY - centerR, centerR * 2, centerR * 2)
      ctx.restore()
      ctx.lineWidth = 6
      ctx.strokeStyle = '#19c3ff'
      ctx.beginPath(); ctx.arc(centerCX, centerCY, centerR + 4, 0, Math.PI * 2); ctx.stroke()
      avatarUsedInCenter = useCenterAvatar
    }
  } catch {}

  ctx.textAlign = 'center'
  ctx.fillStyle = '#ffffff'
  ctx.shadowColor = '#000000'
  ctx.shadowBlur = 8
  ctx.font = 'bold 48px Sans'
  const titleY = avatarUsedInCenter ? 70 : 178
  ctx.fillText(title, width / 2, titleY)
  ctx.shadowBlur = 0

  ctx.fillStyle = '#d8e1e8'
  ctx.font = '28px Sans'
  const lines = Array.isArray(subtitle) ? subtitle : [subtitle]
  const subBaseY = avatarUsedInCenter ? (centerCY + centerR + 28) : 218
  lines.forEach((t, i) => ctx.fillText(String(t || ''), width / 2, subBaseY + i * 34))

  if (avatarUrl && !avatarUsedInCenter) {
    try {
      const av = await loadImageSmart(avatarUrl)
      const r = 64
      const x = width - 120, y = height - 120
      ctx.save()
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.closePath(); ctx.clip()
      if (av) ctx.drawImage(av, x - r, y - r, r * 2, r * 2)
      ctx.restore()
      ctx.lineWidth = 5
      ctx.strokeStyle = '#19c3ff'
      ctx.beginPath(); ctx.arc(x, y, r + 3, 0, Math.PI * 2); ctx.stroke()
    } catch {}
  }

  return canvas.toBuffer('image/png')
}

export async function sendWelcomeOrBye(conn, { jid, userName = 'Usuario', type = 'welcome', groupName = '', participant }) {
  const tmp = path.join(__dirname, '../temp')
  ensureDir(tmp)
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
  const normalizeNumberFromJid = (jidOrNum = '') => {
    const raw = String(jidOrNum || '')
    const justJid = raw.includes('@') ? raw.split('@')[0] : raw
    const justNoSuffix = justJid.split(':')[0]
    const onlyDigits = justNoSuffix.replace(/\D+/g, '')
    return onlyDigits
  }
  const BG_IMAGES = [
    'https://iili.io/KIShsKx.md.jpg',
    'https://iili.io/KIShLcQ.md.jpg',
    'https://iili.io/KISwzI1.md.jpg',
    'https://iili.io/KIShPPj.md.jpg',
    'https://iili.io/KISwREJ.md.jpg',
    'https://iili.io/KISw5rv.md.jpg',
    'https://iili.io/KISwY2R.md.jpg',
    'https://iili.io/KISwa7p.md.jpg',
    'https://iili.io/KISwlpI.md.jpg',
    'https://iili.io/KISw1It.md.jpg',
    'https://iili.io/KISwEhX.md.jpg',
    'https://iili.io/KISwGQn.md.jpg',
    'https://iili.io/KISwVBs.md.jpg',
    'https://iili.io/KISwWEG.md.jpg',
    'https://iili.io/KISwX4f.md.jpg'
  ]
  const WELCOME_TITLES = ['Bienvenido', 'Bienvenida', '¡Bienvenid@!', 'Saludos', '¡Hola!', 'Llegada', 'Nuevo miembro', 'Bienvenid@ al grupo', 'Que gusto verte', 'Bienvenido/a']
  const WELCOME_SUBS = [
    'Un placer tenerte aquí',
    'Que la pases bien con nosotros',
    'Esperamos que disfrutes el grupo',
    'Pásala bien y participa',
    'Aquí encontrarás buena onda',
    'Prepárate para la diversión',
    'Bienvenido, esperamos tus aportes',
    'Diviértete y sé respetuos@',
    'Gracias por unirte',
    'La comunidad te da la bienvenida'
  ]
  const BYE_TITLES = ['Adiós', 'Despedida', 'Hasta luego', 'Nos vemos', 'Salida', 'Bye', 'Chao', 'Nos vemos pronto', 'Que te vaya bien', 'Sayonara']
  const BYE_SUBS = [
    'Adiós, nadie te quiso',
    'No vuelvas más, eres feo',
    'Se fue sin dejar rastro',
    'Buena suerte en lo que siga',
    'Hasta nunca',
    'Que te vaya mejor (o no)',
    'Te extrañaremos (no tanto)',
    'Nos veremos en otra vida',
    'Adiós y cuídate',
    'Chao, fue un placer... quizá'
  ]
  const title = type === 'welcome' ? pick(WELCOME_TITLES) : pick(BYE_TITLES)
  const subtitle = type === 'welcome' ? [pick(WELCOME_SUBS)] : [pick(BYE_SUBS)]
  const badgeUrl = ''
  const bgUrl = pick(BG_IMAGES)
  let avatarUrl = ''
  try {
    if (participant) avatarUrl = await conn.profilePictureUrl(participant, 'image')
  } catch {}
  if (!avatarUrl) avatarUrl = 'https://files.catbox.moe/xr2m6u.jpg'
  const buff = await makeCard({ title, subtitle, avatarUrl, bgUrl, badgeUrl })
  const file = path.join(tmp, `${type}-${Date.now()}.png`)
  fs.writeFileSync(file, buff)
  const who = participant || ''
  let realJid = who
  try { if (typeof conn?.decodeJid === 'function') realJid = conn.decodeJid(realJid) } catch {}
  try { realJid = jidNormalizedUser(realJid) } catch {}
  const number = normalizeNumberFromJid(realJid)
  const taguser = number ? `@${number}` : (userName || 'Usuario')
  let meta = null
  try { meta = await conn.groupMetadata(jid) } catch {}
  const totalMembers = Array.isArray(meta?.participants) ? meta.participants.length : 0
  const groupSubject = meta?.subject || groupName || ''
  const tipo = type === 'welcome' ? 'Bienvenid@' : 'Despedida'
  const date = new Date().toLocaleString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit', hour12: false, hour: '2-digit', minute: '2-digit' })

  let fkontak = null
  try {
    const res = await fetch('https://i.postimg.cc/rFfVL8Ps/image.jpg')
    const thumb2 = Buffer.from(await res.arrayBuffer())
    fkontak = { key: { participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast', fromMe: false, id: 'Halo' }, message: { locationMessage: { name: `${tipo}`, jpegThumbnail: thumb2 } }, participant: '0@s.whatsapp.net' }
  } catch {}

  const productMessage = {
    product: {
      productImage: { url: file },
      productId: '24529689176623820',
      title: `${tipo}, ahora somos ${totalMembers}`,
      description: '',
      currencyCode: 'USD',
      priceAmount1000: '0',
      retailerId: 1677,
      url: `https://wa.me/${number}`,
      productImageCount: 1
    },
    businessOwnerJid: who || '0@s.whatsapp.net',
    caption: `✎ Usuario: ${taguser}\n✎ Grupo: ${groupSubject}\n✎ Miembros: ${totalMembers}\n✎ Fecha: ${date}`.trim(),
    title: '',
    subtitle: '',
    footer: groupSubject || '',
    interactiveButtons: [
      {
        name: 'quick_reply',
        buttonParamsJson: JSON.stringify({
          display_text: '👤ʀᴇɢɪsᴛʀᴀᴍᴇ',
          id: '.reg'
        })
      }
    ],
    mentions: who ? [who] : []
  }

  const mentionId = who ? [who] : []
  await conn.sendMessage(jid, productMessage, { quoted: fkontak || undefined, contextInfo: { mentionedJid: mentionId } })
  return file
}

export default { makeCard, sendWelcomeOrBye }










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
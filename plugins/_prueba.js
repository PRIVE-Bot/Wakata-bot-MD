import fetch from 'node-fetch'
import FormData from 'form-data'

async function uploadToCatbox(buffer, name = 'welcome.png') {
  try {
    const form = new FormData()
    form.append('reqtype', 'fileupload')
    form.append('fileToUpload', buffer, { filename: name })
    const res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form })
    const url = await res.text()
    return url
  } catch (e) {
    console.error('Error subiendo a catbox:', e)
    return null
  }
}

let handler = async (m, { conn, participants, groupMetadata }) => {
  if (!m.isGroup) return
  if (m.messageStubType !== 28) return // GROUP_PARTICIPANT_ADD

  const jid = m.chat
  const who = m.messageStubParameters[0]
  const taguser = `@${who.split('@')[0]}`
  const fondoUrl = encodeURIComponent('https://files.catbox.moe/ijud3n.jpg')
  const defaultAvatar = 'https://files.catbox.moe/6al8um.jpg'

  // Obtener avatar del usuario
  let avatarUrl = defaultAvatar
  try {
    const userPic = await conn.profilePictureUrl(who, 'image')
    if (userPic) avatarUrl = userPic
  } catch {}

  // Intentar obtener la imagen desde la API
  let imgBuffer
  const canvasUrl = `https://gokublack.xyz/canvas/welcome?background=${fondoUrl}&text1=Hola+${taguser.replace('@','')}&text2=Bienvenido&text3=Miembro+${participants.length}&avatar=${encodeURIComponent(avatarUrl)}`
  try {
    const res = await fetch(canvasUrl)
    if (res.ok) imgBuffer = Buffer.from(await res.arrayBuffer())
    else throw new Error('API fallo')
  } catch {
    // Si la API falla, usamos la foto del usuario
    try {
      const res = await fetch(avatarUrl)
      imgBuffer = Buffer.from(await res.arrayBuffer())
    } catch {
      // Si tampoco, usamos la default
      const res = await fetch(defaultAvatar)
      imgBuffer = Buffer.from(await res.arrayBuffer())
    }
  }

  // Subir a catbox para tener URL accesible
  const imageUrl = await uploadToCatbox(imgBuffer)
  if (!imageUrl) return m.reply('❌ No se pudo subir la imagen a Catbox.')

  try {
    const productMessage = {
      product: {
        productImage: {
          url: imageUrl
        },
        title: '✨ Bienvenido al grupo ✨',
        description: "Alquila o compra Pikachu Bot para tus grupos.",
        currencyCode: "USD",
        priceAmount1000: 5000,
        retailerId: "1466",
        productId: "24502048122733040",
        productImageCount: 1,
      },
      businessOwnerJid: "50432955554@s.whatsapp.net"
    }

    await conn.sendMessage(jid, productMessage, { messageType: 'product' })
  } catch (e) {
    console.error('Error enviando catálogo:', e)
    await m.reply('❌ No se pudo enviar el catálogo de bienvenida.')
  }
}

handler.command = ['bienvenida1']
handler.register = true
export default handler
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
  if (!m.quoted) return conn.reply(m.chat, 'Responde a una imagen o video ViewOnce.', m)

  let quoted = m.quoted.message
  if (!quoted) return conn.reply(m.chat, 'No se pudo obtener el mensaje citado.', m)

  let type = Object.keys(quoted)[0] 
  if (!['imageMessage','videoMessage'].includes(type)) 
    return conn.reply(m.chat, 'Responde a una imagen o video ViewOnce.', m)

  let media = quoted[type]

  let stream = await downloadContentFromMessage(media, type.replace('Message',''))
  let buffer = Buffer.concat([])
  for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])

  if (type === 'videoMessage') {
    await conn.sendFile(m.chat, buffer, 'media.mp4', media?.caption || '', m)
  } else if (type === 'imageMessage') {
    await conn.sendFile(m.chat, buffer, 'media.jpg', media?.caption || '', m)
  }
}

handler.command = ['readviewonce','read','readvo','rvo','ver']
export default handler
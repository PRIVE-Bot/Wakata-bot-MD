import { downloadContentFromMessage } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
  if (!m.quoted) return conn.reply(m.chat, `Responde a una imagen o video ViewOnce.`, m)

  // Accedemos al mensaje crudo
  let q = m.quoted.message || {}

  // Detectar view once (v1 o v2)
  let vmsg = q.viewOnceMessage?.message || q.viewOnceMessageV2?.message
  if (!vmsg) return conn.reply(m.chat, `Responde a una imagen o video ViewOnce. ..`, m)

  // tipo de mensaje (imageMessage o videoMessage)
  let type = Object.keys(vmsg)[0]
  let media = vmsg[type]

  // descargar contenido
  let stream = await downloadContentFromMessage(media, type.replace('Message', ''))
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
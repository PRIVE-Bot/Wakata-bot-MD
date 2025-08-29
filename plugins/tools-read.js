let handler = async (m, { conn }) => {
  if (!m.quoted) return conn.reply(m.chat, `Responde a una imagen o video ViewOnce.`, m)

  
  let q = m.quoted
  let msg = q.msg || q

  if (!(msg.viewOnceMessage || msg.viewOnceMessageV2)) {
    return conn.reply(m.chat, `Responde a una imagen o video ViewOnce.`, m)
  }

  let media = msg.viewOnceMessage?.message || msg.viewOnceMessageV2?.message
  let type = Object.keys(media)[0]
  let buffer = await downloadContentFromMessage(media[type], type.replace('Message', ''))

  let chunks = []
  for await (const chunk of buffer) chunks.push(chunk)
  let result = Buffer.concat(chunks)

  if (/videoMessage/.test(type)) {
    return conn.sendFile(m.chat, result, 'media.mp4', media[type]?.caption || '', m)
  } else if (/imageMessage/.test(type)) {
    return conn.sendFile(m.chat, result, 'media.jpg', media[type]?.caption || '', m)
  }
}

handler.command = ['readviewonce','read','readvo','rvo','ver']
export default handler
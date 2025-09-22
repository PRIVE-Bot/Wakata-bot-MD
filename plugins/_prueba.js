// plugins/gif.js
import axios from 'axios'
import { default as baileys } from '@whiskeysockets/baileys'

async function sendTenorAlbum(conn, jid, medias, options = {}) {
  if (!medias || medias.length < 2) throw new Error('Necesitas al menos 2 GIFs para enviar álbum.')

  const caption = options.text || options.caption || ''
  const delay = !isNaN(options.delay) ? options.delay : 500
  delete options.text
  delete options.caption
  delete options.delay

  const album = baileys.generateWAMessageFromContent(
    jid,
    {
      messageContextInfo: {},
      albumMessage: {
        expectedVideoCount: medias.length,
        ...(options.quoted
          ? {
              contextInfo: {
                remoteJid: options.quoted.key.remoteJid,
                fromMe: options.quoted.key.fromMe,
                stanzaId: options.quoted.key.id,
                participant: options.quoted.key.participant || options.quoted.key.remoteJid,
                quotedMessage: options.quoted.message
              }
            }
          : {})
      }
    },
    {}
  )

  await conn.relayMessage(album.key.remoteJid, album.message, { messageId: album.key.id })

  for (let i = 0; i < medias.length; i++) {
    const { url } = medias[i]

    const msg = await baileys.generateWAMessage(
      album.key.remoteJid,
      {
        video: { url },
        mimetype: 'video/mp4',
        gifPlayback: true,
        ...(i === 0 ? { caption } : {})
      },
      { upload: conn.waUploadToServer }
    )

    msg.message.messageContextInfo = {
      messageAssociation: { associationType: 1, parentMessageKey: album.key }
    }

    await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id })
    await baileys.delay(delay)
  }

  return album
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `❗️Uso: ${usedPrefix + command} <texto>\nEjemplo: ${usedPrefix + command} anime matando`, m)

  try {
    const { data } = await axios.get(
      `https://api.tenor.com/v1/search?q=${encodeURIComponent(text)}&key=LIVDSRZULELA&limit=4`
    )

    if (!data.results || data.results.length === 0)
      return conn.reply(m.chat, `❌ No encontré GIFs para *${text}*`, m)

    // ✅ Corregido: cada media tiene type y data
    const medias = data.results.map(gif => {
      const url = gif.media[0].mp4?.url || gif.media[0].tinygif?.url || gif.media[0].gif?.url
      return {
        type: 'video',
        data: { url }
      }
    })

    if (medias.length < 2) return conn.reply(m.chat, '❌ Se necesitan al menos 2 GIFs para enviar álbum.', m)

    await sendTenorAlbum(conn, m.chat, medias, { caption: `🎬 Resultados para: ${text}`, quoted: m })

  } catch (err) {
    console.error(err)
    conn.reply(m.chat, '❌ Error al obtener GIFs desde Tenor.', m)
  }
}

handler.help = ['gif <texto>']
handler.tags = ['media', 'search']
handler.command = /^gif$/i

export default handler
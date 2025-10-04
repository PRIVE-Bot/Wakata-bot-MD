import fetch from 'node-fetch'
import baileys from '@whiskeysockets/baileys'

async function sendAlbumMessage(conn, jid, medias, options = {}) {
  if (typeof jid !== "string") throw new TypeError("jid must be string")
  if (medias.length < 2) throw new RangeError("Minimum 2 media")

  const caption = options.text || options.caption || ""
  const delay = !isNaN(options.delay) ? options.delay : 500
  delete options.text
  delete options.caption
  delete options.delay

  const album = baileys.generateWAMessageFromContent(
    jid,
    {
      messageContextInfo: {},
      albumMessage: {
        expectedImageCount: medias.filter(m => m.type === "image").length,
        expectedVideoCount: medias.filter(m => m.type === "video").length,
        ...(options.quoted ? {
          contextInfo: {
            remoteJid: options.quoted.key.remoteJid,
            fromMe: options.quoted.key.fromMe,
            stanzaId: options.quoted.key.id,
            participant: options.quoted.key.participant || options.quoted.key.remoteJid,
            quotedMessage: options.quoted.message,
          },
        } : {}),
      },
    },
    {}
  )

  await conn.relayMessage(album.key.remoteJid, album.message, { messageId: album.key.id })

  for (let i = 0; i < medias.length; i++) {
    const { type, data } = medias[i]
    try {
      const img = await baileys.generateWAMessage(
        album.key.remoteJid,
        { [type]: data, ...(i === 0 ? { caption } : {}) },
        { upload: conn.waUploadToServer }
      )
      img.message.messageContextInfo = { messageAssociation: { associationType: 1, parentMessageKey: album.key } }
      await conn.relayMessage(img.key.remoteJid, img.message, { messageId: img.key.id })
      await baileys.delay(delay)
    } catch (err) {
      console.warn(`[WARN ANIME] No se pudo enviar la imagen ${i + 1}:`, err.message)
      continue
    }
  }

  return album
}

let handler = async (m, { conn }) => {
  try {
    const res = await fetch('https://api.kirito.my/api/anime?apikey=by_deylin')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()

    if (!json.images || !Array.isArray(json.images)) throw new Error('No se encontraron imágenes')

    const maxImgs = Math.min(json.images.length, 10)
    const medias = []

    for (let i = 0; i < maxImgs; i++) {
      medias.push({ type: 'image', data: { url: json.images[i] } })
    }

    const fkontak = {
      key: { fromMe: false, participant: m.sender },
      message: {
        documentMessage: {
          title: "Imágenes Anime",
          fileName: `𝗔𝗡𝗜𝗠𝗘𝗦_𝗗𝗘_𝗞𝗜𝗥𝗜𝗧𝗢`,
        }
      }
    }

    await sendAlbumMessage(conn, m.chat, medias, {
      caption: `Aquí tienes ${maxImgs} imágenes anime 🍥`,
      quoted: fkontak
    })

  } catch (e) {
    console.error('[ERROR ANIME]', e)
    m.reply('😿 Ocurrió un error al obtener las imágenes anime.')
  }
}

handler.help = ['anime']
handler.tags = ['fun']
handler.command = ['anime', 'animes']

export default handler
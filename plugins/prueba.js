import fetch from 'node-fetch'

/*
 Creado: RyzeMD
*/

async function fetchLoquendo(text, voice) {
  const url = `https://apis-starlights-team.koyeb.app/starlight/loquendo?text=${encodeURIComponent(text)}&voice=${encodeURIComponent(voice)}`
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const ct = (res.headers.get('content-type') || '').toLowerCase()
  if (ct.includes('application/json')) {
    const j = await res.json().catch(()=>({}))
    let audio = j.audio || j.url || j.audioUrl || j.result || j.result?.audio
    if (!audio) throw new Error(`Sin campo de audio en JSON (claves: ${Object.keys(j).join(', ')})`)
   
    if (/^https?:\/\//i.test(audio)) {
      const r2 = await fetch(audio)
      if (!r2.ok) throw new Error('Fallo descargando audio secundario')
      const buff = Buffer.from(await r2.arrayBuffer())
      return { buffer: buff, mime: (r2.headers.get('content-type')||'audio/mpeg') }
    }

    if (audio.startsWith('data:audio')) {
      const base64 = audio.split(',')[1] || ''
      return { buffer: Buffer.from(base64, 'base64'), mime: 'audio/mpeg' }
    }
 
    if (/^[A-Za-z0-9+/=]+$/.test(audio) && audio.length > 50) {
      return { buffer: Buffer.from(audio, 'base64'), mime: 'audio/mpeg' }
    }
 
    const attempt = `https://apis-starlights-team.koyeb.app/${audio}`
    try {
      const r3 = await fetch(attempt)
      if (r3.ok && /(audio|octet-stream)/.test(r3.headers.get('content-type')||'')) {
        const buff = Buffer.from(await r3.arrayBuffer())
        if (buff.length > 300) return { buffer: buff, mime: (r3.headers.get('content-type')||'audio/mpeg') }
      }
    } catch (_) {}
    throw new Error('No se pudo interpretar el campo de audio devuelto')
  }

  const buff = Buffer.from(await res.arrayBuffer())
  return { buffer: buff, mime: ct.includes('audio/') ? ct : 'audio/mpeg' }
}

const handler = async (m, { conn, text, command, usedPrefix }) => {
  try {
    if (!text) return conn.reply(m.chat, `Uso: ${usedPrefix+command} <texto>\nEj: ${usedPrefix+command} Hola mundo`, m, rcanal)

    const voice = 'Jorge'
    const content = text.trim()
    if (!content) return conn.reply(m.chat, `Escribe algún texto. Ej: ${usedPrefix+command} Hola mundo`, m, rcanal)

    const aviso = await conn.sendMessage(m.chat, { text: '🎙️ Generando audio (Jorge)...' }, { quoted: fkontak })
    const { buffer, mime } = await fetchLoquendo(content, voice)

    if (!buffer || buffer.length < 300) throw new Error('Audio muy corto o vacío')


    const mimetype = mime.includes('audio/') ? mime : 'audio/mpeg'
    await conn.sendMessage(m.chat, {
      audio: buffer,
      mimetype,
      ptt: true,
      fileName: `loquendo-${voice}.mp3`,
      caption: `Voz: ${voice}`
    }, { quoted: fkontak })

    if (aviso?.key) await conn.sendMessage(m.chat, { delete: aviso.key })
  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `❌ Error Loquendo: ${e.message}`, m, rcanal)
  }
}

handler.help = ['loquendo <texto>']
handler.tags = ['herramientas']
handler.command = /^(loquendo|ttsloquendo)$/i
handler.limit = true
handler.register = true

export default handler

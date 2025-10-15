import fs from "fs"
import fetch from "node-fetch"

const GITHUB_TOKEN = 'TOKEN' 
const GITHUB_OWNER = 'Deylin-Eliac'
const GITHUB_REPO = 'API-log-fun'
const GITHUB_BRANCH = 'main'
const BASE_URL = 'https://Kirito.my' 

const handler = async (m, { conn, usedPrefix, command }) => {
  const q = m.quoted ? m.quoted : m
  const mime = (q.msg || q).mimetype || ''
  if (!mime) return conn.reply(m.chat, `📸 Responde a una imagen o video con *${usedPrefix + command}*`, m)

  const buffer = await q.download()
  const sizeKB = (buffer.length / 1024).toFixed(2)
  const type = mime.split('/')[0]
  const ext = mime.split('/')[1]
  const folder = type === 'video' ? 'media/videos' : 'media/images'
  const fileName = `${Date.now()}.${ext}`
  const filePath = `${folder}/${fileName}`

  try {
    const githubApiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`
    const base64Content = buffer.toString('base64')

    const response = await fetch(githubApiUrl, {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Upload from WhatsApp Bot: ${fileName}`,
        content: base64Content,
        branch: GITHUB_BRANCH,
      }),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Error subiendo a GitHub.')

    const fileUrl = `${BASE_URL}/${folder}/${fileName}`
    const msg = `✅ ${type === 'video' ? 'Video' : 'Imagen'} subida con éxito\n📦 Tamaño: ${sizeKB} KB\n📄 Tipo: ${mime}\n🔗 URL: ${fileUrl}`

    await conn.reply(m.chat, msg, m)

  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, `⚠️ Error al subir el archivo:\n${e.message}`, m)
  }
}

handler.command = /^(url|gifurl|mediaurl)$/i
export default handler
/*
██████╗░░█████╗░██╗░░░██╗██╗██████╗░
██╔══██╗██╔══██╗██║░░░██║██║██╔══██╗
██║░░██║███████║╚██╗░██╔╝██║██║░░██║
██║░░██║██╔══██║░╚████╔╝░██║██║░░██║
██████╔╝██║░░██║░░╚██╔╝░░██║██████╔╝
╚═════╝░╚═╝░░╚═╝░░░╚═╝░░░╚═╝╚═════╝░
*/
// Creado por David
// =============================================


import fs from 'fs'
import fetch from 'node-fetch'
import FormData from 'form-data'
import { writeFile, unlink, readFile } from 'fs/promises'
import { join } from 'path'
import { fileTypeFromBuffer } from 'file-type'
import crypto from "crypto"
import axios from 'axios'
import cheerio from 'cheerio'


function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const sizes = ['B','KB','MB','GB','TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / (1024 ** i)).toFixed(2)} ${sizes[i]}`
}

async function shortUrl(url) {
  try {
    const response = await fetch('https://tinyurl.com/api-create.php?url=' + encodeURIComponent(url))
    return await response.text()
  } catch (e) {
    return url
  }
}

let handler = async (m, { conn, usedPrefix }) => {
  try {
    const q = m.quoted || m
    const mime = q.mediaType || ''
    if (!/image|video|audio|sticker|document/.test(mime)) {
      return conn.reply(m.chat, '[ 📤 ] Responde a una imagen / vídeo / audio (normal o documento)', m)
    }

    const prefix = usedPrefix || '/'
    const mediaPath = await q.download(true)
    
    try {
      const sizeBytes = fs.statSync(mediaPath).size
      const humanSize = formatBytes(sizeBytes)

      if (sizeBytes === 0) {
        await conn.reply(m.chat, '[ ❗ ] El archivo es demasiado ligero', m)
        try { await fs.promises.unlink(mediaPath) } catch {}
        return
      }
      if (sizeBytes > 1 * 1024 * 1024 * 1024) {
        await conn.reply(m.chat, '[ 📌 ] El archivo supera 1GB', m)
        try { await fs.promises.unlink(mediaPath) } catch {}
        return
      }

      const services = [
        { name: 'Catbox',        url: 'https://catbox.moe/user/api.php', field: 'fileToUpload', extra: { reqtype: 'fileupload' }, expires: 'Permanente' },
        { name: 'PostImages',    url: 'https://postimages.org/json/rr',  field: 'file', extra: { optsize: '0', expire: '0', numfiles: '1' }, expires: 'Permanente' },
        { name: 'Litterbox',     url: 'https://api.alvianuxio.eu.org/uploader/litterbox',      field: 'file', extra: { time: '24h' }, expires: '24h' },
        { name: 'TmpFiles',      url: 'https://api.alvianuxio.eu.org/uploader/tmpfiles',       field: 'file', extra: {}, expires: 'Desconocido' },
        { name: 'CloudGuru',     url: 'https://cloudkuimages.guru/upload.php', field: 'file', extra: {}, expires: 'Permanente' }
      ]

      const results = []
      for (const svc of services) {
        try {
          const link = await uploadService(svc, mediaPath)
          results.push({ name: svc.name, url: link, size: humanSize, expires: svc.expires })
        } catch (_) {}
      }

      try { await fs.promises.unlink(mediaPath) } catch {}

      if (results.length === 0) {
        return conn.reply(m.chat, '[ ❗ ] No se obtuvo ninguna URL', m)
      }

      
      let txt = `乂  *L I N K S - E N L A C E S*  乂\n\n`;
      for (const result of results) {
        txt += `*${result.name}*\n`;
        txt += `• Enlace: ${result.url}\n`;
        txt += `• Tamaño: ${result.size}\n`;
        txt += `• Expiración: ${result.expires}\n\n`;
      }
      txt += `Total: ${results.length} enlace(s) generado(s).`;

      await conn.reply(m.chat, txt.trim(), m)

    } catch (err) {
      try { await fs.promises.unlink(mediaPath) } catch {}
      await conn.reply(m.chat, '[ ❗ ] Error al procesar el archivo: ' + err.message, m)
    }
  } catch (e) {
    await conn.reply(m.chat, '[ ❗ ] ' + e.message, m)
  }
}

handler.help = ['tourl']
handler.tags = ['tools']
handler.command = /^(tourl|upload|url|tourlall)$/i
handler.owner = false

export default handler

async function uploadService(svc, path) {
  try {
    const buffer = await fs.promises.readFile(path)
    const { ext, mime } = await fileTypeFromBuffer(buffer) || {}
    const fileName = `upload.${ext || 'bin'}`
    const form = new FormData()
    
    
    for (const [k, v] of Object.entries(svc.extra)) {
      form.append(k, v)
    }

      
    try {
      if (svc.url.includes('postimages.org')) {
        
        const data = new FormData()
        data.append('optsize', '0')
        data.append('expire', '0')
        data.append('numfiles', '1')
        data.append('upload_session', Math.random())
        data.append('file', buffer, `${Date.now()}.jpg`)

        const res = await axios.post('https://postimages.org/json/rr', data)
        const html = await axios.get(res.data.url)
        const $ = cheerio.load(html.data)

        const image = $('#code_direct').attr('value')
        if (!image) throw new Error('No se pudo obtener la URL directa')
        return image
      } else if (svc.url.includes('telegra.ph')) {
        
        const supportedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'video/mp4'];
        if (!supportedMimes.includes(mime)) {
          throw new Error('Tipo de archivo no soportado. Telegraph solo acepta imágenes (JPG, PNG, GIF) y vídeos MP4.');
        }
        
        
        const form = new FormData();
        
       
        const fileExt = ext || mime.split('/')[1] || 'jpg';
        form.append('file', buffer, {
          filename: `upload.${fileExt}`,
          contentType: mime
        });
        
        try {
          const response = await fetch('https://telegra.ph/upload', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            body: form
          });
          
          if (!response.ok) {
            throw new Error(`Telegraph respondió con estado ${response.status}`);
          }
          
          const result = await response.json();
          
          if (!Array.isArray(result) || !result[0] || !result[0].src) {
            throw new Error(`Respuesta inválida de Telegraph: ${JSON.stringify(result)}`);
          }
          
          return 'https://telegra.ph' + result[0].src;
        } catch (error) {
          throw new Error(`Error de Telegraph: ${error.message}`);
        }
        
      } else if (svc.url.includes('catbox.moe')) {
      
        try {
          const formData = new FormData()
          formData.append('reqtype', 'fileupload')
          
          const randomBytes = crypto.randomBytes(5).toString("hex")
          const fileExt = ext || 'bin'
          
          formData.append('fileToUpload', buffer, {
            filename: `${randomBytes}.${fileExt}`,
            contentType: mime || 'application/octet-stream'
          })
          
          const res = await axios.post('https://catbox.moe/user/api.php', formData, {
            headers: {
              ...formData.getHeaders(),
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
              'Accept': '*/*'
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
          })
          
          const directUrl = res.data
          if (typeof directUrl !== 'string' || !directUrl.startsWith('http')) {
            throw new Error('Respuesta inválida de Catbox')
          }
          
          return directUrl
        } catch (error) {
          if (error.response) {
            throw new Error(`Error de Catbox: ${error.response.status} - ${error.response.data}`)
          }
          throw error
        }
      }

      
      form.append(svc.field, buffer, {
        filename: fileName,
        contentType: mime || 'application/octet-stream'
      })

      const headers = {
        ...form.getHeaders(),
        'Accept': 'application/json'
      }

      const res = await fetch(svc.url, {
        method: 'POST',
        headers,
        body: form
      })
      
      let json
      try {
        json = await res.json()
      } catch (err) {
        throw new Error('JSON inválido: ' + err.message)
      }      
      let url
      if (svc.url.includes('cloudwaysapps.com') || 
          svc.url.includes('cloudkuimages.guru') || 
          svc.url.includes('cloudkuimages.com')) {
        url = json?.data?.url
      } else {
        url = json.data?.response
          || json.data?.file
          || json.data?.url
          || json.files?.[0]?.url
          || json.files?.[0]?.src
          || json.url
          || json.src
          || (Array.isArray(json) ? json[0]?.url || json[0]?.src : undefined)
      }

      if (!url) throw new Error('No URL en respuesta: ' + JSON.stringify(json))
      return url

    } catch (err) {
      throw new Error(`Error en ${svc.name}: ${err.message}`)
    }
  } catch (err) {
    console.error(`Error al subir a ${svc.name}:`, err)
    throw err
  }
}

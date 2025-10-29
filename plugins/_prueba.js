import fs from "fs"
import os from "os"
import path from "path"
import axios from "axios"
import ffmpeg from "fluent-ffmpeg"
import { fileTypeFromBuffer } from "file-type"
import mime from "mime-types"

let handler = async (m, { conn, text, args }) => {
  try {
    const wantAudio = args && (args[0] && (args[0].toLowerCase() === "audio" || args[0].toLowerCase() === "mp3"))
    const tmpDir = os.tmpdir()
    let quoted = m.quoted && m.quoted.msg ? m.quoted.msg : (m.quoted ? m.quoted : null)
    if (!quoted && m.quoted) quoted = m.quoted
    const sourceMsg = quoted || m
    async function bufferFromBaileysMessage(message) {
      if (!message) return null
      if (Buffer.isBuffer(message)) return message
      const msgObj = message.message ? message.message : message
      const mediaTypes = ["imageMessage","videoMessage","audioMessage","stickerMessage","documentMessage","extendedTextMessage"]
      for (let t of mediaTypes) {
        if (msgObj[t]) {
          try {
            if (conn.downloadMediaMessage) {
              const buf = await conn.downloadMediaMessage(message)
              return buf
            }
            if (typeof conn.downloadContentFromMessage === "function") {
              const stream = await conn.downloadContentFromMessage(msgObj[t], t.replace("Message",""))
              const chunks = []
              for await (const chunk of stream) chunks.push(chunk)
              return Buffer.concat(chunks)
            }
          } catch (e) {}
        }
      }
      return null
    }
    async function bufferFromUrl(url) {
      try {
        const res = await axios.get(url, { responseType: "arraybuffer", timeout: 20000 })
        return Buffer.from(res.data)
      } catch (e) { return null }
    }
    const urlInText = (sourceMsg && sourceMsg.text) ? (sourceMsg.text.match(/https?:\/\/\S+/g) || [])[0] : null
    let mediaBuffer = await bufferFromBaileysMessage(sourceMsg)
    if (!mediaBuffer && (urlInText || text)) {
      const url = urlInText || (text.match && text.match(/https?:\/\/\S+/g) ? text.match(/https?:\/\/\S+/g)[0] : null)
      if (url) mediaBuffer = await bufferFromUrl(url)
    }
    if (!mediaBuffer) return conn.sendMessage(m.chat, { text: "No detecté media ni URL válida." }, { quoted: m })
    const ft = await fileTypeFromBuffer(mediaBuffer).catch(()=>null)
    const detectedMime = ft ? ft.mime : (sourceMsg.mimetype || sourceMsg.type || "application/octet-stream")
    let ext = ft ? ft.ext : mime.extension(detectedMime) || "bin"
    if (wantAudio) {
      const outName = `audio_${Date.now()}.mp3`
      const outPath = path.join(tmpDir, outName)
      const inPath = path.join(tmpDir, `infile_${Date.now()}.${ext}`)
      fs.writeFileSync(inPath, mediaBuffer)
      await new Promise((resolve, reject) => {
        ffmpeg(inPath).noVideo().audioBitrate("128k").format("mp3").on("error", err => { try{fs.unlinkSync(inPath)}catch{} reject(err) }).on("end", () => resolve()).save(outPath)
      })
      const fileStream = fs.readFileSync(outPath)
      await conn.sendMessage(m.chat, { document: fileStream, fileName: `audio_${Date.now()}.mp3`, mimetype: "audio/mpeg" }, { quoted: m })
      try { fs.unlinkSync(inPath); fs.unlinkSync(outPath) } catch {}
      return
    }
    const filename = `file_${Date.now()}.${ext}`
    await conn.sendMessage(m.chat, { document: mediaBuffer, fileName: filename, mimetype: detectedMime }, { quoted: m })
  } catch (err) {
    console.error(err)
    try { await conn.sendMessage(m.chat, { text: "Error: " + (err.message || err) }, { quoted: m }) } catch {}
  }
}
handler.command = /^(tofile|toarchivo)$/i

export default handler
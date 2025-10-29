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
    const q = m.quoted ? m.quoted : m
    const mimeMsg = (q.msg || q).mimetype || q.mediaType || ""
    let mediaBuffer
    if (/image|video|audio|sticker|document/.test(mimeMsg)) {
      mediaBuffer = await q.download?.() || await conn.downloadMediaMessage(q)
    } else if (text && text.match(/https?:\/\/\S+/)) {
      const url = text.match(/https?:\/\/\S+/)[0]
      const res = await axios.get(url, { responseType: "arraybuffer" })
      mediaBuffer = Buffer.from(res.data)
    }
    if (!mediaBuffer) return conn.sendMessage(m.chat, { text: "No detecté media ni URL válida." }, { quoted: m })
    const ft = await fileTypeFromBuffer(mediaBuffer).catch(()=>null)
    const detectedMime = ft ? ft.mime : mimeMsg || "application/octet-stream"
    let ext = ft ? ft.ext : mime.extension(detectedMime) || "bin"
    if (wantAudio) {
      const inPath = path.join(tmpDir, `in_${Date.now()}.${ext}`)
      const outPath = path.join(tmpDir, `out_${Date.now()}.mp3`)
      fs.writeFileSync(inPath, mediaBuffer)
      await new Promise((resolve, reject) => {
        ffmpeg(inPath).noVideo().audioBitrate("128k").format("mp3").on("error", reject).on("end", resolve).save(outPath)
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
    conn.sendMessage(m.chat, { text: "Error: " + (err.message || err) }, { quoted: m })
  }
}

handler.command = /^(tofile|toarchivo)$/i
export default handler
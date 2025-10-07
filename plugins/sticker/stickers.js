import { sticker } from '../../lib/sticker.js'
import { webp2png, webp2mp4 } from '../../lib/webp2mp4.js'
import Jimp from 'jimp'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { tmpdir } from 'os'
import ffmpeg from 'fluent-ffmpeg'

const tmp = ext => path.join(tmpdir(), `${Date.now()}.${ext}`)

let handler = async (m, { conn, args, command }) => {
  const res = await fetch('https://files.catbox.moe/p87uei.jpg')
  const thumb = Buffer.from(await res.arrayBuffer())
  const fkontak = { key:{fromMe:false,participant:m.sender}, message:{imageMessage:{jpegThumbnail:thumb, caption:'✨ 𝗦𝗧𝗜𝗖𝗞𝗘𝗥 𝗚𝗘𝗡𝗘𝗥𝗔𝗗𝗢 𝗖𝗢𝗡 𝗘𝗫𝗜𝗧𝗢 ✨'}}}
  const fkontak2 = { key:{fromMe:false,participant:m.sender}, message:{imageMessage:{jpegThumbnail:thumb, caption:'⚠︎ 𝗘𝗥𝗥𝗢𝗥 ⚠︎'}}}

  let texto = args.filter(a=>!/^(co|cc|cp)$/i.test(a)).join(' ').trim()
  let forma = (args.find(a=>/^(co|cc|cp)$/i.test(a))||'').toLowerCase()
  let stiker = false

  try {
    let q = m.quoted ? m.quoted : m
    let mime = q.mimetype || q.msg?.mimetype || ''
    let url = args[0] && /https?:\/\//.test(args[0]) ? args[0] : null
    let media

    if(url){
      const response = await fetch(url)
      media = Buffer.from(await response.arrayBuffer())
      mime = response.headers.get('content-type')||''
    } else if(/image|webp|video/.test(mime)){
      media = await q.download?.()
    } else return conn.reply(m.chat,'✰ Envía o responde una imagen, video o sticker para convertirlo a sticker.',m,fkontak)

    if(!media) return conn.reply(m.chat,'⚠️ No se pudo descargar el archivo.',m,fkontak2)

    if(/webp/.test(mime)){
      const out = await webp2mp4(media)
      if(out?.url){
        const buff = await (await fetch(out.url)).arrayBuffer()
        media = Buffer.from(buff)
        mime = 'video/mp4'
      } else {
        media = await webp2png(media)
        mime = 'image/png'
      }
    }

    if(/video|gif/.test(mime)){
      const tempIn = tmp('mp4')
      const tempOut = tmp('webp')
      fs.writeFileSync(tempIn, media)
      await new Promise((resolve,reject)=>{
        ffmpeg(tempIn)
          .inputFormat('mp4')
          .outputOptions([
            '-vcodec libwebp',
            '-vf fps=15,scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,pad=512:512:-1:-1:color=0x00000000',
            '-loop 0',
            '-preset default',
            '-an',
            '-vsync 0',
            '-t 6'
          ])
          .toFormat('webp')
          .save(tempOut)
          .on('end',resolve)
          .on('error',reject)
      })
      if(!fs.existsSync(tempOut)) throw new Error('No se generó el sticker')
      stiker = fs.readFileSync(tempOut)
      fs.unlinkSync(tempIn)
      fs.unlinkSync(tempOut)
    } else {
      let jimg = await Jimp.read(media)
      
      jimg.cover(512,512)
      let {width,height} = jimg.bitmap

      if(forma==='cp') jimg.contain(512,512)

      if(forma==='cc' || forma==='co'){
        
        jimg.background(0x00000000)
        
        const mask = new Jimp(width,height,0x00000000)
        
        mask.scan(0, 0, width, height, function (x, y, idx) {
            let alpha = 0
            if (forma === 'cc') {
                const dx = x - width / 2
                const dy = y - height / 2
                const r = Math.sqrt(dx * dx + dy * dy)
                if (r < width / 2) alpha = 255
            } else if (forma === 'co') {
                const nx = (x - width / 2) / (width / 2)
                const ny = (height / 2 - y) / (height / 2)
                const eq = Math.pow(nx * nx + ny * ny - 1, 3) - nx * nx * ny * ny * ny
                if (eq <= 0) alpha = 255
            }
            
            this.bitmap.data[idx + 0] = 255 
            this.bitmap.data[idx + 1] = 255 
            this.bitmap.data[idx + 2] = 255 
            this.bitmap.data[idx + 3] = alpha 
        })
        
        jimg.mask(mask,0,0)
      }

      if(texto){
        const fuente = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE)
        jimg.print(fuente,0,0,{text:texto,alignmentX:Jimp.HORIZONTAL_ALIGN_CENTER,alignmentY:Jimp.VERTICAL_ALIGN_BOTTOM},width,height-20)
      }

      const finalImg = await jimg.getBufferAsync(Jimp.MIME_PNG)
      stiker = await sticker(finalImg,false,global.packsticker,global.packsticker2)
    }

  } catch(e){
    console.error(e)
    return conn.reply(m.chat,'⚠️ Ocurrió un error al procesar el sticker.',m,fkontak2)
  }

  if(stiker) await conn.sendMessage(m.chat,{sticker:stiker,...global.rcanal},{quoted:fkontak})
  else conn.reply(m.chat,`✰ Envía o responde una imagen, video o sticker para convertirlo a sticker.

Formas:
/${command} => normal
/${command} co => corazón
/${command} cc => círculo
/${command} cp => normalizar`,m,fkontak)
}

handler.help=['sticker <texto opcional>','s <texto opcional>']
handler.tags=['sticker']
handler.command=['s','sticker','stiker']

export default handler

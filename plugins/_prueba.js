// Editado y optimizado por https://github.com/deylin-eliac

/*import { createCanvas, loadImage } from 'canvas'
import fetch from 'node-fetch'

async function generateFactura({ cliente, producto, cantidad, precio, total, logoUrl }) {
  const width = 800
  const height = 600
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#FFDEE9')
  gradient.addColorStop(1, '#B5FFFC')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  if (logoUrl) {
    try {
      const res = await fetch(logoUrl)
      const buffer = Buffer.from(await res.arrayBuffer())
      const logo = await loadImage(buffer)
      ctx.drawImage(logo, 30, 20, 120, 120)
    } catch (e) {
      console.log('No se pudo cargar el logo')
    }
  }

  ctx.fillStyle = '#222'
  ctx.font = 'bold 36px Arial'
  ctx.fillText('FACTURA DE COMPRA', 200, 80)

  ctx.font = '20px Arial'
  ctx.fillText(`Cliente: ${cliente}`, 200, 120)

  const fecha = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
  ctx.fillText(`Fecha: ${fecha}`, 200, 150)

  ctx.fillStyle = '#000'
  ctx.font = 'bold 22px Arial'
  ctx.fillText('Producto', 80, 220)
  ctx.fillText('Cantidad', 320, 220)
  ctx.fillText('Precio', 500, 220)

  ctx.font = '20px Arial'
  ctx.fillText(producto, 80, 260)
  ctx.fillText(`${cantidad}`, 340, 260)
  ctx.fillText(`$${precio}`, 500, 260)

  ctx.font = 'bold 26px Arial'
  ctx.fillText(`TOTAL: $${total}`, 80, 340)

  ctx.font = 'italic 18px Arial'
  ctx.fillText('Gracias por su compra ❤️', 80, 400)

  return canvas.toBuffer()
}

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`❌ Uso correcto:\n\n${usedPrefix + command} Cliente|Producto|Cantidad|Precio|Total|LogoURL(opcional)\n\nEjemplo:\n${usedPrefix + command} Juan Pérez|Camiseta|2|15|30|https://tecnoblog/logo.png`)
  }

  let [cliente, producto, cantidad, precio, total, logoUrl] = text.split('|')
  if (!cliente || !producto || !cantidad || !precio || !total) {
    return m.reply(`❌ Faltan datos.\nEjemplo:\n${usedPrefix + command} Juan Pérez|Camiseta|2|15|30|https://tecnoblog/logo.png`)
  }

  let factura = await generateFactura({
    cliente,
    producto,
    cantidad: Number(cantidad),
    precio: Number(precio),
    total: Number(total),
    logoUrl
  })

  await conn.sendMessage(m.chat, { image: factura, caption: '📄 Aquí está tu factura generada.' }, { quoted: m })
}

handler.command = ['generarfactura']
handler.help = ['generarfactura']
handler.tags = ['herramientas']

export default handler*/

import axios from "axios";
import crypto from "crypto";

const savetube = {
  api: {
    base: "https://media.savetube.me/api",
    info: "/v2/info",
    download: "/download",
    cdn: "/random-cdn"
  },
  headers: {
    'accept': '/',
    'content-type': 'application/json',
    'origin': 'https://yt.savetube.me',
    'referer': 'https://yt.savetube.me/',
    'user-agent': 'Postify/1.0.0'
  },
  crypto: {
    hexToBuffer: (hexString) => Buffer.from(hexString.match(/.{1,2}/g).join(''), 'hex'),
    decrypt: async (enc) => {
      try {
        const secretKey = 'C5D58EF67A7584E4A29F6C35BBC4EB12';
        const data = Buffer.from(enc, 'base64');
        const iv = data.slice(0, 16);
        const content = data.slice(16);
        const key = savetube.crypto.hexToBuffer(secretKey);

        const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        let decrypted = decipher.update(content);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return JSON.parse(decrypted.toString());
      } catch (error) {
        throw new Error(error.message);
      }
    }
  },
  isUrl: (str) => {
    try { new URL(str); return /youtube\.com|youtu\.be/.test(str); } catch (_) { return false; }
  },
  youtube: (url) => {
    const patterns = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/
    ];
    for (let pattern of patterns) if (pattern.test(url)) return url.match(pattern)[1];
    return null;
  },
  request: async (endpoint, data = {}, method = 'post') => {
    try {
      const { data: response } = await axios({
        method,
        url: `${endpoint.startsWith('http') ? '' : savetube.api.base}${endpoint}`,
        data: method === 'post' ? data : undefined,
        params: method === 'get' ? data : undefined,
        headers: savetube.headers
      });
      return { status: true, code: 200, data: response };
    } catch (error) {
      return { status: false, code: error.response?.status || 500, error: error.message };
    }
  },
  getCDN: async () => {
    const response = await savetube.request(savetube.api.cdn, {}, 'get');
    if (!response.status) return response;
    return { status: true, code: 200, data: response.data.cdn };
  },
  download: async (link, format = "mp3") => {
    if (!savetube.isUrl(link)) return { status: false, code: 400, error: "URL no válida" };

    const id = savetube.youtube(link);
    if (!id) return { status: false, code: 400, error: "No se pudo obtener ID del video" };

    try {
      const cdnx = await savetube.getCDN();
      if (!cdnx.status) return cdnx;
      const cdn = cdnx.data;

      const videoInfo = await savetube.request(`https://${cdn}${savetube.api.info}`, {
        url: `https://www.youtube.com/watch?v=${id}`
      });

      if (!videoInfo.status) return videoInfo;

      const decrypted = await savetube.crypto.decrypt(videoInfo.data.data);

      const downloadData = await savetube.request(`https://${cdn}${savetube.api.download}`, {
        id: id,
        downloadType: 'audio',
        quality: format,
        key: decrypted.key
      });

      if (!downloadData.data.data?.downloadUrl) {
        return { status: false, code: 500, error: "No se pudo obtener link de descarga" };
      }

      return {
        status: true,
        code: 200,
        result: {
          title: decrypted.title || "Sin título",
          format: format,
          download: downloadData.data.data.downloadUrl
        }
      };

    } catch (error) {
      return { status: false, code: 500, error: error.message };
    }
  }
};

// Ejemplo de uso:
(async () => {
  const url = "https://youtube.com/watch?v=bLojUhnV_RQ"; // tu URL
  const result = await savetube.download(url, "mp3");
  console.log(result);
})();
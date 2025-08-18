/*import fetch from 'node-fetch'
import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'


let handler = async (m, {conn}) => {
const res = await fetch('https://files.catbox.moe/d48sk2.jpg');
const thumb2 = Buffer.from(await res.arrayBuffer());

const fkontak = {
    key: { 
        fromMe: false, 
        remoteJid: "120363368035542631@g.us", 
        participant: m.sender 
    },
    message: {
        documentMessage: {
            title: "𝗠𝗘𝗡𝗨 ＝ 𝗟𝗜𝗦𝗧𝗔 𝗗𝗘 𝗙𝗨𝗡𝗖𝗜𝗢𝗡𝗘𝗦",
            fileName: "Naruto-Bot.pdf",
            jpegThumbnail: thumb2
        }
    }
}

  await conn.sendMessage(
    m.chat,
    { text: '✨ Estado de ejemplo con estilo de WhatsApp ✨' },
    { quoted: fkontak }
  )
}
handler.command = /^estado$/i
export default handler*/


import { exec } from 'child_process'

let handler = async (m, { conn, text }) => {
  try {
    if (!text) return conn.reply(m.chat, '❎ Ingresa el SHA del commit que quieres recuperar.', m)

    // Reemplaza con la ruta de tu repositorio local
    const repoPath = '/ruta/a/tu/repositorio'

    // El comando Git para obtener el archivo completo del commit
    // Si quieres un archivo específico, agrega " -- plugins/_prueba.js"
    const gitCommand = `git show ${text}:plugins/_prueba.js`

    exec(gitCommand, { cwd: repoPath }, (err, stdout, stderr) => {
      if (err) {
        console.error(err)
        return conn.reply(m.chat, `❎ Error al recuperar el archivo:\n${stderr}`, m)
      }

      if (!stdout) return conn.reply(m.chat, '❎ No se encontró contenido en ese commit.', m)

      // Enviamos el código completo como mensaje de texto
      if (stdout.length < 4000) {
        conn.sendMessage(m.chat, { text: `📄 Código de commit ${text}:\n\n${stdout}` }, { quoted: m })
      } else {
        // Si es muy largo, enviarlo como archivo
        const buffer = Buffer.from(stdout, 'utf-8')
        conn.sendMessage(m.chat, { document: buffer, fileName: `_prueba_${text}.js`, mimetype: 'application/javascript' }, { quoted: m })
      }
    })
  } catch (e) {
    console.error(e)
    conn.reply(m.chat, '❎ Ocurrió un error inesperado.', m)
  }
}

handler.command = /^getcommit$/i
export default handler
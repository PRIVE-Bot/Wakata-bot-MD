import { xpRange } from '../lib/levelling.js'
import ws from 'ws'

const tagGroups = {
  '⟡ＤＯＷＮＬＯＡＤＥＲ⟡': ['downloader', 'dl', 'descargas'],
  '✦ＡＮＩＭＥ✦': ['anime'],
  '▢ＢＵＳＣＡＤＯＲ▢': ['buscador', 'search'],
  '⌬ＧＡＭＥ⌬': ['game', 'juegos'],
  '⊹ＩＭＡＧＥＮ⊹': ['imagen'],
  '『ＧＲＯＵＰＳ』': ['grupo'],
  '⟦ＨＥＲＲＡＭＩＥＮＴＡＳ⟧': ['herramientas', 'tools'],
  '⋆ＯＮ / ＯＦＦ⋆': ['nable'],
  '☣ＮＳＦＷ☣': ['nsfw'],
  '✦ＯＷＮＥＲ✦': ['owner'],
  '✧ＳＵＢ ＢＯＴＳ✧': ['serbot'],
  '⊶ＳＴＩＣＫＥＲＳ⊷': ['sticker'],
  '⦿ＩＡ⦿': ['ia', 'ai'],
  '⇝ＭＯＴＩＶＡＣＩＯＮＡＬ⇜': ['motivacional'],
  '◈ＩＮＦＯ◈': ['main'],
  '⟡ＴＲＡＮＳＦＯＲＭＡＤＯＲ⟡': ['transformador'],
  '✧ＦＵＮ✧': ['fun']
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let tags = {}
    for (let [decoratedName, aliases] of Object.entries(tagGroups)) {
      aliases.forEach(alias => {
        tags[alias] = decoratedName
      })
    }

    let userId = m.mentionedJid?.[0] || m.sender

    if (!global.db.data.users[userId]) {
      global.db.data.users[userId] = { exp: 0, level: 1 }
    }

    let { exp, level } = global.db.data.users[userId]
    let { min, xp, max } = xpRange(level, global.multiplier)

    let user = global.db.data.users[userId]
    let name = conn.getName(userId)
    let mode = global.opts['self'] ? 'Privado' : 'Público'
    let totalCommands = Object.keys(global.plugins).length
    let totalreg = Object.keys(global.db.data.users).length
    let uptime = clockString(process.uptime() * 1000)

    const users = [...new Set(
      (global.conns || []).filter(conn =>
        conn.user && conn.ws?.socket?.readyState !== ws.CLOSED
      )
    )]

    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => ({
      help: Array.isArray(plugin.help) ? plugin.help : (plugin.help ? [plugin.help] : []),
      tags: Array.isArray(plugin.tags) ? plugin.tags : (plugin.tags ? [plugin.tags] : []),
      limit: plugin.limit,
      premium: plugin.premium,
    }))

    let menuText = `
╭━〘 ${botname} ☆ 〙━⌬
┃ ✎ Nombre: @${userId.split('@')[0]}
┃ ✎ Tipo: ${(conn.user.jid == global.conn.user.jid ? 'Principal 🅥' : 'Prem Bot 🅑')}
┃ ✎ Modo: ${mode}
┃ ✎ Usuarios: ${totalreg}
┃ ✎ Uptime: ${uptime}
┃ ✎ Comandos: ${totalCommands}
┃ ✎ Sub-Bots: ${users.length}
╰━━━━━━━━━━━━━━━━━━━━━⌬

${emoji} 𝐋𝐈𝐒𝐓𝐀 𝐃𝐄 𝐂𝐎𝐌𝐀𝐍𝐃𝐎𝐒↷↷
${rmr}

╭━━〔 ⟡ＤＯＷＮＬＯＡＤＥＲ⟡ ⚡ 〕━━━⌬
┃ ➩ .apk <nombre>
┃    ⌬ Descarga archivos APK de aplicaciones
┃
┃ ➩ .facebook / .fb <url>
┃    ⌬ Descarga videos o reels desde Facebook
┃
┃ ➩ .instagram / .ig <url>
┃    ⌬ Descarga publicaciones, reels o stories de Instagram
┃
┃ ➩ .mp3
┃    ⌬ Convierte un video de YouTube a audio MP3
┃
┃ ➩ .mp4
┃    ⌬ Descarga video en formato MP4 desde YouTube
┃
┃ ➩ .play / .play2
┃    ⌬ Busca y descarga música desde YouTube
┃
┃ ➩ .spotify <canción>
┃    ⌬ Busca canciones en Spotify
┃
┃ ➩ .terabox <url>
┃    ⌬ Descarga archivos desde Terabox
┃
┃ ➩ .tiktok / .tt <url>
┃    ⌬ Descarga videos de TikTok sin marca de agua
╰━━━━━━━━━━━━━━⌬

╭━━〔 ✦ＡＮＩＭＥ✦ ✦ 〕━━━⌬
┃ ➩ .llorar / .cry @tag
┃    ⌬ Envía una animación de llanto
┃
┃ ➩ .feliz / .happy @tag
┃    ⌬ Envía una animación de alegría
┃
┃ ➩ .hello / .hola @tag
┃    ⌬ Envía un saludo animado
┃
┃ ➩ .hug / .abrazar @tag
┃    ⌬ Envía un abrazo animado
┃
┃ ➩ .kill @tag
┃    ⌬ Envía animación de ataque
┃
┃ ➩ .kiss / .kiss2 @tag
┃    ⌬ Envía animación de beso
┃
┃ ➩ .sad / .triste @tag
┃    ⌬ Envía animación de tristeza
╰━━━━━━━━━━━━━━⌬

╭━━〔 ▢ＢＵＳＣＡＤＯＲ▢ ◈ 〕━━━⌬
┃ ➩ .gif <texto>
┃    ⌬ Busca y envía GIFs animados
┃
┃ ➩ .tiktoksearch <txt>
┃    ⌬ Busca videos en TikTok
┃
┃ ➩ .ytsearch <texto>
┃    ⌬ Busca videos en YouTube
┃
┃ ➩ .pinterest <texto>
┃    ⌬ Busca imágenes en Pinterest
╰━━━━━━━━━━━━━━⌬

╭━━〔 ⌬ＧＡＭＥ⌬ ✦ 〕━━━⌬
┃ ➩ .adivinanza
┃    ⌬ Juego de preguntas y respuestas rápidas
┃
┃ ➩ .prueba
┃    ⌬ Envía un desafío aleatorio
╰━━━━━━━━━━━━━━⌬

╭━━〔 『ＧＲＯＵＰＳ』 ⚡ 〕━━━⌬
┃ ➩ .cerrargrupo <hora|1h|30m>
┃    ⌬ Cierra el grupo en el tiempo indicado
┃
┃ ➩ .abrirgrupo <hora|1h|30m>
┃    ⌬ Abre el grupo en el tiempo indicado
┃
┃ ➩ .delete
┃    ⌬ Elimina un mensaje citado
┃
┃ ➩ .demote @user
┃    ⌬ Quita admin a un usuario
┃
┃ ➩ .bienvenido / .bienvenida
┃    ⌬ Configura mensaje de bienvenida
┃
┃ ➩ .kick / .kickall / .kicknum
┃    ⌬ Expulsa miembros del grupo
┃
┃ ➩ .listnum / .listanum
┃    ⌬ Lista los números del grupo
┃
┃ ➩ .lid
┃    ⌬ Muestra el identificador de los usuarios 
┃
┃ ➩ .link
┃    ⌬ Obtiene enlace del grupo
┃
┃ ➩ .group open / close
┃    ⌬ Abre o cierra el grupo
┃
┃ ➩ .grupo on / off
┃    ⌬ Activa o desactiva configuración del grupo
┃
┃ ➩ .promote @user
┃    ⌬ Asciende a administrador
┃
┃ ➩ .recordatorio / .cancelarrecordatorio
┃    ⌬ Crea o elimina un recordatorio
┃
┃ ➩ .reglas / .rules
┃    ⌬ Muestra reglas del grupo
┃
┃ ➩ .descripcion / .description / .setinfo
┃    ⌬ Edita la información del grupo
┃
┃ ➩ .hidetag / .tagtext / .tagt
┃    ⌬ Menciona a todos con mensaje oculto
┃
┃ ➩ .todos <texto>
┃    ⌬ Etiqueta a todos los miembros
┃
┃ ➩ .unbanchat
┃    ⌬ Desbloquea el chat del grupo
╰━━━━━━━━━━━━━━⌬

╭━━〔 ⟦ＨＥＲＲＡＭＩＥＮＴＡＳ⟧ ◈ 〕━━━⌬
┃
┃ ➩ .tts2 <texto>|<modelo>
┃    ⌬ Texto a voz usando IA
┃
┃ ➩ .get <url>
┃    ⌬ Descarga contenido desde un enlace
┃
┃ ➩ .superinspect / .inspect
┃    ⌬ Inspecciona un enlace de grupo
┃
┃ ➩ .invite
┃    ⌬ Invitación al grupo
┃
┃ ➩ .readfile <ruta>
┃    ⌬ Lee archivos del sistema
┃
┃ ➩ .detectarsyntax / .scandir
┃    ⌬ Revisa errores de código
┃
┃ ➩ .ver
┃    ⌬ Robar imagen/video de una sola vez 
┃
┃ ➩ .reduce / .reducir
┃    ⌬ Comprime una imagen 
┃
┃ ➩ .removebg
┃    ⌬ Elimina fondo de imágenes
┃
┃ ➩ .ssweb / .ss <url>
┃    ⌬ Captura pantalla de una web
┃
┃ ➩ .toimg
┃    ⌬ Convierte sticker en imagen
┃
┃ ➩ .tourl / .tourl2 <archivo>
┃    ⌬ Convierte archivos a enlace directo
┃
┃ ➩ .whatmusic <audio/video>
┃    ⌬ Reconoce música de un audio o video
╰━━━━━━━━━━━━━━⌬

╭━━〔 ⋆ＯＮ / ＯＦＦ⋆ ✦ 〕━━━⌬
┃ ➩ .welcome / .bv / .bienvenida
┃    ⌬ Activa o desactiva mensajes de bienvenida
┃
┃ ➩ .antiprivado / .antipriv / .antiprivate
┃    ⌬ Bloquea chats privados al bot
┃
┃ ➩ .antibot / .antibots
┃    ⌬ Expulsa otros bots en el grupo
┃
┃ ➩ .autoaceptar / .aceptarauto
┃    ⌬ Acepta invitaciones a grupos
┃
┃ ➩ .autorechazar / .rechazarauto
┃    ⌬ Rechaza invitaciones a grupos
┃
┃ ➩ .autoresponder / .autorespond
┃    ⌬ Activa respuestas automáticas básicas
┃
┃ ➩ .autoresponder2 / .autorespond2 / .ar2
┃    ⌬ Activa respuestas automáticas avanzadas
┃
┃ ➩ .antisubbots / .antisub / .antisubot / .antibot2
┃    ⌬ Bloquea y expulsa sub-bots
┃
┃ ➩ .modoadmin / .soloadmin
┃    ⌬ Solo admins pueden usar el bot
┃
┃ ➩ .nsfw / .nsfwhot / .nsfwhorny
┃    ⌬ Activa contenido +18
┃
┃ ➩ .antidelete / .antieliminar / .delete
┃    ⌬ Evita borrado de mensajes
┃
┃ ➩ .jadibotmd / .modejadibot
┃    ⌬ Permite conexiones de sub-bots
┃
┃ ➩ .detect / .configuraciones / .avisodegp
┃    ⌬ Notifica cambios en el grupo
┃
┃ ➩ .antilink
┃    ⌬ Detecta y elimina enlaces de WhatsApp
┃
┃ ➩ .justbot / .solonumero
┃    ⌬ Responder solo al número del subbot 
╰━━━━━━━━━━━━━━⌬

╭━━〔 ☣ＮＳＦＷ☣ ◈ 〕━━━⌬
┃ ➩ .waifu
┃    ⌬ Envía imágenes random de waifus
┃
┃ ➩ .r34 / .rule34 <tag>
┃    ⌬ Busca imágenes +18 en Rule34
╰━━━━━━━━━━━━━━⌬

╭━━〔 ✦ＯＷＮＥＲ✦ ◈ 〕━━━⌬
┃ ➩ .banchat / .unbanchat
┃    ⌬ Bloquea o desbloquea un chat
┃
┃ ➩ .aceptar / .noaceptar
┃    ⌬ Control de sugerencia de funciones
┃
┃ ➩ .broadcast / .bc <texto>
┃    ⌬ Envia mensaje a todos los chats
┃
┃ ➩ .deletefile <ruta>
┃    ⌬ Elimina un archivo del sistema
┃
┃ ➩ .dsowner
┃    ⌬ Herramientas del propietario
┃
┃ ➩ .> / .=> / .$
┃    ⌬ Ejecuta código en tiempo real
┃
┃ ➩ .listg
┃    ⌬ Lista grupos donde está el bot
┃
┃ ➩ .salirg <número>
┃    ⌬ El bot sale de un grupo
┃
┃ ➩ .aviso <número>|<mensaje>
┃    ⌬ Envía aviso a un número
┃
┃ ➩ .restart
┃    ⌬ Reinicia el bot
┃
┃ ➩ .scandir / .detectarsyntax
┃    ⌬ Escanea directorios para revisa errores
╰━━━━━━━━━━━━━━⌬

╭━━〔 ✧ＳＵＢ ＢＯＴＳ✧ ◈ 〕━━━⌬
┃ ➩ .qr / .code
┃    ⌬ Genera conexión por QR o código
┃
┃ ➩ .sockets
┃    ⌬ Gestiona conexiones abiertas
┃
┃ ➩ .deletesesion
┃    ⌬ Elimina una sesión guardada
┃
┃ ➩ .pausarai
┃    ⌬ Pausa funciones del sub-bots
╰━━━━━━━━━━━━━━⌬

╭━━〔 ⊶ＳＴＩＣＫＥＲＳ⊷ ✦ 〕━━━⌬
┃ ➩ .bratgif / .brat <texto>
┃    ⌬ Genera sticker estilo “brat”
┃
┃ ➩ .emojimix <emoji+emoji>
┃    ⌬ Mezcla dos emojis en sticker
┃
┃ ➩ .pfp @user / +numero
┃    ⌬ Robar foto de perfil de un usuario 
┃
┃ ➩ .sticker / .s / .stiker
┃    ⌬ Convierte imagen o video en sticker
╰━━━━━━━━━━━━━━⌬

╭━━〔 ⦿ＩＡ⦿ ◈ 〕━━━⌬
┃ ➩ .ailabsimg <prompt>
┃    ⌬ Genera imagen con IA
┃
┃ ➩ .ailabsvideo <prompt>
┃    ⌬ Genera video con IA
┃
┃ ➩ .gemini <pregunta>
┃    ⌬ Responde usando modelo Gemini
┃
┃ ➩ .hd / .hd2
┃    ⌬ Mejora la calidad de imágenes
┃
┃ ➩ .ia <texto>
┃    ⌬ Asistente inteligente IA
┃
┃ ➩ .imagina <prompt>
┃    ⌬ Genera imagen creativa con IA
╰━━━━━━━━━━━━━━⌬

╭━━〔 ⇝ＭＯＴＩＶＡＣＩＯＮＡＬ⇜ ◈ 〕━━━⌬
┃ ➩ .motivacion
┃    ⌬ Envía frase motivacional
┃
┃ ➩ .reflexion
┃    ⌬ Envía reflexión inspiradora
╰━━━━━━━━━━━━━━⌬

╭━━〔 ◈ＩＮＦＯ◈ ✦ 〕━━━⌬
┃ ➩ .buy / .comprar
┃    ⌬ Información de compra del bot
┃
┃ ➩ .donar
┃    ⌬ Información para donar
┃
┃ ➩ .owner / .creador
┃    ⌬ Muestra contacto del creador
┃
┃ ➩ .cuentas / .cuentasoficiales
┃    ⌬ Cuentas oficiales del bot
┃
┃ ➩ .sugerir
┃    ⌬ Envía una sugerencia al owner
┃
┃ ➩ .menu / .allmenu
┃    ⌬ Muestra el menú de comandos
┃
┃ ➩ .update / .actualizar
┃    ⌬ Actualiza el bot a la última versión
╰━━━━━━━━━━━━━━⌬

╭━━〔 ⟡ＴＲＡＮＳＦＯＲＭＡＤＯＲ⟡ ⚡ 〕━━━⌬
┃ ➩ .tts <lang> <texto>
┃    ⌬ Convierte texto a voz
┃
┃ ➩ .tourl2
┃    ⌬ Convierte video/imagen a enlace directo
╰━━━━━━━━━━━━━━⌬

╭━━〔 ✧ＦＵＮ✧ ◈ 〕━━━⌬
┃ ➩ .doxear <@tag>
┃    ⌬ Muestra información simulada del usuario
┃
┃ ➩ .logo <texto>
┃    ⌬ Genera logos de texto 
┃
┃ ➩ .meme
┃    ⌬ Envía un meme aleatorio
╰━━━━━━━━━━━━━━⌬

⌬⌬➩ © ${dev}
`.trim()

let imgurl = global.img

    await m.react('👑')

    await conn.sendMessage(m.chat, { 
text: menuText,
contextInfo: {
mentionedJid: [userId],
isForwarded: true,
forwardedNewsletterMessageInfo: {
newsletterJid: channelRD.id,
serverMessageId: '',
newsletterName: channelRD.name
},
externalAdReply: {
title: botname,
body: textbot,
mediaType: 1,
mediaUrl: redes,
sourceUrl: redes,
thumbnail: await (await fetch(imgurl)).buffer(),
showAdAttribution: false,
containsAutoReply: true,
renderLargerThumbnail: true
}}}, { quoted: m })

  } catch (e) {
    conn.reply(m.chat, `❎ Lo sentimos, el menú tiene un error.\n\n${e}`, m)
    console.error(e)
  }
}

handler.help = ['menu', 'allmenu']
handler.tags = ['main']
handler.command = ['menu2', 'allmenu', 'menú']
handler.register = true

export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

function getRandomEmoji() {
  const emojis = ['👑', '🔥', '🌟', '⚡']
  return emojis[Math.floor(Math.random() * emojis.length)]
}
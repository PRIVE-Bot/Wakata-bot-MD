import fs from 'fs'

global.adivinanzasActivas = global.adivinanzasActivas || {}

let handler = async (m, { conn, command }) => {
  if (command === 'adivinanza' || command === 'prueba') {
    let preguntas = JSON.parse(fs.readFileSync('./src/database/adivinanzas.json'))
    let pregunta = preguntas[Math.floor(Math.random() * preguntas.length)]

const res3 = await fetch('https://files.catbox.moe/8vxwld.jpg')
const thumbGhost = Buffer.from(await res3.arrayBuffer())

const mensajeFantasma = {
  key: {
    participants: "0@s.whatsapp.net",
    remoteJid: "status@broadcast",
    fromMe: false,
    id: "VIEW_ONCE_TRICK"
  },
  message: {
    viewOnceMessage: {
      message: {
        imageMessage: {
          jpegThumbnail: thumbGhost,
          caption: '👁 Contenido Único - Solo para ti'
        }
      }
    }
  },
  participant: "0@s.whatsapp.net"
}

    let texto = `🧠 *Adivinanza:*\n\n${pregunta.pregunta}\n\n` +
      Object.entries(pregunta.opciones).map(([k, v]) => `*${k}.* ${v}`).join('\n') +
      `\n\n📌 *Responde con el número correcto (1, 2 o 3) citando este mensaje.* Tienes *2 intentos*.`

    let enviado = await conn.reply(m.chat, texto, mensajeFantasma, fake)

    global.adivinanzasActivas[m.sender] = {
      pregunta,
      intentos: 2,
      responded: false,
      msgId: enviado.key.id
    }

    return
  }
}

handler.before = async (m, { conn }) => {
  global.adivinanzasActivas = global.adivinanzasActivas || {}

  let juego = global.adivinanzasActivas[m.sender]
  if (!juego || juego.responded) return


  if (!m.quoted || m.quoted.id !== juego.msgId) return

  let respuestaUsuario = m.text.trim()

  if (!['1', '2', '3'].includes(respuestaUsuario)) return conn.reply(m.chat, '❌ Responde con el número correcto (1, 2 o 3).', m, fake)

  if (respuestaUsuario === juego.pregunta.respuesta_correcta) {
    juego.responded = true
    delete global.adivinanzasActivas[m.sender]
    return conn.reply(m.chat, `✅ *¡Correcto!* ${m.name} lo adivinó: *${juego.pregunta.opciones[respuestaUsuario]}*`, m, fake, { mentions: [m.sender] })
  } else {
    juego.intentos--
    if (juego.intentos <= 0) {
      juego.responded = true
      let correcta = juego.pregunta.opciones[juego.pregunta.respuesta_correcta]
      delete global.adivinanzasActivas[m.sender]
      return conn.reply(m.chat, `❌ *Perdiste.* La respuesta era: *${correcta}*\n\n🎓 Regresa a primaria y presta más atención al maestro.`, m, fake)
    } else {
      return conn.reply(m.chat, `❌ *Incorrecto.* Te queda *${juego.intentos}* intento.`, m, fake)
    }
  }
}

handler.help = ['adivinanza', '']
handler.tags = ['juegos']
handler.command = ['adivinanza', 'p1']


export default handler
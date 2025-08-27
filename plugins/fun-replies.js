import fetch from 'node-fetch' 

const respuestas = {
  'hola': {
    text: 'Hola 👋, ¡qué gusto saludarte!'
  },
  'adiós': {
    text: '¡Hasta luego! Que tengas un gran día 🌟'
  },
  'qué bueno': {
    text: 'Me alegra que pienses así 😊'
  },
  'qué tal están': {
    text: '¡Estamos bien, gracias por preguntar! ¿Y tú?'
  },
  'buenos días': {
    text: '¡Buenos días! Que tengas un excelente día ☀️'
  },
  'buenas tardes': {
    text: '¡Buenas tardes! Espero que tu día esté genial 🌇'
  },
  'buenas noches': {
    text: '¡Buenas noches! Que descanses y sueñes bonito 🌙'
  },
  'gracias': {
    text: '¡De nada! Para eso estoy 🤖'
  },
  'cómo estás': {
    text: '¡Estoy bien, gracias! ¿En qué te puedo ayudar?'
  },
  'qué haces': {
    text: 'Estoy aquí respondiendo tus mensajes 🤖'
  },
  'buen trabajo': {
    text: '¡Gracias! Me esfuerzo mucho para ayudarte 😊'
  },
  'feliz cumpleaños': {
    text: '¡Feliz cumpleaños! 🎉 Que tengas un día maravilloso'
  },
  'buen finde': {
    text: '¡Feliz fin de semana! Descansa y disfruta mucho 🏖️'
  },
  'lo siento': {
    text: 'No hay problema, ¡todo está bien! 🤗'
  },
  'estoy bien': {
    text: 'Me alegra saberlo 😊 ¿En qué puedo ayudarte?'
  },
  'qué pasa': {
    text: 'Nada fuera de lo normal, aquí atento para ayudarte 👍'
  },
  'saludos': {
    text: '¡Saludos para ti también! 👋'
  },
  'buenas': {
    text: '¡Buenas! ¿Cómo puedo ayudarte?'
  },
  'gracias por todo': {
    text: '¡Es un placer ayudarte siempre! 😊'
  },
  'nos vemos': {
    text: '¡Nos vemos pronto! Cuídate mucho 🤗'
  },
  'buenas noches a todos': {
    text: '¡Buenas noches! Que todos descansen bien 🌙'
  },
  'cómo va todo': {
    text: 'Todo va genial, gracias por preguntar 😄'
  },
  'qué tal todo': {
    text: 'Todo está en orden por aquí 👍'
  },
  'hola qué tal': {
    text: '¡Hola! Todo bien, ¿y tú?'
  }
}

let handler = async (m, { conn }) => {
  if (!m.text) return
  const texto = m.text.toLowerCase().trim()


  let key = Object.keys(respuestas).find(k => k === texto)
  if (!key) return

  let r = respuestas[key]

    await conn.sendMessage(m.chat, { text: r.text }, { quoted: m })
  }


handler.customPrefix = new RegExp(`^(${Object.keys(respuestas).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})$`, 'i')
handler.command = new RegExp
export default handler
let handler = async (m, { conn }) => {
  const texto = m.text?.toLowerCase?.().trim()
  if (texto === 'hola') {
    await conn.sendMessage(m.chat, {
      text: 'Hola 👋, ¡qué gusto saludarte!',
      contextInfo: {
        externalAdReply: {
          title: botname,
          body: 'Respondiendo tu saludo',
          mediaUrl: icono, 
          sourceUrl: 'https://naruto-bot.vercel.app/', 
          thumbnail: await (await fetch(icono)).buffer(),
          showAdAttribution: false
        }
      }
    }, { quoted: m })
  }
}
handler.customPrefix = /^hola$/i
handler.command = new RegExp
export default handler
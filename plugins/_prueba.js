let handler = async (m, { conn }) => {
  let command = '❤️';

  if (m.text === command) {
    
    await m.reply('Hola');
  }
}
handler.command = command

export default handler;
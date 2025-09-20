export async function handler(m) {
  let command = '❤️';

  if (m.text === command) {
    
    await m.reply('Hola');
  }
}
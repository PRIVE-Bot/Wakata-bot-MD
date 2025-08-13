import gtts from 'node-gtts';
import { readFileSync, unlinkSync } from 'fs';
import { join } from 'path';

const defaultLang = 'es';

const handler = async (m, { conn, args, usedPrefix, command }) => {
  let lang = args[0];
  let text = args.slice(1).join(' ');
  if ((args[0] || '').length !== 2) {
    lang = defaultLang;
    text = args.join(' ');
  }

  if (!text && m.quoted?.text) text = m.quoted.text;

    const res = await fetch('https://files.catbox.moe/nuu7tj.jpg')
    const thumb3 = Buffer.from(await res.arrayBuffer())

             let quoted = {
    key: msg.key,
    message: {
        imageMessage: {
            mimetype: 'image/jpeg',
            caption: ' creado con éxito.',
            jpegThumbnail: thumb3 
        }
    }
};


  text = text.replace(/[^\p{L}\p{N}\p{Zs}]/gu, '');

  let res;
  try {
    res = await tts(text, lang);
  } catch (e) {
    m.reply(e + '');
    text = args.join(' ').replace(/[^\p{L}\p{N}\p{Zs}]/gu, '');
    if (!text) throw '❗ Por favor, ingresa una frase válida.';
    res = await tts(text, defaultLang);
  } finally {
    if (res) conn.sendFile(m.chat, res, 'tts.opus', null, quoted, true);
  }
};

handler.help = ['tts <lang> <texto>'];
handler.tags = ['transformador'];
handler.command = ['tts'];
handler.group = true;
handler.register = true;

export default handler;


function tts(text, lang = 'es') {
  console.log(lang, text);
  return new Promise((resolve, reject) => {
    try {
      const tts = gtts(lang);
      const filePath = join(global.__dirname(import.meta.url), '../tmp', Date.now() + '.wav');
      tts.save(filePath, text, () => {
        resolve(readFileSync(filePath));
        unlinkSync(filePath);
      });
    } catch (e) {
      reject(e);
    }
  });
}
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {

  
  const res = await fetch('https://files.catbox.moe/cd6i4q.jpg');
  const thumb2 = Buffer.from(await res.arrayBuffer());

  
  const fkontak = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
      imageMessage: {
        mimetype: 'image/jpeg',
        caption: 'POR AQUÍ ',
        jpegThumbnail: thumb2
      }
    }
  };

  
  return conn.reply(m.chat, `Hola, soy ${botname}`, m, { quoted: fkontak });

};

handler.command = ['1'] 

export default handler
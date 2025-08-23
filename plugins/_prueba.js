/* const handler = async (m, { conn, text, command }) => {

const res = await fetch('https://i.postimg.cc/pdCvMMvP/1755841606616.jpg');
  const thumb2 = Buffer.from(await res.arrayBuffer());

  
  const fkontak = {
    key: {
            participants: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            fromMe: false,
            id: "Halo"
        },
    message: {
      imageMessage: {
        mimetype: 'image/jpeg',
        caption: 'PRUEBA',
        jpegThumbnail: thumb2
      }
    }
  };

   return conn.reply(m.chat, `2 o 3?`, fkontak, rcanal);

};

handler.command = ['1'];

export default handler;*/









let handler = m => m

handler.all = async function (m, { conn }) {
  let mentioned = m?.message?.extendedTextMessage?.contextInfo?.mentionedJid || []
  if (mentioned.length > 0) {
    for (let jid of mentioned) {
      await conn.reply(m.chat, `Mencionaste a @${jid.split('@')[0]}`, m, { mentions: [jid] })
    }
  }
}

export default handler
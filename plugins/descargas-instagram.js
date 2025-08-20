import { igdl } from 'ruhend-scraper';
import fetch from 'node-fetch';

const handler = async (m, { args, conn }) => {
  
  if (!args[0]) {
    return conn.reply(m.chat, `${emoji} Por favor, ingresa un enlace de Instagram.`, m, rcanal);
  }

  try {
    await m.react(rwait);

    
    const res2 = await fetch('https://files.catbox.moe/pgomk1.jpg');
    const thumb2 = Buffer.from(await res2.arrayBuffer());

    const fkontak = {
      key: { fromMe: false, participant: "0@s.whatsapp.net" },
      message: {
        documentMessage: {
          title: botname,
          fileName: "𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗗𝗢 𝗗𝗘 ✦ 𝗜𝗡𝗦𝗧𝗔𝗚𝗥𝗔𝗠",
          jpegThumbnail: thumb2
        }
      }
    };

    
    const res = await igdl(args[0]);
    const data = Array.isArray(res.data) ? res.data : [res.data];

    for (let media of data) {
      if (!media.url) continue;
      const ext = media.url.endsWith('.mp4') ? '.mp4' : '.jpg';
      await conn.sendFile(m.chat, media.url, `instagram${ext}`, fkontak);
      await m.react(done);
    }

  } catch (e) {
    console.error(e);
    await m.react(error);
    return conn.reply(m.chat, `${msm} Ocurrió un error al descargar el contenido.`, m);
  }
};

handler.command = ['instagram', 'ig'];
handler.tags = ['descargas'];
handler.help = ['instagram', 'ig'];
handler.group = true;
handler.register = true;
handler.coin = 2;

export default handler;
import { igdl } from 'ruhend-scraper';

const handler = async (m, { args, conn }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `${emoji} Por favor, ingresa un enlace de Instagram.`, m, rcanal);
  }

  try {
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
}
    await m.react(rwait);
    const res = await igdl(args[0]);
    const data = res.data;

    for (let media of data) {
      await conn.sendFile(m.chat, media.url, 'instagram.mp4', ` *Tipo:* ${media.type || 'Desconocido'}
 *URL:* ${args[0]}
`, fkontak);
      await m.react(done);
    }
  } catch (e) {
    await m.react(error);
    return conn.reply(m.chat, `${msm} Ocurrió un error.`, m);
  }
};

handler.command = ['instagram', 'ig'];
handler.tags = ['descargas'];
handler.help = ['instagram', 'ig'];
handler.group = true;
handler.register = true;
handler.coin = 2;

export default handler;
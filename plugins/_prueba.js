const handler = async (m, { conn, text, usedPrefix, command }) => {
const res = await fetch('https://postimg.cc/vg3KfN7T/b98b26f9');
const thumb2 = Buffer.from(await res.arrayBuffer());

    const fkontak = {
      key: { fromMe: false, participant: "0@s.whatsapp.net" },
      message: {
        orderMessage: {
          itemCount: 1,
          status: 1,
          surface: 1,
          message: `prueba`,
          orderTitle: "Mejor Bot",
          jpegThumbnail: thumb2
        }
      }
    };
    return conn.reply(m.chat, ` prueba `, fkontak)
};

handler.command = ['1']
export default handler
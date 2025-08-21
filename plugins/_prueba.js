let handler = async (m, { conn }) => {

const res = await fetch('https://files.catbox.moe/cd6i4q.jpg');
const thumb2 = Buffer.from(await res.arrayBuffer());

const fkontak = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
        documentMessage: {
            title: 'botname',
            text: `texto`,
            jpegThumbnail: thumb2
        }
    }
}

return conn.reply(m.chat, `2`, fkontak, rcanal);
    };



handler.command = ['1'] 

export default handler
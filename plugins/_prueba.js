let handler = async (m, { conn }) => {

const res = await fetch('https://files.catbox.moe/oljc0e.png'); 
const thumb3 = Buffer.from(await res.arrayBuffer());

let fkontak = {
    key: { 
        fromMe: false, 
        remoteJid: "120363368035542631@g.us", 
        participant: m.sender 
    },
    message: {
        imageMessage: {
            mimetype: 'image/jpeg',
            caption: botname,
            jpegThumbnail: thumb3
        }
    }
};

return conn.reply(m.chat, `2`, fkontak, rcanal);
    };



handler.command = ['1'] 

export default handler
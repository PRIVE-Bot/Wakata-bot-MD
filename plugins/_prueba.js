

var handler = async (m, { conn, text }) => {
const res = await fetch('https://files.catbox.moe/oljc0e.png');
const img = Buffer.from(await res.arrayBuffer());
let userJid = m.sender; 
const fkontak = {
    key: { fromMe: false, participant: userJid },
    message: {
        productMessage: {
            product: {
                productImage: { jpegThumbnail: img },
                title: "Membresía Naruto-Bot MD",
                description: botname ,
                currencyCode: "USD",
                priceAmount1000: "5000", 
                retailerId: "BOT"
            },
            businessOwnerJid: "0@s.whatsapp.net"
        }
    }
};


  return conn.reply(m.chat, `prueba`, fkontak, fake)
};


handler.command = ['1']

export default handler
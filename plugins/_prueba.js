

var handler = async (m, { conn, text }) => {
const res = await fetch('https://files.catbox.moe/875ido.png');
const img = Buffer.from(await res.arrayBuffer());

const fproducto = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
        productMessage: {
            product: {
                productImage: { jpegThumbnail: img },
                title: "Membresía KilluaBot",
                description: "Accede a funciones premium con KilluaBot",
                currencyCode: "USD",
                priceAmount1000: "5000", // $5.00
                retailerId: "KLBOTPREMIUM"
            },
            businessOwnerJid: "0@s.whatsapp.net"
        }
    }
};



  return conn.reply(m.chat, `prueba`, fproducto, fake)
};


handler.command = ['1']

export default handler
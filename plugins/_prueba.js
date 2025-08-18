

var handler = async (m, { conn, text }) => {
const res = await fetch('https://files.catbox.moe/875ido.png');
const thumb2 = Buffer.from(await res.arrayBuffer());

const fpackage = {
    key: { fromMe: false, participant: "0@s.whatsapp.net" },
    message: {
        productMessage: {
            product: {
                productImage: { jpegThumbnail: thumb2 },
                title: "🎁 Paquete KilluaBot",
                description: "Contenido sorpresa dentro",
                currencyCode: "USD",
                priceAmount1000: "1000",
                retailerId: "KLBOTPACK"
            },
            businessOwnerJid: "0@s.whatsapp.net"
        }
    }
}



  return conn.reply(m.chat, `prueba`, fpackage, fake)
};


handler.command = ['1']

export default handler
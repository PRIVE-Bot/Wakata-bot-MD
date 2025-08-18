

var handler = async (m, { conn, text }) => {
const res = await fetch('https://files.catbox.moe/875ido.png');
const imagenProducto = Buffer.from(await res.arrayBuffer());

const mensajeProducto = {
    product: {
        productImage: {
            mimetype: 'image/jpeg',
            jpegThumbnail: imagenProducto
        },
        productImageCount: 1,
        content: {
            product: {
                title: 'Mi Super Producto',
                currency: 'HNL', 
                priceAmount1000: 50000, 
                description: 'Este es un producto increíble que te ayudará a...',
                businessOwnerJid: '50499998888@s.whatsapp.net', 
                url: 'https://www.tusitio.com/producto'
            }
        },
        businessOwnerJid: '50499998888@s.whatsapp.net'
    },
    key: {
        participants: "0@s.whatsapp.net",
        remoteJid: "status@broadcast",
        fromMe: false,
        id: "Producto"
    },
    message: {
    }
};


  return conn.reply(m.chat, `prueba`, mensajeProducto, fake)
};


handler.command = ['1']

export default handler
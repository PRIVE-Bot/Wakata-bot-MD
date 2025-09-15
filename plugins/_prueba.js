import jimp from 'jimp';
import path from 'path';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Definición de colores y fuentes
    const FONT_NORMAL = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
    const FONT_BOLD = await jimp.loadFont(jimp.FONT_SANS_64_BLACK);
    const FONT_SMALL = await jimp.loadFont(jimp.FONT_SANS_16_BLACK);

    // Colores de la factura
    const PINK = 0xff69b4ff; // Rosa
    const YELLOW = 0xffff00ff; // Amarillo

    // --- Validación de datos de entrada ---
    const args = text.split('|').map(arg => arg.trim());
    if (args.length < 3) {
        return m.reply(`Uso incorrecto. Ejemplo de uso:\n\n*${usedPrefix + command}* Juan Pérez | juan.perez@gmail.com | Producto A,2|Producto B,1|Producto C,3`);
    }

    const [nombreCliente, emailCliente, ...productosRaw] = args;

    const productos = productosRaw.map(p => {
        const [nombre, cantidad] = p.split(',');
        return { nombre: nombre.trim(), cantidad: parseInt(cantidad.trim()) };
    });

    if (!nombreCliente || !emailCliente || productos.length === 0) {
        return m.reply('Faltan datos para generar la factura. Por favor, revisa el formato.');
    }

    // --- Generación de la imagen de la factura ---

    // Crear una imagen base con el fondo rosa
    const width = 800;
    const height = 1200;
    const image = new jimp(width, height, PINK);

    // Añadir el marco amarillo
    image.border(40, YELLOW);

    // --- Contenido de la factura ---

    // Título "FACTURA"
    image.print(FONT_BOLD, 0, 80, {
        text: 'FACTURA',
        alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: jimp.VERTICAL_ALIGN_TOP
    }, width, 100);

    // Información del cliente
    image.print(FONT_NORMAL, 80, 200, 'Cliente');
    image.print(FONT_SMALL, 80, 260, nombreCliente);
    image.print(FONT_SMALL, 80, 290, emailCliente);

    // Información de la factura (número y fecha)
    const numeroFactura = '000456'; // Puedes generar un número aleatorio
    const fecha = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    image.print(FONT_NORMAL, 450, 200, 'Número');
    image.print(FONT_SMALL, 450, 260, numeroFactura);
    image.print(FONT_NORMAL, 450, 300, 'Fecha');
    image.print(FONT_SMALL, 450, 360, fecha);

    // Tabla de productos
    let yPos = 450;
    image.print(FONT_NORMAL, 80, yPos, 'Descripción');
    image.print(FONT_NORMAL, 450, yPos, 'Cantidad');
    yPos += 50;

    for (const producto of productos) {
        image.print(FONT_SMALL, 80, yPos, producto.nombre);
        image.print(FONT_SMALL, 450, yPos, producto.cantidad);
        yPos += 40;
    }

    // Separador y total
    const total = productos.reduce((sum, p) => sum + p.cantidad, 0); // Ejemplo de cálculo simple
    yPos += 80;
    image.print(FONT_BOLD, 80, yPos, 'Total');
    yPos += 60;
    image.print(FONT_BOLD, 80, yPos, `$ ${total}.00`);

    // Mensaje de agradecimiento
    image.print(FONT_NORMAL, 0, height - 100, {
        text: 'Gracias por su compra!',
        alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: jimp.VERTICAL_ALIGN_BOTTOM
    }, width, 100);

    // --- Guardar y enviar la imagen ---

    // Guarda la imagen temporalmente
    const imagePath = path.join(__dirname, 'factura.png');
    await image.writeAsync(imagePath);

    // Envía la imagen al chat
    await conn.sendFile(m.chat, imagePath, 'factura.png', 'Aquí está tu factura.', m);

    // Elimina la imagen temporal
    // fs.unlinkSync(imagePath); // Descomenta esta línea si quieres eliminar el archivo después de enviarlo

};

handler.command = ['a'];
handler.help = ['generarfactura <cliente>|<email>|<producto,cantidad>|...'];
handler.tags = ['herramientas'];

export default handler;

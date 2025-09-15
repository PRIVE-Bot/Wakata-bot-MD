import jimp from 'jimp';
import path from 'path';
import fs from 'fs'; // Necesario para eliminar el archivo temporal

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Definición de colores y fuentes (puedes cargar fuentes personalizadas si quieres)
    const FONT_NORMAL = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
    const FONT_BOLD = await jimp.loadFont(jimp.FONT_SANS_64_BLACK);
    const FONT_SMALL = await jimp.loadFont(jimp.FONT_SANS_16_BLACK);

    // Colores de la factura (hexadecimal en formato RGBA, el último FF es para opacidad)
    const PINK = 0xFF69B4FF; // Rosa
    const YELLOW = 0xFFFF00FF; // Amarillo
    const BLACK = 0x000000FF; // Negro para el texto

    // --- Validación de datos de entrada ---
    const args = text.split('|').map(arg => arg.trim());
    if (args.length < 3) {
        let example = `${usedPrefix + command} Juan Pérez | juan.perez@gmail.com | Producto A,2 | Producto B,1 | Producto C,3`;
        return m.reply(`❌ *Uso incorrecto.*\n\nEjemplo de uso:\n\n*${example}*`);
    }

    const [nombreCliente, emailCliente, ...productosRaw] = args;

    // Verificar si el email es válido (formato básico)
    if (!emailCliente.includes('@') || !emailCliente.includes('.')) {
        return m.reply('❌ *Error: El formato del correo electrónico es inválido.* Por favor, usa un email como: `nombre.apellido@dominio.com`');
    }

    const productos = productosRaw.map(p => {
        const parts = p.split(',');
        if (parts.length !== 2) {
            return null; // Marcar como inválido
        }
        const nombre = parts[0].trim();
        const cantidad = parseInt(parts[1].trim());
        if (isNaN(cantidad) || cantidad <= 0 || !nombre) {
            return null; // Marcar como inválido
        }
        return { nombre, cantidad };
    }).filter(p => p !== null); // Eliminar productos inválidos

    if (productos.length === 0) {
        return m.reply('❌ *Error: No se especificaron productos válidos.* Asegúrate de usar el formato `Producto,Cantidad` para cada item.');
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
    image.print(FONT_NORMAL, 80, 200, 'Cliente', BLACK);
    image.print(FONT_SMALL, 80, 260, nombreCliente, BLACK);
    image.print(FONT_SMALL, 80, 290, emailCliente, BLACK);

    // Información de la factura (número y fecha)
    const numeroFactura = '000456'; // Puedes generar un número aleatorio o un ID real
    const fecha = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    image.print(FONT_NORMAL, 450, 200, 'Número', BLACK);
    image.print(FONT_SMALL, 450, 260, numeroFactura, BLACK);
    image.print(FONT_NORMAL, 450, 300, 'Fecha', BLACK);
    image.print(FONT_SMALL, 450, 360, fecha, BLACK);

    // Tabla de productos
    let yPos = 450;
    image.print(FONT_NORMAL, 80, yPos, 'Descripción', BLACK);
    image.print(FONT_NORMAL, 450, yPos, 'Cantidad', BLACK);
    yPos += 50;

    let total = 0;
    for (const producto of productos) {
        image.print(FONT_SMALL, 80, yPos, producto.nombre, BLACK);
        image.print(FONT_SMALL, 450, yPos, producto.cantidad.toString(), BLACK);
        total += producto.cantidad; // Asumiendo que el "total" es la suma de las cantidades por ahora
        yPos += 40;
    }

    // Separador y total
    yPos += 80;
    image.print(FONT_BOLD, 80, yPos, 'Total', BLACK);
    yPos += 60;
    image.print(FONT_BOLD, 80, yPos, `$ ${total}.00`, BLACK);

    // Mensaje de agradecimiento
    image.print(FONT_NORMAL, 0, height - 100, {
        text: 'Gracias por su compra!',
        alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
        alignmentY: jimp.VERTICAL_ALIGN_BOTTOM
    }, width, 100, BLACK);

    // --- Guardar y enviar la imagen ---

    // Genera un nombre de archivo único para evitar conflictos si se generan muchas facturas
    const fileName = `factura_${m.sender.split('@')[0]}_${Date.now()}.png`;
    const imagePath = path.join(__dirname, fileName); // Guarda en la misma carpeta que el handler

    try {
        await image.writeAsync(imagePath);
        // Envía la imagen al chat donde se ejecutó el comando
        await conn.sendFile(m.chat, imagePath, fileName, 'Aquí tienes tu factura:', m);
    } catch (error) {
        console.error('Error al generar o enviar la factura:', error);
        await m.reply('Hubo un error al generar la factura. Inténtalo de nuevo más tarde.');
    } finally {
        // Elimina la imagen temporal después de enviarla, incluso si hubo un error en el envío
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }
};

handler.command = ['a']; // El comando que activará este handler
handler.help = ['a <cliente>|<email>|<producto,cantidad>|...'];
handler.tags = ['herramientas'];

export default handler;

import axios from "axios";

// Definir el handler para el clicker
let handler = async (m, { conn, usedPrefix, command }) => {
    let counter = 0; // Contador de clics
    let store = []; // Tienda de objetos que el usuario puede comprar

    // Función para actualizar el mensaje de clics
    const updateClickMessage = async () => {
        const buttons = [
            {
                buttonId: `${usedPrefix + command}`,
                buttonText: { displayText: `Haz ${counter} clics!` }, // Botón que muestra los clics
                type: 1
            },
            {
                buttonId: `${usedPrefix + command} tienda`,
                buttonText: { displayText: "🛒 Tienda" }, // Botón para acceder a la tienda
                type: 1
            }
        ];

        await conn.sendMessage(
            m.chat,
            {
                text: `¡Has hecho ${counter} clics! ¿Qué quieres hacer ahora?`,
                buttons: buttons,
                viewOnce: false
            },
            { quoted: m }
        );
    };

    // Función para manejar la tienda
    const storeHandler = async () => {
        // Tienda de ejemplo: objetos que se pueden comprar
        const items = [
            { name: "🔥 Aumento de clics", price: 10, action: () => { counter += 5; } },
            { name: "🎁 Clic gratis", price: 5, action: () => { counter += 1; } },
            { name: "⚡ Super clic", price: 20, action: () => { counter += 10; } }
        ];

        const buttons = items.map((item, index) => ({
            buttonId: `${usedPrefix + command} comprar ${index}`,
            buttonText: { displayText: `${item.name} - ${item.price} clics` },
            type: 1
        }));

        // Botón para volver al juego
        buttons.push({
            buttonId: `${usedPrefix + command}`,
            buttonText: { displayText: "Volver al juego" },
            type: 1
        });

        await conn.sendMessage(
            m.chat,
            {
                text: "¡Bienvenido a la tienda! Elige qué objeto quieres comprar:",
                buttons: buttons,
                viewOnce: false
            },
            { quoted: m }
        );
    };

    // Función para manejar las compras
    const purchaseHandler = async (itemIndex) => {
        const items = [
            { name: "🔥 Aumento de clics", price: 10, action: () => { counter += 5; } },
            { name: "🎁 Clic gratis", price: 5, action: () => { counter += 1; } },
            { name: "⚡ Super clic", price: 20, action: () => { counter += 10; } }
        ];

        const item = items[itemIndex];
        
        if (counter >= item.price) {
            counter -= item.price; // Reducir los clics del contador por el precio del objeto
            item.action(); // Ejecutar acción de compra (por ejemplo, aumentar clics)
            await conn.sendMessage(
                m.chat,
                {
                    text: `¡Has comprado ${item.name}! Ahora tienes ${counter} clics.`,
                    buttons: [{ buttonId: `${usedPrefix + command} tienda`, buttonText: { displayText: "Volver a la tienda" }, type: 1 }],
                    viewOnce: false
                },
                { quoted: m }
            );
        } else {
            await conn.sendMessage(
                m.chat,
                {
                    text: `No tienes suficientes clics para comprar ${item.name}. Necesitas ${item.price - counter} clics más.`,
                    buttons: [{ buttonId: `${usedPrefix + command} tienda`, buttonText: { displayText: "Volver a la tienda" }, type: 1 }],
                    viewOnce: false
                },
                { quoted: m }
            );
        }
    };

    // Lógica para manejar los clics
    if (command === "clicker") {
        counter++; // Incrementar contador de clics
        await updateClickMessage(); // Actualizar el mensaje con el número de clics
    } else if (command === "clicker tienda") {
        await storeHandler(); // Mostrar la tienda
    } else if (command.startsWith("clicker comprar")) {
        const itemIndex = parseInt(command.split(" ")[2]);
        if (!isNaN(itemIndex)) {
            await purchaseHandler(itemIndex); // Manejar la compra
        }
    } else {
        await conn.sendMessage(
            m.chat,
            {
                text: "¡Bienvenido al Clicker! Haz clic en el botón para empezar.",
                buttons: [
                    {
                        buttonId: `${usedPrefix + command}`,
                        buttonText: { displayText: "Click!" },
                        type: 1
                    }
                ],
                viewOnce: true
            },
            { quoted: m }
        );
    }
};

handler.help = ['clicker'];
handler.tags = ['juego'];
handler.command = /^(clicker)$/i;

export default handler;

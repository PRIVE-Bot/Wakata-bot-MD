import axios from "axios";

let handler = async (m, { conn, usedPrefix, command }) => {
    // Aquí definimos el contador de clics
    let counter = 0;

    // Aquí definimos los botones
    const buttons = [
        {
            buttonId: `${usedPrefix + command}`,
            buttonText: { displayText: "Click!" },
            type: 1
        }
    ];

    // Función que se activa cada vez que se hace un clic
    const clickHandler = async () => {
        counter++; // Incrementamos el contador de clics

        // Actualizamos el mensaje con la cantidad de clics
        await conn.sendMessage(
            m.chat,
            {
                text: `¡Haz hecho ${counter} clics!`,
                buttons: buttons,
                viewOnce: true
            },
            { quoted: m }
        );
    };

    // Enviamos el mensaje inicial
    await conn.sendMessage(
        m.chat,
        {
            text: `¡Bienvenido al Clicker! Haz clic en el botón para empezar.`,
            buttons: buttons,
            viewOnce: true
        },
        { quoted: m }
    );

    // Aquí ejecutamos la función del click
    clickHandler();
};

handler.help = ['clicker'];
handler.tags = ['juego'];
handler.command = /^(clicker)$/i;

export default handler;

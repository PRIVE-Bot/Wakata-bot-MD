import fetch from "node-fetch";

// Reemplaza esta URL con la dirección de tu API en Render
const API_URL = "[https://dey-yt.onrender.com/api](https://dey-yt.onrender.com/api)";

const handler = async (m, { conn, text }) => {
    // Verifica si se proporcionó una URL
    if (!text) {
        return m.reply("Por favor, proporciona una URL de YouTube.");
    }

    m.reply("Obteniendo información del audio, por favor espera un momento.");

    try {
        // Realiza una única solicitud GET a la API
        const response = await fetch(`${API_URL}/download?url=${encodeURIComponent(text)}`);
        const data = await response.json();

        // Si la respuesta contiene un error, se lo informa al usuario
        if (data.error) {
            return m.reply(`Hubo un error en la API: ${data.error}`);
        }

        // Responde con el título y la URL del audio
        const audioUrl = data.url;
        m.reply(`¡Información obtenida! Título: *${data.title}*`);
        m.reply(`Puedes descargar el audio desde esta URL: ${audioUrl}`);
        
    } catch (error) {
        console.error("Error al conectar con la API:", error);
        m.reply("Ocurrió un error al conectar con la API. Inténtalo de nuevo.");
    }
};

handler.command = ["play", "play2"];
handler.tags = ["downloader"];

export default handler;
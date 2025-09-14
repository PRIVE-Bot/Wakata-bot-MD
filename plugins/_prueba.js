import fetch from "node-fetch";

// Reemplaza esta URL con la URL de tu API en Render
// Nota: La URL ya no incluye '/api' para evitar la duplicación
const API_URL = "https://dey-yt.onrender.com"; 

const handler = async (m, { conn, text }) => {
    // Verifica si se proporcionó una URL
    if (!text) {
        return m.reply("Por favor, proporciona una URL de YouTube.");
    }

    const videoUrl = text;
    m.reply("Recibí tu solicitud. Iniciando la descarga del MP3, por favor espera un momento.");

    try {
        // Paso 1: Iniciar la descarga (POST request)
        // Se añade '/api' solo en esta solicitud
        const startResponse = await fetch(`${API_URL}/api/download`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: videoUrl }),
        });
        const startData = await startResponse.json();

        if (startData.status !== "download_started") {
            return m.reply("Error al iniciar la descarga. Por favor, inténtalo de nuevo más tarde.");
        }

        const taskId = startData.task_id;
        m.reply(`Descarga en progreso (ID: ${taskId}). Revisaré el estado en unos segundos...`);

        // Paso 2: Verificar el estado de la descarga (polling con un bucle)
        const checkStatus = async () => {
            const statusResponse = await fetch(`${API_URL}/api/status/${taskId}`);
            const statusData = await statusResponse.json();

            if (statusData.status === "completed") {
                // Paso 3: Descargar el archivo (GET request)
                // Se construye la URL correctamente
                const downloadUrl = `${API_URL}${statusData.download_url}`;
                
                // Muestra el título y prepara la descarga
                m.reply(`¡Descarga completada! El título es: *${statusData.title}*`);
                m.reply(`Ahora puedes descargar el archivo desde esta URL: ${downloadUrl}`);
                
                // Si tu bot puede enviar archivos, aquí iría el código
                // por ejemplo: conn.sendFile(m.chat, downloadUrl, 'audio.mp3', 'Tu audio está aquí!', m);
                // La implementación real depende de la biblioteca que uses para tu bot.
                return;

            } else if (statusData.status === "error") {
                m.reply(`Hubo un error en la descarga: ${statusData.message}`);
                return;
            } else {
                // Si aún no está listo, vuelve a intentar en 5 segundos
                setTimeout(checkStatus, 5000);
            }
        };

        // Inicia la verificación del estado
        checkStatus();

    } catch (error) {
        console.error(error);
        m.reply("Ocurrió un error al conectar con la API.");
    }
};

handler.command = ["y", "y2"];
handler.tags = ["downloader"];

export default handler;
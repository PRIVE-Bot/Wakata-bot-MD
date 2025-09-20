import { youtubedl, ytSearch } from 'play-dl';
import fs from 'fs';
import path from 'path';

let handler = async (m, { text }) => {
    if (!text) return m.reply('❌ Por favor, ingresa el nombre de la canción.');

    try {
        // Buscar canción en YouTube
        const results = await ytSearch(text);
        if (!results || results.length === 0) return m.reply('❌ No se encontró la canción.');

        const song = results[0]; // Tomamos el primer resultado
        const title = song.title;
        const url = song.url;

        m.reply(`🎵 Descargando: *${title}*\n🔗 ${url}`);

        // Descargar audio completo
        const info = await youtubedl(url, { filter: 'audioonly', quality: 'highestaudio' });
        const filePath = path.resolve(`./downloads/${title}.mp3`);

        // Crear carpeta si no existe
        if (!fs.existsSync('./downloads')) fs.mkdirSync('./downloads');

        const stream = info.stream();
        const writeStream = fs.createWriteStream(filePath);
        stream.pipe(writeStream);

        writeStream.on('finish', async () => {
            await m.reply({ 
                text: `✅ Aquí tienes la canción: *${title}*`, 
                mentions: [] 
            });

            // Enviar audio al chat
            await m.reply({ 
                audio: fs.readFileSync(filePath), 
                mimetype: 'audio/mpeg', 
                fileName: `${title}.mp3` 
            });

            // Borrar archivo después de enviar
            fs.unlinkSync(filePath);
        });

    } catch (error) {
        console.error(error);
        m.reply('❌ Ocurrió un error al descargar la canción.');
    }
};

handler.command = ['play', 'song', 'musica'];

export default handler;
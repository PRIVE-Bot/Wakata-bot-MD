// plugins/welcomeHandler.js
import { spawn } from 'child_process'
import { join } from 'path'
import { readFileSync } from 'fs'

// Necesario para ESM
const __dirname = global.__dirname ? global.__dirname : new URL('.', import.meta.url).pathname

/**
 * Genera imagen welcome usando ImageMagick
 * @param {String} name Nombre del usuario
 * @param {String} title Título del grupo
 * @param {String} text Texto de bienvenida
 * @param {String} wid ID del usuario (para código de barras opcional)
 * @returns {Promise<Buffer>}
 */
function generateWelcome(name, title, text, wid = '') {
    return new Promise((resolve, reject) => {
        if (!(global.support.convert || global.support.magick || global.support.gm)) return reject('Not supported!')

        const fontDir = join(__dirname, '../src/font')
        const fontTitle = join(fontDir, 'texts.otf')
        const fontName = join(fontDir, 'level_c.otf')
        const template = join(__dirname, '../src/welcome_template.jpg') // tu plantilla base

        const annotationsName = '+153+200'
        const annotationsLevel = '+1330+260' // si quieres mostrar el código de barras aquí

        const [_cmd, ...args] = [
            ...(global.support.gm ? ['gm'] : global.support.magick ? ['magick'] : []),
            'convert',
            template,
            // Título del grupo
            '-font', fontTitle,
            '-fill', '#FFFFFF',
            '-pointsize', '48',
            '-annotate', '+50+50', title,
            // Nombre del usuario
            '-font', fontName,
            '-fill', '#FFD700',
            '-pointsize', '68',
            '-annotate', annotationsName, name,
            // Texto de bienvenida
            '-font', fontTitle,
            '-fill', '#FFFFFF',
            '-pointsize', '32',
            '-annotate', '+50+300', text,
            'jpg:-'
        ]

        let bufs = []
        spawn(_cmd, args)
            .on('error', reject)
            .stdout.on('data', chunk => bufs.push(chunk))
            .on('close', () => resolve(Buffer.concat(bufs)))
    })
}

// Handler del comando
let handler = async (m, { conn }) => {
    try {
        const name = await conn.getName(m.sender)
        const img = await generateWelcome(name, 'Grupo de Prueba', 'Bienvenido a la familia!', m.sender)
        await conn.sendFile(m.chat, img, 'welcome.jpg', `✦ 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 ✦\n\nHola ${name}`, m)
    } catch (e) {
        console.error(e)
        m.reply('❌ Error al generar el welcome')
    }
}

handler.help = ['welcome']
handler.tags = ['tools']
handler.command = ['1']

export default handler
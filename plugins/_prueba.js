import fetch from 'node-fetch'
import { sticker } from '../lib/sticker.js'

const SEARCH_BASE_URL = 'https://api.sylphy.xyz/stickerly/search?query='
const DETAIL_BASE_URL = 'https://api.sylphy.xyz/stickerly/detail?url='
const API_KEY = 'sylphy-4f50'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let handler = async (m, { conn, text, command }) => {
    
    if (command === 'stickerly' || command === 'stls') {
        
        if (!text?.trim()) {
            return conn.reply(m.chat, `🐱 Dime qué paquete de stickers quieres buscar. Ejemplo:\n*${command} gatos memes*`, m)
        }
        
        await m.react('🔎')

        try {
            const query = encodeURIComponent(text)
            const apiUrl = `${SEARCH_BASE_URL}${query}&apikey=${API_KEY}`
            
            const response = await fetch(apiUrl)
            
            if (!response.ok) {
                throw new Error(`La API de búsqueda falló con estado: ${response.status}`)
            }
            
            const json = await response.json()

            // ⚠️ Cambiado de json.res a json.data (o la clave correcta que hayas encontrado)
            if (!json.status || !json.data || json.data.length === 0) {
                return m.reply(`❌ No se encontraron paquetes de stickers de Sticker.ly con el término: *${text}*`)
            }

            const results = json.data.slice(0, 10)
            let listMessage = `*✨ Resultados de Sticker.ly para "${text}"*:\n\n_Selecciona un paquete para enviar los primeros 5 stickers._\n\n`
            
            const sections = [{
                title: "Paquetes Encontrados",
                rows: []
            }]
            
            for (let i = 0; i < results.length; i++) {
                const item = results[i]
                const type = item.isAnimated ? '🖼️ ANIMADO' : '⭐ ESTÁTICO'
                const title = `${i + 1}. ${item.name} (${type})`
                const description = `Autor: ${item.author} | Stickers: ${item.stickerCount || '??'}`
                
                const packageUrl = item.url.startsWith('https://sticker.ly') ? item.url : `https://sticker.ly/s/${item.url.split('/').pop()}`

                sections[0].rows.push({
                    title: title.substring(0, 24),
                    description: description.substring(0, 68),
                    id: `.stickerlysend ${packageUrl}` 
                })
            }

            const thumbnail = await (await fetch(results[0].thumbnailUrl)).buffer()

            const list = {
                text: listMessage,
                title: `STCKR.LY | Búsqueda: ${text}`,
                buttonText: "Seleccionar Paquete",
                sections
            }

            await conn.sendMessage(m.chat, list, { quoted: m, ephemeralExpiration: 60 * 60, jpegThumbnail: thumbnail })

        } catch (error) {
            console.error('Error en stickerlysearch:', error)
            return m.reply(`⚠️ Ocurrió un error al buscar stickers:\n_${error.message}_\n\nVerifica la API Key y la URL de búsqueda.`)
        }
        
    } else if (command === 'stickerlysend') {
        
        const packageUrl = text.trim()

        if (!packageUrl || !packageUrl.startsWith('https://sticker.ly/s/')) {
            return m.reply('❌ Comando de envío incompleto. Usa el comando de búsqueda primero.')
        }
        
        await m.react('⏳')
        conn.reply(m.chat, `🚀 Obteniendo detalles del paquete...\nURL: ${packageUrl}`, m)

        try {
            const encodedUrl = encodeURIComponent(packageUrl)
            const apiUrl = `${DETAIL_BASE_URL}${encodedUrl}&apikey=${API_KEY}`
            
            const response = await fetch(apiUrl)
            
            if (!response.ok) {
                throw new Error(`La API de detalle falló con estado: ${response.status}`)
            }
            
            const json = await response.json()

            // ⚠️ Cambiado de json.res a json.data
            if (!json.status || !json.data || json.data.length === 0) {
                return m.reply(`❌ La API no devolvió stickers para esta URL.`)
            }

            // Límite de 5 stickers
            const stickerUrls = json.data.slice(0, 5).map(item => item.url)
            
            const packName = json.name || 'Sticker.ly Pack'
            const packAuthor = json.author || 'WhatsApp Bot'

            if (stickerUrls.length === 0) {
                return m.reply('❌ No se encontraron stickers válidos para enviar en este paquete.')
            }

            conn.reply(m.chat, `*✅ Paquete Encontrado:* "${packName}". Se enviarán ${stickerUrls.length} stickers.\n\n*Iniciando envío...*`, m)

            for (const url of stickerUrls) {
                let stiker
                try {
                    stiker = await sticker(false, url, packName, packAuthor) 
                } catch (e) {
                    console.error('Error al generar sticker:', url, e)
                    continue 
                }
                
                if (stiker) {
                    await conn.sendFile(m.chat, stiker, 'sticker.webp', '', null, null, { asSticker: true })
                    await delay(800)
                }
            }
            
            await conn.reply(m.chat, `*🎉 Envío Completado!* Se enviaron ${stickerUrls.length} stickers que puedes guardar como un paquete.`, m)
            await m.react('✅')

        } catch (error) {
            console.error('Error en stickerlysend:', error)
            return m.reply(`⚠️ Ocurrió un error al procesar el paquete: ${error.message}`)
        }
    }
}

handler.help = ['stickerly <texto>']
handler.tags = ['sticker', 'search']
handler.command = ['stickerly', 'stls']

export default handler

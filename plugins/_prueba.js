// plugins/searchgroups.js
import fetch from "node-fetch"
import * as cheerio from "cheerio"

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `✳️ Uso correcto:\n${usedPrefix + command} <tema>`, m)

  try {
    // Hacemos POST a la ruta real de búsqueda
    const url = "https://www.gruposwats.com/_search_"
    const formData = new URLSearchParams()
    formData.append("q", text)
    formData.append("qGpais_codigo", "es") // España, puedes cambiar si quieres

    const res = await fetch(url, {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    })

    if (!res.ok) throw new Error(`❌ No se pudo acceder a ${url}`)
    const html = await res.text()
    const $ = cheerio.load(html)

    let results = []

    // Todos los links de WhatsApp
    $("a").each((i, el) => {
      const link = $(el).attr("href")
      const title = $(el).text().trim()
      if (link && link.includes("chat.whatsapp.com") && title) {
        results.push({ title, link })
      }
    })

    if (!results.length) {
      return conn.reply(m.chat, `⚠️ No encontré grupos en *${text}*`, m)
    }

    // Armamos el mensaje con máximo 10 resultados
    let replyMsg = `🔎 Resultados para *${text}* en gruposwats:\n\n`
    replyMsg += results
      .slice(0, 10)
      .map((g, i) => `${i + 1}. ${g.title}\n🔗 ${g.link}`)
      .join("\n\n")

    await conn.reply(m.chat, replyMsg, m)
  } catch (e) {
    console.error(e)
    conn.reply(m.chat, "❌ Error al scrapear la página, prueba con otra palabra.", m)
  }
}

handler.help = ["searchgroups <tema>"]
handler.tags = ["search"]
handler.command = /^searchgroups$/i

export default handler
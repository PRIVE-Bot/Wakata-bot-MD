import { default as fetch } from "node-fetch"
import * as cheerio from "cheerio"

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) return conn.reply(m.chat, `❗ Uso: ${usedPrefix}${command} <consulta>`, m)

  const query = args.join(" ")
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept-Language": "es-ES,es;q=0.9",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Referer": "https://www.google.com/",
    "Cache-Control": "no-cache",
  }

  try {
    const urlSearch = `https://www.google.com/search?q=${encodeURIComponent(query)}&hl=es`
    const html = await fetch(urlSearch, { headers }).then(r => r.text())
    const $ = cheerio.load(html)
    const results = []

    $("div.g").each((_, el) => {
      const title = $(el).find("h3").text().trim()
      const href = $(el).find("a").attr("href")
      const desc = $(el).find("div.VwiC3b").text().trim()
      if (href && href.startsWith("/url?q=") && title) {
        const link = decodeURIComponent(href.split("/url?q=")[1].split("&")[0])
        results.push(`• ${title}\n${desc || "Sin descripción"}\n${link}`)
      }
    })

    if (!results.length) throw new Error("No se")

    const text = `🔎 Resultados para: *${query}*\n\n${results.slice(0, 5).join("\n\n")}`

    conn.reply(m.chat, text, m)
  } catch (err) {
    conn.reply(m.chat, `❌ Error real:\n${err.message}`, m)
  }
}

handler.command = /^(search|buscar)$/i
handler.help = ["search <consulta>"]
handler.tags = ["internet"]

export default handler
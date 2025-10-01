
import fetch from "node-fetch"
import * as cheerio from "cheerio"

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `✳️ Uso correcto:\n${usedPrefix + command} anime`, m)
  }

  try {
    let url = `https://whatsgrouplink.com/?s=${encodeURIComponent(text)}`
    let res = await fetch(url)
    let html = await res.text()
    let $ = cheerio.load(html)

    let results = []
    $(".entry-title a").each((i, el) => {
      let title = $(el).text().trim()
      let link = $(el).attr("href")
      if (title && link) {
        results.push({ title, link })
      }
    })

    if (!results.length) {
      return conn.reply(m.chat, "⚠️ No encontré grupos con ese nombre.", m)
    }

    let replyMsg = `🔎 Resultados de búsqueda para *${text}*:\n\n`
    replyMsg += results.slice(0, 10).map((g, i) => `${i + 1}. ${g.title}\n🔗 ${g.link}`).join("\n\n")

    await conn.reply(m.chat, replyMsg, m)
  } catch (e) {
    console.error(e)
    conn.reply(m.chat, "❌ Error al buscar grupos, intenta de nuevo.", m)
  }
}

handler.help = ["searchgroups <texto>"]
handler.tags = ["search"]
handler.command = /^searchgroups$/i

export default handler

import fetch from "node-fetch"
import * as cheerio from "cheerio"

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `✳️ Uso correcto:\n${usedPrefix + command} anime`, m)
  }

  try {
    let url = `https://www.gruposwats.com/?s=${encodeURIComponent(text)}`
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

    let finalResults = []
    for (let group of results.slice(0, 5)) { // máximo 5 para no sobrecargar
      try {
        let subRes = await fetch(group.link)
        let subHtml = await subRes.text()
        let $$ = cheerio.load(subHtml)

        // el link real está en los botones dentro del artículo
        let realLink = $$(".su-button-center a").attr("href") || ""
        if (realLink.includes("chat.whatsapp.com")) {
          finalResults.push({ title: group.title, link: realLink })
        }
      } catch {}
    }

    if (!finalResults.length) {
      return conn.reply(m.chat, "⚠️ No encontré enlaces válidos de WhatsApp.", m)
    }

    let replyMsg = `🔎 Resultados de búsqueda en *gruposwats.com* para: *${text}*\n\n`
    replyMsg += finalResults.map((g, i) => `${i + 1}. ${g.title}\n🔗 ${g.link}`).join("\n\n")

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
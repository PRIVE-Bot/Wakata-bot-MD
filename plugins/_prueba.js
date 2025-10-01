// plugins/searchgroups.js
import fetch from "node-fetch"
import * as cheerio from "cheerio"

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return conn.reply(m.chat, `✳️ Uso correcto:\n${usedPrefix + command} anime`, m)

  try {
    // URL de búsqueda
    let url = `https://www.gruposwats.com/${encodeURIComponent(text)}.html`
    let res = await fetch(url)
    if (!res.ok) throw new Error(`❌ No se pudo acceder a ${url}`)
    let html = await res.text()
    let $ = cheerio.load(html)

    let results = []

    // Buscamos los links dentro de #bodyresult
    $("#bodyresult a").each((i, el) => {
      let link = $(el).attr("href")
      let title = $(el).text().trim()
      if (link && link.includes("chat.whatsapp.com") && title) {
        results.push({ title, link })
      }
    })

    if (!results.length) {
      return conn.reply(m.chat, `⚠️ No encontré grupos en *${text}*`, m)
    }

    let replyMsg = `🔎 Resultados para *${text}* en gruposwats:\n\n`
    replyMsg += results.slice(0, 10).map((g, i) => `${i + 1}. ${g.title}\n🔗 ${g.link}`).join("\n\n")

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
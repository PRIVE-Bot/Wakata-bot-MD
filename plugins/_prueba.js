import fetch from "node-fetch"
import * as cheerio from "cheerio"

async function searchGroups(query) {
  const url = "https://www.gruposwats.com/_search_"
  const formData = new URLSearchParams()
  formData.append("q", query)
  formData.append("qGpais_codigo", "es")

  const res = await fetch(url, {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
  
  const html = await res.text()
  const $ = cheerio.load(html)
  const results = []

  $("a").each((i, el) => {
    const link = $(el).attr("href")
    const title = $(el).text().trim()
    if (link && link.includes("chat.whatsapp.com")) {
      results.push({ title, link })
    }
  })

  return results
}

// Uso
searchGroups("gato").then(console.log)
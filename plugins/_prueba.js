import fs from "fs"
import path from "path"

const errorsFile = path.join("./database/errors.json")

// Cargar historial si existe
let errors = []
if (fs.existsSync(errorsFile)) {
  errors = JSON.parse(fs.readFileSync(errorsFile, "utf-8"))
}

// Guardar errores en archivo
function saveErrors() {
  fs.writeFileSync(errorsFile, JSON.stringify(errors, null, 2))
}

// Parsear stacktrace para extraer archivo, línea y columna
function parseStackTrace(stack) {
  if (!stack) return null
  const lines = stack.split("\n")
  for (const line of lines) {
    const match = line.match(/\((.*):(\d+):(\d+)\)/) || line.match(/at (.*):(\d+):(\d+)/)
    if (match) {
      return { file: match[1], line: match[2], column: match[3] }
    }
  }
  return null
}

// Configurar el sistema de errores
export function setupErrorHandler(botName = "Bot") {
  function logError(err, type = "uncaughtException") {
    const trace = parseStackTrace(err.stack)
    const errorData = {
      id: `error${errors.length + 1}`,
      type,
      file: trace?.file || "desconocido",
      line: trace?.line || "desconocida",
      column: trace?.column || "desconocida",
      message: err.message,
      date: new Date().toISOString()
    }
    errors.push(errorData)
    saveErrors()

    console.error(`\n🚨 [${botName}] ${type}:`)
    console.error("📄 Archivo:", errorData.file)
    console.error("🔢 Línea:", errorData.line)
    console.error("📍 Columna:", errorData.column)
    console.error("💥 Mensaje:", errorData.message)
    console.error("───────────────\n")
  }

  process.on("uncaughtException", (err) => logError(err, "uncaughtException"))
  process.on("unhandledRejection", (reason) => {
    const err = reason instanceof Error ? reason : new Error(String(reason))
    logError(err, "unhandledRejection")
  })
}

// Handler de comando .error
let handler = async (m, { args }) => {
  if (errors.length === 0) return m.reply("✅ No se han registrado errores.")

  // Si pide un error específico
  if (args[0]) {
    const id = `error${args[0]}`
    const err = errors.find(e => e.id === id)
    if (!err) return m.reply("❌ Ese error no existe.")

    return m.reply(
      `📌 *${err.id.toUpperCase()}*\n\n` +
      `📄 Archivo: ${err.file}\n` +
      `🔢 Línea: ${err.line}\n` +
      `📍 Columna: ${err.column}\n` +
      `💥 Mensaje: ${err.message}\n` +
      `🕒 Fecha: ${err.date}`
    )
  }

  // Listar últimos 5 errores
  let txt = "📋 *Errores registrados:*\n\n"
  for (const e of errors.slice(-5)) {
    txt += `- ${e.id}: ${e.message}\n`
  }
  txt += `\nUsa *.error <número>* para ver detalles.`

  m.reply(txt)
}

handler.command = /^error$/i
export default handler
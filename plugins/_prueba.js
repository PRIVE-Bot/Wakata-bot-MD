import { makeWASocket, useSingleFileAuthState, DisconnectReason } from "@whiskeysockets/baileys"
import { Boom } from "@hapi/boom"
import fs from "fs"

const AUTH_FILE = "./auth_info.json"
const WELCOME_FILE = "./welcomeChats.json"
const welcomeChats = new Set()

function saveWelcomeChats() {
  fs.writeFileSync(WELCOME_FILE, JSON.stringify([...welcomeChats]))
}

function loadWelcomeChats() {
  if (fs.existsSync(WELCOME_FILE)) {
    const data = fs.readFileSync(WELCOME_FILE, "utf-8")
    const arr = JSON.parse(data)
    arr.forEach(id => welcomeChats.add(id))
  }
}

async function sendWelcome(conn, jid) {
  if (!welcomeChats.has(jid)) {
    const text = "Hola 👋, bienvenido(a) al bot. Aquí puedes hacer X, Y, Z."
    await conn.sendMessage(jid, { text })
    welcomeChats.add(jid)
    saveWelcomeChats()
  }
}

async function sendWelcomeToAll(conn) {
  const chats = [...conn.chats.all()]
  for (const jid of chats) {
    if (!jid.endsWith("@g.us")) {
      try {
        await sendWelcome(conn, jid)
      } catch {}
    }
  }
}

async function startBot() {
  const { state, saveState } = useSingleFileAuthState(AUTH_FILE)
  const conn = makeWASocket({
    auth: state,
    printQRInTerminal: true
  })

  loadWelcomeChats()

  conn.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update
    if (connection === "close") {
      if ((lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut) {
        startBot()
      } else {
        console.log("Sesión cerrada. Reinicia manualmente.")
      }
    } else if (connection === "open") {
      welcomeChats.clear()
      saveWelcomeChats()
      await sendWelcomeToAll(conn)
    }
  })

  conn.ev.on("creds.update", saveState)

  conn.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return
    const m = messages[0]
    if (!m.message || m.key.fromMe) return
    if (m.key.remoteJid.endsWith("@g.us")) return

    await sendWelcome(conn, m.key.remoteJid)
  })
}

startBot()
let games = {};

const preguntas = [
  "¿Cuál es tu mayor miedo?",
  "¿Quién es tu crush secreto?",
  "¿Qué es lo más vergonzoso que has hecho?",
  "¿Cuál fue tu última mentira?",
  "¿Has stalkeado a alguien aquí?"
];

const retos = [
  "Cambia tu nombre en WhatsApp por algo gracioso durante 5 minutos.",
  "Envía un audio diciendo 'Soy el rey del grupo'.",
  "Haz 10 flexiones y grábalo.",
  "Escribe 'Te extraño ❤️' al último contacto en tu chat.",
  "Manda tu última foto en galería."
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const handler = async (m, { conn, command }) => {
  let id = m.chat;
  games[id] = games[id] || { players: [], used: [], started: false, waiting: null };

  switch (command) {
    case "join":
      if (games[id].started) return m.reply("🚫 La partida ya comenzó.");
      if (games[id].players.includes(m.sender)) return m.reply("Ya estás dentro.");
      games[id].players.push(m.sender);
      m.reply(`✅ ${conn.getName(m.sender)} se unió al juego. (${games[id].players.length} jugadores)`);
      break;

    case "leave":
      if (!games[id].players.includes(m.sender)) return m.reply("No estás en la partida.");
      games[id].players = games[id].players.filter(p => p !== m.sender);
      m.reply(`🚪 ${conn.getName(m.sender)} salió de la partida.`);
      break;

    case "start":
      if (games[id].started) return m.reply("Ya hay una partida en curso.");
      if (games[id].players.length < 2) return m.reply("⚠️ Necesitan al menos 2 jugadores.");
      games[id].started = true;
      games[id].used = [];
      nextTurn(conn, id, m);
      break;

    case "end":
      if (!games[id].started) return m.reply("No hay ninguna partida activa.");
      delete games[id];
      m.reply("🛑 La partida terminó.");
      break;
  }
};

async function nextTurn(conn, id, m) {
  let game = games[id];
  if (!game) return;
  if (game.used.length >= game.players.length) game.used = [];
  let candidates = game.players.filter(p => !game.used.includes(p));
  let chosen = pickRandom(candidates);
  game.used.push(chosen);
  let msg = await conn.sendMessage(id, {
    text: `👉 Turno de @${chosen.split("@")[0]}.\nResponde *Verdad* o *Reto* a este mensaje.`,
    mentions: [chosen]
  }, { quoted: m });
  game.waiting = { player: chosen, stage: "choose", msgId: msg.key.id };
}

handler.before = async (m, { conn }) => {
  let id = m.chat;
  let game = games[id];
  if (!game?.started || !game.waiting) return;
  if (!m.quoted || m.quoted.id !== game.waiting.msgId) return;
  if (m.sender !== game.waiting.player) return;
  if (!m.text) return m.reply("⚠️ Solo se permite texto en este juego.");

  if (game.waiting.stage === "choose") {
    let choice = m.text.toLowerCase();
    if (choice !== "verdad" && choice !== "reto") return m.reply("Responde solo con *Verdad* o *Reto*.");
    let content = choice === "verdad" ? pickRandom(preguntas) : pickRandom(retos);
    let msg = await conn.sendMessage(id, {
      text: `🎲 *${choice.toUpperCase()}*\n${content}\n\n👉 Responde a este mensaje con tu respuesta.`,
      mentions: [game.player]
    }, { quoted: m });
    game.waiting = { player: m.sender, stage: "answer", msgId: msg.key.id };
    return;
  }

  if (game.waiting.stage === "answer") {
    await m.reply("✅ Respuesta recibida. ¡Bien hecho!");
    game.waiting = null;
    nextTurn(conn, id, m);
  }
};

handler.command = ["join", "leave", "start", "end"];
handler.group = true;

export default handler;
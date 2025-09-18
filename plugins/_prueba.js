
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

const handler = async (m, { conn, text, command, participants, groupMetadata }) => {
  let id = m.chat;
  games[id] = games[id] || { players: [], turn: 0, started: false };

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
      if (games[id].players.length < 2) return m.reply("Necesitan al menos 2 jugadores.");
      games[id].started = true;
      games[id].turn = 0;
      let first = games[id].players[0];
      m.reply(`🎉 ¡La partida comenzó con ${games[id].players.length} jugadores!\n👉 Turno de @${first.split("@")[0]}`, { mentions: [first] });
      break;

    case "verdad":
    case "reto":
      if (!games[id].started) return m.reply("⚠️ No hay partida activa.");
      let current = games[id].players[games[id].turn];
      if (m.sender !== current) return m.reply("⏳ No es tu turno.");

      let content = command === "verdad"
        ? preguntas[Math.floor(Math.random() * preguntas.length)]
        : retos[Math.floor(Math.random() * retos.length)];

      await m.reply(`🎲 *${command.toUpperCase()}*\n${content}`);

      
      games[id].turn = (games[id].turn + 1) % games[id].players.length;
      let next = games[id].players[games[id].turn];
      m.reply(`👉 Ahora es turno de @${next.split("@")[0]}`, { mentions: [next] });
      break;

    case "end":
      if (!games[id].started) return m.reply("No hay ninguna partida activa.");
      delete games[id];
      m.reply("🛑 La partida terminó.");
      break;
  }
};

handler.command = ["join", "leave", "start", "verdad", "reto", "end"];
handler.group = true;

export default handler;
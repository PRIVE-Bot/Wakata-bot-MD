import { exec } from "child_process";

let handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, "⚠️ Por favor, ingresa un mensaje para enviar a Gemini.", m);

  await m.react("⏳");

  try {
    let respuesta = await chat(text);

    let txt = `*乂 G E M I N I - C H A T 乂*\n\n`;
    txt += `*» Pregunta:* ${text}\n`;
    txt += `*» Respuesta:* ${respuesta}\n\n`;
    txt += `> *${dev}*`;

    await conn.reply(m.chat, txt, m);
    await m.react("✅");
  } catch (error) {
    await m.react("❌");
    conn.reply(m.chat, "⚠️ Error al procesar la solicitud.", m);
  }
};

handler.help = ["gemini"];
handler.tags = ["ai"];
handler.command = ["gemini", "chatgemini"];

export default handler;

async function chat(prompt) {
  return new Promise((resolve, reject) => {
    const command = `curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCYWNbM2ZgdDSp9NlFxTgp0Wtwaaw7dyRc" \
      -H "Content-Type: application/json" \
      -X POST \
      -d '{
        "contents": [{
          "parts": [{"text": "${prompt}"}]
        }]
      }'`;

    exec(command, (error, stdout, stderr) => {
      if (error) return reject(`Error: ${error.message}`);
      if (stderr) return reject(`Stderr: ${stderr}`);

      try {
        const response = JSON.parse(stdout);
        const reply = response.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
        resolve(reply);
      } catch (err) {
        reject(`JSON Parse Error: ${err.message}`);
      }
    });
  });
}

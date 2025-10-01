import fetch from "node-fetch";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `${emoji} ¡Hola! ¿cómo puedo ayudarte hoy?`, m, rcanal);
  }

  try {
    const url = `https://api.kirito.my/api/chatgpt?prompt=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data || !data.response) {
      return conn.reply(m.chat, "❌ No recibí respuesta de la IA, intenta de nuevo.", m, fake);
    }

    await conn.reply(m.chat, `${data.response}`, m, rcanal);
  } catch (e) {
    console.error(e);
    await conn.reply(m.chat, "⚠️ Hubo un error al conectar con la IA.", m, fake);
  }
};

handler.tags = ["ai"];
handler.command = handler.help =['gpt', 'chatgpt']

export default handler;
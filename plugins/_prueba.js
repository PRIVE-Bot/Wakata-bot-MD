const handler = async (m, { conn, usedPrefix, command }) => {
  try {
    // Revisa todos los comandos cargados en global.plugins
    let tags = [];

    for (let name in global.plugins) {
      let plugin = global.plugins[name];
      if (plugin?.tags) {
        // Agrega cada tag del plugin a la lista
        tags.push(...plugin.tags);
      }
    }

    // Quita duplicados y normaliza (ejemplo: "main" -> "Main")
    let uniqueTags = [...new Set(tags.map(tag => tag.charAt(0).toUpperCase() + tag.slice(1)))];

    // Ordena alfabéticamente
    uniqueTags.sort();

    // Construye el mensaje
    let text = `📂 *Tags disponibles en los handlers:*\n\n${uniqueTags.map(t => `- ${t}`).join("\n")}`;

    await conn.reply(m.chat, text, m);
  } catch (e) {
    await conn.reply(m.chat, "❌ Error al obtener los tags.", m);
    console.error(e);
  }
};

handler.command = /^lookfor$/i;

export default handler;
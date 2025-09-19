const handler = async (m, { conn }) => {
  try {
    let tags = [];

    // Recorremos todos los plugins cargados en global.plugins
    for (let name in global.plugins) {
      let plugin = global.plugins[name];
      if (plugin?.tags) {
        tags.push(...plugin.tags);
      }
    }

    // Eliminar duplicados
    let uniqueTags = [...new Set(tags)];

    // Ordenar alfabéticamente
    uniqueTags.sort();

    // Construir el mensaje final
    let text = `📂 *Tags disponibles en los handlers:*\n\n${uniqueTags.map(t => `- ${t}`).join("\n")}`;

    await conn.reply(m.chat, text, m);
  } catch (e) {
    await conn.reply(m.chat, "❌ Error al obtener los tags.", m);
    console.error(e);
  }
};

handler.command = /^lookfor$/i;

export default handler;

const handler = async (m, { conn, command }) => {
  
  const canal = "120363403593951965@newsletter"; 

  if (!m.quoted) return m.reply("✳️ Debes etiquetar un mensaje para reenviarlo al canal.");

  try {
    let q = m.quoted;

    
    await conn.copyNForward(canal, q, true);

    m.reply("✅ Mensaje reenviado correctamente al canal.");
  } catch (e) {
    console.error(e);
    m.reply("❌ Ocurrió un error al reenviar el mensaje.");
  }
};

handler.command = /^reenviar|canalmsg$/i; 
export default handler;
//© Código hecho por Deylin

import axios from 'axios';

const estilosDisponibles = [
  '3d', '3d-logo',
  'alien-glow', 'amped', 'angel', 'anonymous', 'army',
  'aqua-logo', 'baby-logo', 'balloon-logo', 'bevel-logo',
  'birthday-logo', 'blue-metal', 'blue-logo', 'brick-logo',
  'burn-logo', 'candy-logo', 'cartoon-logo', 'chrome-logo',
  'comic-logo', 'cool-logo', 'crisp-logo', 'cutout-logo',
  'dance-logo', 'dark-logo', 'decor-logo', 'deep-logo',
  'deluxe-logo', 'dinamic-logo', 'distressed-logo',
  'electric-logo', 'emboss-logo', 'engraved-logo',
  'fire-logo', 'flaming-logo', 'fluffy-logo', 'funky-logo',
  'furry-logo', 'glossy-logo', 'glow-logo', 'gradient-logo',
  'graffiti-logo', 'gray-logo', 'green-logo', 'harry-logo',
  'ice-logo', 'jewelry-logo', 'lava-logo', 'liquid-logo',
  'love-logo', 'magnet-logo', 'metal-logo', 'neon-logo',
  'outline-logo', 'pencil-logo', 'pink-logo', 'plasma-logo',
  'pop-logo', 'popsicle-logo', 'purple-logo', 'rainbow-logo',
  'realistic-logo', 'retro-logo', 'sci-fi-logo', 'shiny-logo',
  'sketch-logo', 'slime-logo', 'smurfs-logo', 'snow-logo',
  'space-logo', 'stamp-logo', 'stone-logo', 'sticker-logo',
  'summer-logo', 'superhero-logo', 'swamp-logo',
  'urban-logo', 'vintage-logo', 'war-logo', 'water-logo',
  'winner-logo', 'wrooom-logo'
];

async function generarLogo(estilo, texto, m, conn) {
  try {
    await conn.sendMessage(m.chat, {
      text: '🚀 Generando tu logo, espera un momento...'
    }, { quoted: m });

    const url = `https://flamingtext.com/net-fu/proxy_form.cgi?imageoutput=true&script=${estilo}&text=${encodeURIComponent(texto)}`;

    await conn.sendMessage(m.chat, {
      image: { url },
      caption: `✨ Resultado de *${texto}* con estilo *${estilo}*`
    }, { quoted: m });

  } catch (e) {
    console.error('❌ Error al generar el logo:', e);
    await conn.sendMessage(m.chat, {
      text: '❌ Error al generar el logo. Prueba con otro estilo.'
    }, { quoted: m });
  }
}

const handler = async (m, { conn, args, command }) => {
  if (command !== 'logo') {
    return conn.sendMessage(m.chat, {
      text: '❌ El comando no existe.'
    }, { quoted: m });
  }

  if (!args || args.length < 2) {
    const lista = estilosDisponibles.slice(0, 20).map(e => `- ${e}`).join('\n') + '\n...';
    return conn.sendMessage(m.chat, {
      text: `✏️ Uso incorrecto.\n\nEjemplo:\n/logo neon-logo Kirito-Bot\n\nEstilos disponibles:\n${lista}`
    }, { quoted: m });
  }

  const estilo = args[0].toLowerCase();
  const texto = args.slice(1).join(' ');

  if (!estilosDisponibles.includes(estilo)) {
    const lista = estilosDisponibles.slice(0, 20).map(e => `- ${e}`).join('\n') + '\n...';
    return conn.sendMessage(m.chat, {
      text: `❌ El estilo *${estilo}* no está disponible.\n\nEstilos disponibles:\n${lista}`
    }, { quoted: m });
  }

  await generarLogo(estilo, texto, m, conn);
};

handler.help = ['logo'];
handler.tags = ['fun'];
handler.command = ['logo'];
handler.group = false; // o true si deseas que solo funcione en grupos

export default handler;
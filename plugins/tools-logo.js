//© Código hecho por Deylin

import axios from 'axios';

const estilosDisponibles = [
  '3d', '3d-fancy-logo', '3d-glitter-logo', '3d-graffiti-logo', '3d-horror-logo',
  '3d-logo', '3d-love-logo', '3d-magma-lava-logo', '3d-textured-logo',
  '80s-retro-logo', 'alien-glow', 'amped', 'angel', 'anonymous', 'aqua-logo',
  'army', 'baby-logo', 'balloon-logo', 'bevel-logo', 'birthday-logo',
  'blue-logo', 'blue-metal', 'brick-logo', 'burn-logo', 'burning-paper-logo',
  'burning-wood-logo', 'burnt-wood-logo', 'candy-logo', 'cartoon-logo',
  'chrome-logo', 'classic-3d-logo', 'classic-text-logo', 'comic-logo',
  'cool-logo', 'crisp-logo', 'cutout-logo', 'dance-logo', 'dark-logo',
  'decor-logo', 'deep-logo', 'deluxe-logo', 'dinamic-logo', 'distressed-logo',
  'dragon-logo', 'electric-logo', 'emboss-logo', 'engraved-logo',
  'fiery-ablaze-logo', 'fire-logo', 'flaming-logo', 'fluffy-logo',
  'funky-logo', 'furry-logo', 'glossy-logo', 'glow-hot-logo', 'glow-logo',
  'golden-3d-logo', 'gradient-logo', 'graffiti-logo', 'gray-logo', 'green-logo',
  'harry-logo', 'ice-logo', 'jewelry-logo', 'lava-igneous-logo', 'lava-logo',
  'light-glow-logo', 'liquid-logo', 'long-shadow-logo', 'love-logo',
  'magnet-logo', 'metal-logo', 'neon-logo', 'outline-logo', 'pencil-logo',
  'pink-logo', 'plasma-logo', 'pop-logo', 'popsicle-logo', 'purple-logo',
  'rainbow-logo', 'realistic-3d-logo', 'realistic-logo', 'retro-logo',
  'sci-fi-logo', 'shiny-logo', 'sketch-logo', 'slime-logo', 'smurfs-logo',
  'snow-logo', 'space-logo', 'stamp-logo', 'sticker-logo', 'stone-logo',
  'summer-logo', 'superhero-logo', 'swamp-logo', 'textured-3d-logo',
  'urban-logo', 'vintage-logo', 'war-logo', 'water-logo', 'winner-logo',
  'wrooom-logo'
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
  if (command!== 'logo') {
    return conn.sendMessage(m.chat, {
      text: '❌ El comando no existe.'
    }, { quoted: m });
  }

  if (!args |

| args.length < 2) {
    const listaEstilosCorta = estilosDisponibles.slice(0, 20).map(e => `- ${e}`).join('\n') + '\n...';
    return conn.sendMessage(m.chat, {
      text: `✏️ Uso incorrecto.\n\nEjemplo:\n/logo neon-logo Kirito-Bot\n\nEstilos disponibles:\n${listaEstilosCorta}`
    }, { quoted: m });
  }

  const estiloSolicitado = args.toLowerCase();
  const textoLogo = args.slice(1).join(' ');

  if (!estilosDisponibles.includes(estiloSolicitado)) {
    const listaEstilosCorta = estilosDisponibles.slice(0, 50).map(e => `- ${e}`).join('\n') + '\n...';
    return conn.sendMessage(m.chat, {
      text: `❌ El estilo *${estiloSolicitado}* no está disponible.\n\nEstilos disponibles:\n${listaEstilosCorta}`
    }, { quoted: m });
  }

  await generarLogo(estiloSolicitado, textoLogo, m, conn);
};

handler.help = ['logo'];
handler.tags = ['fun'];
handler.command = ['logo'];
handler.group = false; // o true si deseas que solo funcione en grupos

export default handler;

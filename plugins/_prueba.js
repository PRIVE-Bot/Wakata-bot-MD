import { performance } from 'perf_hooks';
import fs from 'fs';

const handler = async (m, { conn, text }) => {
  const start = performance.now();
  const end = performance.now();
  const executionTime = (end - start);

  async function loading() {
    const steps = [
      "⚡ Iniciando conexión segura con el servidor...",
      "🔍 Escaneando puertos abiertos...",
      "📡 Handshake completado con dirección IP 192.168.25.93",
      "📂 Extrayendo metadatos del dispositivo...",
      `⏳ Progreso: ${getRandomInt(5, 15)}%`,
      `⏳ Progreso: ${getRandomInt(20, 35)}%`,
      "🔑 Obteniendo claves de autenticación...",
      `⏳ Progreso: ${getRandomInt(40, 55)}%`,
      "💾 Descargando registros del sistema...",
      `⏳ Progreso: ${getRandomInt(60, 75)}%`,
      "🛡 Eliminando rastros digitales...",
      `⏳ Progreso: ${getRandomInt(80, 95)}%`,
      "✅ HACKING COMPLETED",
      "📤 Enviando archivos recopilados al servidor...",
      "📡 Transmisión finalizada — Conexión cerrada."
    ];

    let { key } = await conn.sendMessage(
      m.chat,
      { text: `*☠ Iniciando proceso de doxxing...*` },
      { quoted: m }
    );

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, getRandomInt(700, 2000)));
      await conn.sendMessage(m.chat, { text: steps[i], edit: key }, { quoted: m });
    }

    // Crear información falsa
    const fakeData = generateFakeInfo();
    const filePath = './fake_logs.txt';
    fs.writeFileSync(filePath, fakeData);

    // Enviar como documento
    await conn.sendMessage(
      m.chat,
      { document: { url: filePath }, mimetype: 'text/plain', fileName: 'logs_hackeados.txt' },
      { quoted: m }
    );
  }

  loading();
};

handler.help = ['doxxing <nombre> | <@tag>'];
handler.tags = ['fun'];
handler.command = ['doxxing'];
handler.group = true;
handler.register = true;

export default handler;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateFakeInfo() {
  const ips = Array.from({ length: 5 }, () => `192.168.${getRandomInt(0, 255)}.${getRandomInt(0, 255)}`);
  const emails = Array.from({ length: 5 }, () => `${randomString(6)}@gmail.com`);
  const passwords = Array.from({ length: 5 }, () => randomString(10));
  const cookies = Array.from({ length: 5 }, () => `session_${randomString(15)}`);
  const phones = Array.from({ length: 5 }, () => `+${getRandomInt(1, 99)}${getRandomInt(100000000, 999999999)}`);

  return `
========= 📂 DOXX REPORT LOGS 📂 =========

👤 Nombre: ${randomString(7)} ${randomString(8)}
📌 Ubicación aproximada: ${getRandomInt(1, 255)}.${getRandomInt(1, 255)}.${getRandomInt(1, 255)}.${getRandomInt(1, 255)} (GeoIP tracking)
📱 Teléfono: ${phones.join(', ')}

🌐 IPs detectadas:
${ips.join('\n')}

📧 Emails encontrados:
${emails.join('\n')}

🔑 Contraseñas filtradas:
${passwords.join('\n')}

🍪 Cookies de sesión:
${cookies.join('\n')}

📜 Historial de navegación:
- https://facebook.com/${randomString(6)}
- https://instagram.com/${randomString(6)}
- https://tiktok.com/@${randomString(6)}
- https://youtube.com/watch?v=${randomString(11)}

🖥 Logs del sistema:
[${new Date().toISOString()}] ERROR: Kernel panic detected
[${new Date().toISOString()}] WARNING: Unauthorized root access
[${new Date().toISOString()}] INFO: Malware signature "trojan.win32" removed
[${new Date().toISOString()}] INFO: Backdoor opened on port ${getRandomInt(1000, 9999)}

=========================================
⚠️ Datos transmitidos al servidor remoto con éxito.
`;
}

function randomString(length) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
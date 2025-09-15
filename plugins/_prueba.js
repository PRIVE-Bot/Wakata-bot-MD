// plugins/generar-factura.js
// Generador de facturas en imagen con logo por URL
// Dependencias: npm install canvas axios

import { createCanvas, loadImage } from "canvas";
import axios from "axios";

function formatMoney(n, currency = "") {
  return (
    (Number(n) || 0).toLocaleString("es-HN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + (currency ? ` ${currency}` : "")
  );
}

async function generateInvoice(data = {}) {
  const W = 900;
  const H = 1200;
  const padding = 40;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  // Fondo llamativo (degradado)
  const gradient = ctx.createLinearGradient(0, 0, W, 0);
  gradient.addColorStop(0, "#f43f5e"); // rojo
  gradient.addColorStop(1, "#3b82f6"); // azul
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, 180);

  // Logo desde URL
  if (data.logoUrl) {
    try {
      const res = await axios.get(data.logoUrl, { responseType: "arraybuffer" });
      const img = await loadImage(res.data);
      ctx.drawImage(img, padding, 20, 130, 130);
    } catch (e) {
      console.log("No se pudo cargar el logo:", e.message);
    }
  }

  // Título y datos vendedor
  ctx.fillStyle = "#fff";
  ctx.font = "bold 32px Sans";
  ctx.fillText(data.seller?.name || "Mi Empresa", padding + 160, 70);
  ctx.font = "20px Sans";
  ctx.fillText(data.seller?.address || "", padding + 160, 105);
  ctx.fillText(data.seller?.phone || "", padding + 160, 135);

  // Factura info (derecha)
  ctx.textAlign = "right";
  ctx.font = "bold 28px Sans";
  ctx.fillText(data.invoiceNumber || "FACTURA", W - padding, 70);
  ctx.font = "20px Sans";
  ctx.fillText(data.date || new Date().toLocaleDateString(), W - padding, 110);
  ctx.textAlign = "left";

  // Cliente
  const boxY = 220;
  ctx.fillStyle = "#f9fafb";
  ctx.fillRect(padding, boxY, W - padding * 2, 110);
  ctx.fillStyle = "#111827";
  ctx.font = "bold 22px Sans";
  ctx.fillText("Cliente:", padding + 12, boxY + 35);
  ctx.font = "20px Sans";
  ctx.fillText(data.buyer?.name || "-", padding + 12, boxY + 70);

  // Tabla de items
  const tableTop = boxY + 150;
  const colX = [padding + 12, 500, 680, 820];
  ctx.fillStyle = "#374151";
  ctx.font = "bold 20px Sans";
  ctx.fillText("Descripción", colX[0], tableTop);
  ctx.fillText("Cant.", colX[1], tableTop);
  ctx.fillText("P. Unit", colX[2], tableTop);
  ctx.fillText("Total", colX[3], tableTop);

  ctx.strokeStyle = "#d1d5db";
  ctx.beginPath();
  ctx.moveTo(padding, tableTop + 10);
  ctx.lineTo(W - padding, tableTop + 10);
  ctx.stroke();

  let y = tableTop + 40;
  let subTotal = 0;
  for (const it of data.items || []) {
    const total = (Number(it.qty) || 0) * (Number(it.unit) || 0);
    subTotal += total;

    ctx.fillStyle = "#111827";
    ctx.font = "18px Sans";
    ctx.fillText(it.desc || "-", colX[0], y);
    ctx.fillText(String(it.qty || 0), colX[1], y);
    ctx.fillText(formatMoney(it.unit, data.currency), colX[2], y);
    ctx.fillText(formatMoney(total, data.currency), colX[3], y);
    y += 32;
  }

  const vat = data.vatPercent
    ? subTotal * (Number(data.vatPercent) / 100)
    : 0;
  const total = subTotal + vat;
  const totalsY = H - 200;

  ctx.font = "bold 20px Sans";
  ctx.fillText("Subtotal:", colX[2], totalsY);
  ctx.fillText(formatMoney(subTotal, data.currency), colX[3], totalsY);
  ctx.fillText(`IVA ${data.vatPercent || 0}%:`, colX[2], totalsY + 30);
  ctx.fillText(formatMoney(vat, data.currency), colX[3], totalsY + 30);

  ctx.fillStyle = "#dc2626";
  ctx.font = "bold 26px Sans";
  ctx.fillText("Total:", colX[2], totalsY + 80);
  ctx.fillText(formatMoney(total, data.currency), colX[3], totalsY + 80);

  return canvas.toBuffer("image/png");
}

// Handler para el bot
let handler = async (m, { conn }) => {
  const data = {
    invoiceNumber: "F001-0007",
    date: "2025-09-15",
    seller: {
      name: "Mode Store",
      address: "Avenida Central",
      phone: "+504 9999-9999",
    },
    buyer: { name: "Cliente Demo" },
    items: [
      { desc: "Producto A", qty: 2, unit: 12.5 },
      { desc: "Servicio B", qty: 1, unit: 40.0 },
    ],
    currency: "USD",
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
  };

  const buffer = await generateInvoice(data);
  await conn.sendMessage(
    m.chat,
    { image: buffer, caption: `Factura ${data.invoiceNumber}` },
    { quoted: m }
  );
};

handler.command = ["generarfactura"];
handler.help = ["generarfactura"];
handler.tags = ["herramientas"];

export default handler;
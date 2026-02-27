const { createCanvas, loadImage } = require("canvas");
const PDFDocument = require("pdfkit");
const sharp = require("sharp");

async function renderCanvas(width, height, elements, backgroundColor) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // background
  ctx.fillStyle = backgroundColor || "#ffffff";
  ctx.fillRect(0, 0, width, height);

  for (const el of elements) {
    switch (el.type) {
      case "rect":
        ctx.fillStyle = el.color;
        ctx.fillRect(el.x, el.y, el.width, el.height);
        break;

      case "circle":
        ctx.beginPath();
        ctx.arc(el.x, el.y, el.radius, 0, Math.PI * 2);
        ctx.fillStyle = el.color;
        ctx.fill();
        break;

      case "text":
        ctx.fillStyle = el.color;
        ctx.font = `${el.fontSize}px Arial`;
        ctx.fillText(el.text, el.x, el.y);
        break;

      case "image":
        const img = await loadImage(el.url);
        ctx.drawImage(img, el.x, el.y, el.width, el.height);
        break;
    }
  }

  return canvas;
}

async function exportPDF(canvas) {
  const imageBuffer = canvas.toBuffer("image/png");

  const compressed = await sharp(imageBuffer)
    .jpeg({ quality: 80 })
    .toBuffer();

  const doc = new PDFDocument({
    size: [canvas.width, canvas.height],
  });

  const chunks = [];

  doc.on("data", (chunk) => chunks.push(chunk));
  doc.image(compressed, 0, 0, {
    width: canvas.width,
    height: canvas.height,
  });

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
  });
}

module.exports = { renderCanvas, exportPDF };
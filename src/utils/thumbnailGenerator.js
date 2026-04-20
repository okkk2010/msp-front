export async function generateThumbnail(overlayJson) {
  const width = 640;
  const height = 360;
  const shapes = (overlayJson.elements ?? [])
    .filter((element) => element.visible !== false)
    .map((element) => renderElement(element))
    .join("");

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${overlayJson.canvas.baseWidth} ${overlayJson.canvas.baseHeight}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="#111827" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)" />
      <g opacity="0.08">
        ${buildGrid(overlayJson.canvas.baseWidth, overlayJson.canvas.baseHeight)}
      </g>
      <g opacity="${overlayJson.overlaySettings.opacity}">
        ${shapes}
      </g>
      <rect x="28" y="28" width="420" height="96" rx="20" fill="rgba(15, 23, 42, 0.78)" />
      <text x="56" y="74" fill="#f8fafc" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="700">
        ${escapeXml(overlayJson.name || "MSP Overlay")}
      </text>
      <text x="56" y="108" fill="#94a3b8" font-family="Segoe UI, Arial, sans-serif" font-size="18">
        ${escapeXml(overlayJson.overlayId || "")}
      </text>
    </svg>
  `.trim();

  const pngBlob = await renderSvgToPngBlob(svg, width, height);

  return {
    blob: pngBlob,
    filename: "thumbnail.png",
  };
}

async function renderSvgToPngBlob(svg, width, height) {
  const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const objectUrl = URL.createObjectURL(svgBlob);

  try {
    const image = await loadImage(objectUrl);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas 2D context를 만들 수 없습니다.");
    }

    context.drawImage(image, 0, 0, width, height);

    const pngBlob = await canvasToBlob(canvas, "image/png");
    if (!pngBlob) {
      throw new Error("PNG 썸네일을 생성할 수 없습니다.");
    }

    return pngBlob;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("썸네일 SVG를 로드할 수 없습니다."));
    image.src = src;
  });
}

function canvasToBlob(canvas, type) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type);
  });
}

function renderElement(element) {
  const opacity = normalizeOpacity(element.opacity);

  if (element.type === "rect") {
    return `<rect x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}" rx="${element.cornerRadius ?? 0}" fill="${escapeXml(element.fillColor)}" stroke="${escapeXml(element.strokeColor)}" stroke-width="${element.strokeWidth}" opacity="${opacity}" />`;
  }

  if (element.type === "circle") {
    return `<ellipse cx="${element.x + element.width / 2}" cy="${element.y + element.height / 2}" rx="${element.width / 2}" ry="${element.height / 2}" fill="${escapeXml(element.fillColor)}" stroke="${escapeXml(element.strokeColor)}" stroke-width="${element.strokeWidth}" opacity="${opacity}" />`;
  }

  return `<line x1="${element.x1}" y1="${element.y1}" x2="${element.x2}" y2="${element.y2}" stroke="${escapeXml(element.strokeColor)}" stroke-width="${element.strokeWidth}" stroke-linecap="round" stroke-dasharray="${getDashArray(element.dashStyle)}" opacity="${opacity}" />`;
}

function buildGrid(width, height) {
  const vertical = Array.from({ length: Math.ceil(width / 160) + 1 }, (_, index) => {
    const x = index * 160;
    return `<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="#ffffff" stroke-width="1" />`;
  }).join("");

  const horizontal = Array.from({ length: Math.ceil(height / 160) + 1 }, (_, index) => {
    const y = index * 160;
    return `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="#ffffff" stroke-width="1" />`;
  }).join("");

  return vertical + horizontal;
}

function getDashArray(dashStyle) {
  if (dashStyle === "dash") {
    return "18 12";
  }

  if (dashStyle === "dot") {
    return "6 10";
  }

  return "";
}

function normalizeOpacity(value) {
  if (typeof value !== "number") {
    return 1;
  }

  return value > 1 ? value / 100 : value;
}

function escapeXml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

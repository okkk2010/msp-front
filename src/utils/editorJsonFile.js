export function buildOverlayJsonFilename(name) {
  const normalized = String(name ?? "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_-]/g, "");

  return `${normalized || "overlay"}_overlay.json`;
}

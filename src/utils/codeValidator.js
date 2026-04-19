export function isValidOverlayCode(code) {
  return /^[A-Z0-9]{6}$/.test((code ?? "").toUpperCase());
}

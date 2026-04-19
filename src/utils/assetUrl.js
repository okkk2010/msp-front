export function buildAssetUrl(path) {
  if (!path) {
    return null;
  }

  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
  return new URL(path, baseUrl).toString();
}

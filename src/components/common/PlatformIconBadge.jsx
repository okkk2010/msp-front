import { AndroidIcon, WindowsIcon } from "./PlatformTabs";

export function PlatformIconBadge({ platform, size = "md" }) {
  const normalized = normalizePlatform(platform);
  const isAndroid = normalized === "android";
  const label = isAndroid ? "Android" : normalized === "windows" ? "Windows" : "플랫폼 없음";
  const Icon = isAndroid ? AndroidIcon : WindowsIcon;
  const sizeClass = size === "lg" ? "h-5 w-5" : "h-4 w-4";

  return (
    <span
      aria-label={label}
      className="inline-flex h-8 min-w-8 items-center justify-center rounded-full border border-[var(--color-accent-soft)] bg-[var(--color-accent-soft)] px-2 text-[var(--color-accent)]"
      title={label}
    >
      <Icon className={sizeClass} />
    </span>
  );
}

function normalizePlatform(platform) {
  if (!platform) {
    return "";
  }

  if (typeof platform === "string") {
    return platform.toLowerCase();
  }

  return String(platform.slug ?? platform.name ?? "").toLowerCase();
}

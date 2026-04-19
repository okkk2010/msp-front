export function formatRelativeDate(value) {
  if (!value) {
    return "";
  }

  const target = new Date(value);

  if (Number.isNaN(target.getTime())) {
    return value;
  }

  const diffInSeconds = Math.floor((Date.now() - target.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const units = [
    { label: "year", seconds: 60 * 60 * 24 * 365 },
    { label: "month", seconds: 60 * 60 * 24 * 30 },
    { label: "day", seconds: 60 * 60 * 24 },
    { label: "hour", seconds: 60 * 60 },
    { label: "minute", seconds: 60 },
  ];

  for (const unit of units) {
    const amount = Math.floor(diffInSeconds / unit.seconds);

    if (amount >= 1) {
      return `${amount} ${unit.label}${amount > 1 ? "s" : ""} ago`;
    }
  }

  return value;
}

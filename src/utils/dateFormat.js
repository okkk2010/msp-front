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
    return "방금 전";
  }

  const units = [
    { label: "년", seconds: 60 * 60 * 24 * 365 },
    { label: "개월", seconds: 60 * 60 * 24 * 30 },
    { label: "일", seconds: 60 * 60 * 24 },
    { label: "시간", seconds: 60 * 60 },
    { label: "분", seconds: 60 },
  ];

  for (const unit of units) {
    const amount = Math.floor(diffInSeconds / unit.seconds);

    if (amount >= 1) {
      return `${amount}${unit.label} 전`;
    }
  }

  return value;
}

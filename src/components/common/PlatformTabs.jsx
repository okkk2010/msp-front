const PLATFORM_TABS = [
  { icon: WindowsIcon, label: "Windows", value: "windows" },
  { icon: AndroidIcon, label: "Android", value: "android" },
];

export function PlatformTabs({ value, onChange }) {
  return (
    <div
      aria-label="플랫폼 선택"
      className="inline-grid w-full grid-cols-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-1 shadow-sm sm:w-auto"
      role="tablist"
    >
      {PLATFORM_TABS.map((tab) => {
        const isActive = value === tab.value;
        const Icon = tab.icon;

        return (
          <button
            aria-label={tab.label}
            aria-selected={isActive}
            className={[
              "flex min-w-20 items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold leading-5 transition sm:min-w-24",
              isActive
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "text-[var(--color-text-sub)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-main)]",
            ].join(" ")}
            key={tab.value}
            onClick={() => onChange(tab.value)}
            role="tab"
            title={tab.label}
            type="button"
          >
            <Icon />
          </button>
        );
      })}
    </div>
  );
}

export function WindowsIcon({ className = "h-5 w-5" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="M4 5.5 11 4v7H4V5.5ZM13 3.6l7-1.5V11h-7V3.6ZM4 13h7v7l-7-1.5V13ZM13 13h7v8.9l-7-1.5V13Z" fill="currentColor" />
    </svg>
  );
}

export function AndroidIcon({ className = "h-5 w-5" }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M8.2 7.2 6.6 4.5m9.2 2.7 1.6-2.7M7 10.8h10M8 9h8a2 2 0 0 1 2 2v5.5A2.5 2.5 0 0 1 15.5 19h-7A2.5 2.5 0 0 1 6 16.5V11a2 2 0 0 1 2-2Zm1.5 3.5h.01M14.5 12.5h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

import { Button } from "../common/Button";

export function UserProfileButton({ userName = "Guest" }) {
  return (
    <Button className="max-w-36 gap-2" variant="secondary">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-xs text-[var(--color-primary)]">
        {userName.slice(0, 1).toUpperCase()}
      </span>
      <span className="min-w-0 truncate">{userName}</span>
    </Button>
  );
}

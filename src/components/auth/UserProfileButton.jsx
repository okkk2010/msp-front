import { Button } from "../common/Button";

export function UserProfileButton({ userName = "Guest" }) {
  return (
    <Button className="gap-2" variant="secondary">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-xs text-[var(--color-primary)]">
        {userName.slice(0, 1).toUpperCase()}
      </span>
      <span>{userName}</span>
    </Button>
  );
}

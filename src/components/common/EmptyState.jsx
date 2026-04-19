import { Card } from "./Card";

export function EmptyState({ description, title }) {
  return (
    <Card className="py-10 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-[var(--color-text-sub)]">{description}</p>
    </Card>
  );
}

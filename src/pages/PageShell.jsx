export function PageShell({ title, description }) {
  return (
    <section className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-text-sub)]">{description}</p>
    </section>
  );
}

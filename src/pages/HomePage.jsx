import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";

const DEFAULT_WINDOWS_DOWNLOAD_URL = "https://github.com/okkk2010/msp-windows/releases/latest";
const windowsDownloadUrl =
  import.meta.env.VITE_WINDOWS_APP_DOWNLOAD_URL?.trim() || DEFAULT_WINDOWS_DOWNLOAD_URL;

export function HomePage() {
  return (
    <section className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <Badge tone="accent">Windows app</Badge>
            <Badge>Android planned</Badge>
          </div>
          <div className="space-y-3">
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-[var(--color-text-main)]">
              Build and share MSP overlay layouts
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[var(--color-text-sub)]">
              Download the Windows app to use overlays locally, then browse community layouts and save the ones that fit your game setup.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              as="a"
              className="whitespace-nowrap"
              href={windowsDownloadUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Download for Windows
            </Button>
            <Button
              as="button"
              className="cursor-not-allowed whitespace-nowrap"
              disabled
              title="Google Play release is not available yet."
              variant="secondary"
            >
              Google Play Coming Soon
            </Button>
          </div>
          <p className="text-xs text-[var(--color-text-sub)]">
            Windows downloads are served from the latest GitHub Release. Android distribution will be connected after the Play Store listing is ready.
          </p>
        </div>

        <Card className="space-y-4 p-5">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Recommended distribution</h2>
            <p className="text-sm leading-6 text-[var(--color-text-sub)]">
              Start with GitHub Releases for the Windows installer. It keeps hosting, version history, checksums, and rollback simple while the project is still moving quickly.
            </p>
          </div>
          <dl className="grid gap-3 text-sm">
            <InfoRow label="Current CTA" value="GitHub Releases" />
            <InfoRow label="Windows fallback" value="Latest release page" />
            <InfoRow label="Google Play" value="Placeholder" />
          </dl>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatusCard
          description="Browse layouts uploaded by other users and compare previews, platform, game, code, and save counts."
          title="Discover"
        />
        <StatusCard
          description="Save useful overlays to your library before adapting them in the editor."
          title="Library"
        />
        <StatusCard
          description="Use the editor to create or adjust overlay JSON for your own play style."
          title="Editor"
        />
      </div>
    </section>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3">
      <dt className="text-[var(--color-text-sub)]">{label}</dt>
      <dd className="truncate font-semibold text-[var(--color-text-main)]">{value}</dd>
    </div>
  );
}

function StatusCard({ title, description }) {
  return (
    <article className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--color-text-sub)]">{description}</p>
    </article>
  );
}

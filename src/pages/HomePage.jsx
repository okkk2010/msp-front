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
            <Badge tone="accent">Windows 앱</Badge>
            <Badge>Android 예정</Badge>
          </div>
          <div className="space-y-3">
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-[var(--color-text-main)]">
              MSP 오버레이 레이아웃을 만들고 공유하세요
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[var(--color-text-sub)]">
              Windows 앱을 내려받아 로컬에서 오버레이를 사용하고, 커뮤니티 레이아웃을 둘러보며 내 게임 환경에 맞는 오버레이를 저장하세요.
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
              Windows용 다운로드
            </Button>
            <Button
              as="button"
              className="cursor-not-allowed whitespace-nowrap"
              disabled
              title="Google Play 출시는 아직 준비 중입니다."
              variant="secondary"
            >
              Google Play 준비 중
            </Button>
          </div>
          <p className="text-xs text-[var(--color-text-sub)]">
            Windows 다운로드는 최신 GitHub Release에서 제공됩니다. Android 배포는 Play Store 등록이 준비된 뒤 연결됩니다.
          </p>
        </div>

        <Card className="space-y-4 p-5">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">권장 배포 방식</h2>
            <p className="text-sm leading-6 text-[var(--color-text-sub)]">
              Windows 설치 파일은 GitHub Releases로 시작합니다. 프로젝트가 빠르게 바뀌는 동안 호스팅, 버전 기록, 체크섬, 롤백을 단순하게 유지할 수 있습니다.
            </p>
          </div>
          <dl className="grid gap-3 text-sm">
            <InfoRow label="현재 CTA" value="GitHub Releases" />
            <InfoRow label="Windows 대체 링크" value="최신 릴리스 페이지" />
            <InfoRow label="Google Play" value="준비 중" />
          </dl>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatusCard
          description="다른 사용자가 올린 레이아웃을 둘러보고 미리보기, 플랫폼, 게임, 코드, 저장 수를 비교하세요."
          title="탐색"
        />
        <StatusCard
          description="유용한 오버레이를 에디터에서 수정하기 전에 라이브러리에 저장하세요."
          title="라이브러리"
        />
        <StatusCard
          description="에디터로 내 플레이 스타일에 맞는 오버레이 JSON을 만들거나 조정하세요."
          title="에디터"
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

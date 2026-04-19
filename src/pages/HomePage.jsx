import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { Input } from "../components/common/Input";
import { Select } from "../components/common/Select";
import { Textarea } from "../components/common/Textarea";

export function HomePage() {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <span className="inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-medium text-[var(--color-primary)]">
          Step 2
        </span>
        <h1 className="text-4xl font-bold tracking-tight">msp overlay frontend</h1>
        <p className="max-w-3xl text-base text-[var(--color-text-sub)]">
          문서 기준 2단계에 맞춰 공통 UI와 헤더 스타일을 정리했습니다. 아래 섹션은 버튼,
          배지, 입력창, 카드 톤을 한 화면에서 확인하기 위한 디자인 프리뷰입니다.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatusCard
          description="Primary, Secondary, Ghost 버튼 스타일을 공통 컴포넌트로 분리했습니다."
          title="Buttons"
        />
        <StatusCard
          description="배지, 입력창, 카드 스타일이 문서의 다크 톤과 단일 포인트 컬러 기준을 따릅니다."
          title="Tokens"
        />
        <StatusCard
          description="헤더는 데스크톱 네비게이션과 모바일 Drawer 구조를 모두 갖춘 상태입니다."
          title="Header"
        />
      </div>
      <Card className="space-y-6 p-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">UI Preview</h2>
          <p className="text-sm text-[var(--color-text-sub)]">
            공통 UI는 Discover, Detail, Editor 전반에서 재사용할 수 있는 기본형으로 구성했습니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>Windows</Badge>
          <Badge>Minecraft</Badge>
          <Badge tone="primary">A1B2C3</Badge>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button>Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Overlay name" />
          <Select defaultValue="windows">
            <option value="windows">Windows</option>
            <option value="android">Android</option>
          </Select>
          <div className="md:col-span-2">
            <Textarea placeholder="짧은 설명을 입력합니다." />
          </div>
        </div>
      </Card>
    </section>
  );
}

function StatusCard({ title, description }) {
  return (
    <article className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--color-text-sub)]">{description}</p>
    </article>
  );
}

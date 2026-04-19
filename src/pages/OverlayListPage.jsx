import { OverlayCard } from "../components/overlay/OverlayCard";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Select } from "../components/common/Select";
import { useOverlaySearch } from "../hooks/useOverlaySearch";

export function OverlayListPage() {
  const { filters, resetFilters, setCode, setKeyword, setPlatform, setSort } =
    useOverlaySearch();

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Overlay Discover</h1>
        <p className="text-sm text-[var(--color-text-sub)]">
          4단계 기준으로 검색/필터 상태를 store에 연결했습니다. 실제 API 호출은 다음 단계에서 이
          상태를 그대로 사용하면 됩니다.
        </p>
      </div>
      <div className="grid gap-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 md:grid-cols-4">
        <Input
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="keyword"
          value={filters.keyword}
        />
        <Input
          onChange={(event) => setCode(event.target.value.toUpperCase())}
          placeholder="6-digit code"
          value={filters.code}
        />
        <Select
          onChange={(event) => setPlatform(event.target.value)}
          value={filters.platform}
        >
          <option value="">All Platforms</option>
          <option value="windows">Windows</option>
          <option value="android">Android</option>
        </Select>
        <Select onChange={(event) => setSort(event.target.value)} value={filters.sort}>
          <option value="newest">Newest</option>
          <option value="updated">Updated</option>
          <option value="saved">Saved</option>
        </Select>
        <div className="md:col-span-4 flex items-center justify-between gap-3">
          <p className="text-sm text-[var(--color-text-sub)]">
            page {filters.page + 1} · size {filters.size}
          </p>
          <Button onClick={resetFilters} variant="secondary">
            Reset Filters
          </Button>
        </div>
      </div>
      <div className="grid gap-4">
        {MOCK_CARDS.map((item) => (
          <OverlayCard
            key={item.code}
            {...item}
            onClick={() => {}}
            onSave={() => {}}
          />
        ))}
      </div>
    </section>
  );
}

const MOCK_CARDS = [
  {
    name: "Combat Assist Overlay",
    description: "원형 범위와 선형 가이드가 포함된 전투 보조 오버레이 프리셋입니다.",
    code: "A1B2C3",
    platform: { name: "Windows" },
    game: { displayName: "Minecraft" },
    author: { name: "MSP Team" },
    elementTypes: ["Circle", "Line"],
    savedCount: 24,
    isSaved: false,
    updatedAt: "3 days ago",
  },
  {
    name: "Raid Marker Pack",
    description: "파티 포지셔닝을 빠르게 파악할 수 있게 도형 배치를 정리한 레이드용 프리셋입니다.",
    code: "Q7W8E9",
    platform: { name: "Windows" },
    game: { displayName: "Lost Ark" },
    author: { name: "OverlayLab" },
    elementTypes: ["Rect", "Circle", "Line"],
    savedCount: 63,
    isSaved: true,
    updatedAt: "1 day ago",
  },
];

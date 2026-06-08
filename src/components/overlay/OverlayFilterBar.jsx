import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { Select } from "../common/Select";

const SORT_TABS = [
  { label: "최신", value: "newest" },
  { label: "업데이트", value: "updated" },
  { label: "인기", value: "saved" },
];

export function OverlayFilterBar({
  filters,
  games,
  onGameChange,
  onReset,
  onSortChange,
}) {
  const gameHelpText =
    filters.platform === "android"
      ? "Android 플랫폼의 게임만 표시합니다."
      : "Windows 플랫폼의 게임만 표시합니다.";

  return (
    <Card className="space-y-5 p-4">
      <div className="space-y-1">
        <h2 className="text-base font-semibold">결과 필터</h2>
        <p className="text-sm leading-5 text-[var(--color-text-sub)]">
          선택한 플랫폼 안에서 게임과 정렬 기준으로 목록을 좁혀보세요.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {SORT_TABS.map((tab) => (
          <Button
            className="justify-center whitespace-nowrap px-3"
            key={tab.value}
            onClick={() => onSortChange(tab.value)}
            variant={filters.sort === tab.value ? "primary" : "secondary"}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text-main)]" htmlFor="game-filter">
            게임
          </label>
          <Select id="game-filter" onChange={onGameChange} value={filters.game}>
            <option value="">모든 게임</option>
            {games.map((game) => (
              <option key={game.id} value={game.slug || game.id}>
                {game.displayName}
              </option>
            ))}
          </Select>
          <p className="text-xs leading-5 text-[var(--color-text-sub)]">{gameHelpText}</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text-main)]" htmlFor="sort-filter">
            정렬
          </label>
          <Select id="sort-filter" onChange={(event) => onSortChange(event.target.value)} value={filters.sort}>
            <option value="newest">최신순</option>
            <option value="updated">최근 업데이트순</option>
            <option value="saved">저장 많은 순</option>
          </Select>
        </div>
      </div>

      <Button className="w-full" onClick={onReset} variant="secondary">
        필터 초기화
      </Button>
    </Card>
  );
}

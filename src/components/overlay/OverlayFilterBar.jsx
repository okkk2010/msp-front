import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { Select } from "../common/Select";

const CATEGORY_TABS = [
  { label: "All", platform: "", sort: "newest" },
  { label: "Windows", platform: "windows", sort: "newest" },
  { label: "Android", platform: "android", sort: "newest" },
  { label: "Popular", platform: "", sort: "saved" },
  { label: "Recent", platform: "", sort: "updated" },
];

export function OverlayFilterBar({
  filters,
  games,
  onGameChange,
  onPlatformChange,
  onReset,
  onSelectCategory,
  onSortChange,
  platforms,
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {CATEGORY_TABS.map((tab) => (
          <Button
            key={tab.label}
            onClick={() => onSelectCategory(tab)}
            variant={isCategoryActive(filters, tab) ? "primary" : "secondary"}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Card className="space-y-5 p-5">
          <div className="space-y-2">
            <h2 className="text-base font-semibold">Filter Sidebar</h2>
            <p className="text-sm text-[var(--color-text-sub)]">
              플랫폼과 게임 기준으로 목록을 좁힐 수 있습니다.
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-text-main)]" htmlFor="platform-filter">
              Platform
            </label>
            <Select id="platform-filter" onChange={onPlatformChange} value={filters.platform}>
              <option value="">All Platforms</option>
              {platforms.map((platform) => (
                <option key={platform.slug} value={platform.slug}>
                  {platform.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--color-text-main)]" htmlFor="game-filter">
              Game
            </label>
            <Select id="game-filter" onChange={onGameChange} value={filters.game}>
              <option value="">All Games</option>
              {games.map((game) => (
                <option key={game.id} value={game.slug || game.id}>
                  {game.displayName}
                </option>
              ))}
            </Select>
          </div>
          <Button className="w-full" onClick={onReset} variant="secondary">
            Reset Filters
          </Button>
        </Card>
        <Card className="flex items-center justify-between gap-4 p-5">
          <div>
            <h2 className="text-base font-semibold">Sort by</h2>
            <p className="text-sm text-[var(--color-text-sub)]">
              목록 정렬은 API query parameter와 같은 값을 사용합니다.
            </p>
          </div>
          <Select className="w-full max-w-xs" onChange={onSortChange} value={filters.sort}>
            <option value="newest">Newest</option>
            <option value="updated">Recently Updated</option>
            <option value="saved">Most Saved</option>
          </Select>
        </Card>
      </div>
    </div>
  );
}

function isCategoryActive(filters, tab) {
  return filters.platform === tab.platform && filters.sort === tab.sort;
}

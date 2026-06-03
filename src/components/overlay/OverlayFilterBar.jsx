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
  const gameHelpText = filters.platform
    ? "Showing games for the selected platform."
    : "Showing Windows games by default. Choose a platform to narrow this list.";

  return (
    <Card className="space-y-5 p-4">
      <div className="space-y-1">
        <h2 className="text-base font-semibold">Refine results</h2>
        <p className="text-sm leading-5 text-[var(--color-text-sub)]">
          Narrow the list by platform, game, or how the community uses each overlay.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {CATEGORY_TABS.map((tab) => (
          <Button
            className="justify-center px-3"
            key={tab.label}
            onClick={() => onSelectCategory(tab)}
            variant={isCategoryActive(filters, tab) ? "primary" : "secondary"}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
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
          <p className="text-xs leading-5 text-[var(--color-text-sub)]">{gameHelpText}</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text-main)]" htmlFor="sort-filter">
            Sort
          </label>
          <Select id="sort-filter" onChange={onSortChange} value={filters.sort}>
            <option value="newest">Newest</option>
            <option value="updated">Recently Updated</option>
            <option value="saved">Most Saved</option>
          </Select>
        </div>
      </div>

      <Button className="w-full" onClick={onReset} variant="secondary">
        Reset Filters
      </Button>
    </Card>
  );
}

function isCategoryActive(filters, tab) {
  return filters.platform === tab.platform && filters.sort === tab.sort;
}

import { Input } from "../common/Input";

export function OverlaySearchBar({ onChange, value }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[var(--color-text-main)]" htmlFor="overlay-search">
        Main Search
      </label>
      <Input
        id="overlay-search"
        onChange={onChange}
        placeholder="Search overlays, games, or creators..."
        value={value}
      />
    </div>
  );
}

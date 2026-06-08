import { Input } from "../common/Input";

export function OverlaySearchBar({ onChange, value }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[var(--color-text-main)]" htmlFor="overlay-search">
        통합 검색
      </label>
      <Input
        id="overlay-search"
        onChange={onChange}
        placeholder="오버레이, 게임, 제작자 검색..."
        value={value}
      />
    </div>
  );
}

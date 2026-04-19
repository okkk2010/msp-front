import { Input } from "../common/Input";

export function OverlayCodeSearch({ onChange, value }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[var(--color-text-main)]" htmlFor="overlay-code">
        Code Search
      </label>
      <Input
        id="overlay-code"
        maxLength={6}
        onChange={onChange}
        placeholder="Enter 6-digit code"
        value={value}
      />
    </div>
  );
}

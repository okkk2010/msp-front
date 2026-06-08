import { Input } from "../common/Input";

export function OverlayCodeSearch({ onChange, value }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[var(--color-text-main)]" htmlFor="overlay-code">
        코드 검색
      </label>
      <Input
        id="overlay-code"
        maxLength={6}
        onChange={onChange}
        placeholder="6자리 코드 입력"
        value={value}
      />
    </div>
  );
}

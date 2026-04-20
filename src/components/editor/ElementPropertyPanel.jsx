import { Card } from "../common/Card";
import { ColorPicker } from "../common/ColorPicker";
import { Input } from "../common/Input";
import { Select } from "../common/Select";

const FIELD_MAP = {
  rect: ["x", "y", "width", "height", "rotation", "opacity", "zIndex", "strokeWidth", "cornerRadius"],
  circle: ["x", "y", "width", "height", "rotation", "opacity", "zIndex", "strokeWidth"],
  line: ["x1", "y1", "x2", "y2", "opacity", "zIndex", "strokeWidth"],
};

export function ElementPropertyPanel({ element, onChange }) {
  if (!element) {
    return (
      <Card className="min-h-[360px] p-5">
        <h2 className="text-base font-semibold">Property Panel</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-text-sub)]">
          요소를 선택하면 속성을 편집할 수 있습니다.
        </p>
      </Card>
    );
  }

  const fields = FIELD_MAP[element.type] ?? [];

  return (
    <Card className="min-h-[360px] space-y-4 p-5">
      <div>
        <h2 className="text-base font-semibold">Property Panel</h2>
        <p className="mt-1 text-sm text-[var(--color-text-sub)]">
          {element.type} | {element.id}
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field} className="space-y-2 text-sm">
            <span className="text-[var(--color-text-sub)]">{field}</span>
            <Input
              onChange={(event) => onChange(field, normalizeValue(event.target.value))}
              value={element[field] ?? ""}
            />
          </label>
        ))}
        {"fillColor" in element ? (
          <label className="space-y-2 text-sm">
            <span className="text-[var(--color-text-sub)]">fillColor</span>
            <ColorPicker
              onChange={(event) => onChange("fillColor", event.target.value)}
              value={sanitizeColorValue(element.fillColor)}
            />
          </label>
        ) : null}
        {"strokeColor" in element ? (
          <label className="space-y-2 text-sm">
            <span className="text-[var(--color-text-sub)]">strokeColor</span>
            <ColorPicker
              onChange={(event) => onChange("strokeColor", event.target.value)}
              value={sanitizeColorValue(element.strokeColor)}
            />
          </label>
        ) : null}
        {"dashStyle" in element ? (
          <label className="space-y-2 text-sm">
            <span className="text-[var(--color-text-sub)]">dashStyle</span>
            <Select
              onChange={(event) => onChange("dashStyle", event.target.value)}
              value={element.dashStyle}
            >
              <option value="solid">solid</option>
              <option value="dash">dash</option>
              <option value="dot">dot</option>
            </Select>
          </label>
        ) : null}
      </div>
    </Card>
  );
}

function normalizeValue(value) {
  const asNumber = Number(value);
  return Number.isNaN(asNumber) ? value : asNumber;
}

function sanitizeColorValue(value) {
  if (!value || String(value).startsWith("rgba")) {
    return "#38bdf8";
  }

  return value;
}

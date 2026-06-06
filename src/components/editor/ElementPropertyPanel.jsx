import { Card } from "../common/Card";
import { ColorPicker } from "../common/ColorPicker";
import { Input } from "../common/Input";
import { Select } from "../common/Select";

const FIELD_MAP = {
  rect: ["x", "y", "width", "height", "rotation", "opacity", "zIndex", "strokeWidth", "cornerRadius"],
  circle: ["x", "y", "width", "height", "rotation", "opacity", "zIndex", "strokeWidth"],
  line: ["x1", "y1", "x2", "y2", "opacity", "zIndex", "strokeWidth"],
};

const ANCHOR_OPTIONS = ["top-left", "top", "top-right", "left", "center", "right", "bottom-left", "bottom", "bottom-right"];
const ANCHOR_SPACE_OPTIONS = ["safeFrame", "screen"];

const FIELD_LABELS = {
  x: "X 위치",
  y: "Y 위치",
  width: "가로",
  height: "세로",
  rotation: "회전",
  opacity: "투명도",
  zIndex: "레이어 순서",
  strokeWidth: "테두리 두께",
  cornerRadius: "모서리 반경",
  x1: "시작 X",
  y1: "시작 Y",
  x2: "끝 X",
  y2: "끝 Y",
  anchor: "앵커",
  anchorSpace: "앵커 기준",
  fillColor: "채우기 색상",
  strokeColor: "테두리 색상",
  dashStyle: "선 스타일",
};

const FIELD_HELP = {
  x: "오브젝트 왼쪽 기준 X 좌표입니다.",
  y: "오브젝트 위쪽 기준 Y 좌표입니다.",
  width: "오브젝트의 가로 크기입니다.",
  height: "오브젝트의 세로 크기입니다.",
  rotation: "오브젝트 회전값입니다. 현재 렌더러 지원 범위에 맞춰 저장됩니다.",
  opacity: "0에서 1 사이의 투명도입니다.",
  zIndex: "값이 클수록 더 위에 그려집니다.",
  strokeWidth: "테두리 또는 선의 두께입니다.",
  cornerRadius: "사각형 모서리를 둥글게 만드는 반경입니다.",
  x1: "선이 시작되는 X 좌표입니다.",
  y1: "선이 시작되는 Y 좌표입니다.",
  x2: "선이 끝나는 X 좌표입니다.",
  y2: "선이 끝나는 Y 좌표입니다.",
  anchor: "해상도 차이가 날 때 이 오브젝트가 붙어 있을 기준점입니다.",
  anchorSpace: "앵커를 설계 영역 기준으로 볼지, 실제 화면 전체 기준으로 볼지 정합니다.",
  fillColor: "오브젝트 내부 색상입니다.",
  strokeColor: "오브젝트 테두리 또는 선 색상입니다.",
  dashStyle: "선의 실선, 파선, 점선 스타일입니다.",
};

const ANCHOR_LABELS = {
  "top-left": "좌상단",
  top: "상단",
  "top-right": "우상단",
  left: "좌측",
  center: "중앙",
  right: "우측",
  "bottom-left": "좌하단",
  bottom: "하단",
  "bottom-right": "우하단",
};

const ANCHOR_SPACE_LABELS = {
  safeFrame: "설계 영역",
  screen: "전체 화면",
};

export function ElementPropertyPanel({ element, elements = [], onChange }) {
  if (elements.length > 1) {
    return <MultiElementPropertyPanel elements={elements} onChange={onChange} />;
  }

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
            <FieldLabel field={field} />
            <Input
              onChange={(event) => onChange(field, normalizeValue(event.target.value))}
              value={element[field] ?? ""}
            />
          </label>
        ))}
        {element.type === "rect" || element.type === "circle" ? (
          <>
            <label className="space-y-2 text-sm">
              <FieldLabel field="anchor" />
              <Select onChange={(event) => onChange("anchor", event.target.value)} value={element.anchor ?? "top-left"}>
                {ANCHOR_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {ANCHOR_LABELS[option]}
                  </option>
                ))}
              </Select>
            </label>
            <label className="space-y-2 text-sm">
              <FieldLabel field="anchorSpace" />
              <Select onChange={(event) => onChange("anchorSpace", event.target.value)} value={element.anchorSpace ?? "safeFrame"}>
                {ANCHOR_SPACE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {ANCHOR_SPACE_LABELS[option]}
                  </option>
                ))}
              </Select>
            </label>
          </>
        ) : null}
        {"fillColor" in element ? (
          <label className="space-y-2 text-sm">
            <FieldLabel field="fillColor" />
            <ColorPicker
              onChange={(event) => onChange("fillColor", event.target.value)}
              value={sanitizeColorValue(element.fillColor)}
            />
          </label>
        ) : null}
        {"strokeColor" in element ? (
          <label className="space-y-2 text-sm">
            <FieldLabel field="strokeColor" />
            <ColorPicker
              onChange={(event) => onChange("strokeColor", event.target.value)}
              value={sanitizeColorValue(element.strokeColor)}
            />
          </label>
        ) : null}
        {"dashStyle" in element ? (
          <label className="space-y-2 text-sm">
            <FieldLabel field="dashStyle" />
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

function MultiElementPropertyPanel({ elements, onChange }) {
  const fillValue = getCommonValue(elements.filter(hasFillColor), "fillColor");
  const strokeColorValue = getCommonValue(elements.filter(hasStrokeColor), "strokeColor");
  const strokeWidthValue = getCommonValue(elements.filter(hasStrokeWidth), "strokeWidth");
  const cornerRadiusValue = getCommonValue(elements.filter(hasCornerRadius), "cornerRadius");
  const anchorElements = elements.filter(hasAnchor);
  const anchorValue = getCommonValue(anchorElements, "anchor");
  const anchorSpaceValue = getCommonValue(anchorElements, "anchorSpace");

  return (
    <Card className="min-h-[360px] space-y-4 p-5">
      <div>
        <h2 className="text-base font-semibold">Property Panel</h2>
        <p className="mt-1 text-sm text-[var(--color-text-sub)]">
          {elements.length} elements selected
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {elements.some(hasFillColor) ? (
          <label className="space-y-2 text-sm">
            <FieldLabel field="fillColor" />
            <ColorPicker
              onChange={(event) => onChange("fillColor", event.target.value)}
              value={sanitizeColorValue(fillValue)}
            />
          </label>
        ) : null}
        {elements.some(hasStrokeColor) ? (
          <label className="space-y-2 text-sm">
            <FieldLabel field="strokeColor" />
            <ColorPicker
              onChange={(event) => onChange("strokeColor", event.target.value)}
              value={sanitizeColorValue(strokeColorValue)}
            />
          </label>
        ) : null}
        {elements.some(hasStrokeWidth) ? (
          <label className="space-y-2 text-sm">
            <FieldLabel field="strokeWidth" />
            <Input
              onChange={(event) => onChange("strokeWidth", normalizeValue(event.target.value))}
              placeholder={strokeWidthValue === "" ? "mixed" : undefined}
              value={strokeWidthValue}
            />
          </label>
        ) : null}
        {elements.some(hasCornerRadius) ? (
          <label className="space-y-2 text-sm">
            <FieldLabel field="cornerRadius" />
            <Input
              onChange={(event) => onChange("cornerRadius", normalizeValue(event.target.value))}
              placeholder={cornerRadiusValue === "" ? "mixed" : undefined}
              value={cornerRadiusValue}
            />
          </label>
        ) : null}
        {anchorElements.length ? (
          <>
            <label className="space-y-2 text-sm">
              <FieldLabel field="anchor" />
              <Select onChange={(event) => onChange("anchor", event.target.value)} value={anchorValue || "top-left"}>
                {ANCHOR_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {ANCHOR_LABELS[option]}
                  </option>
                ))}
              </Select>
            </label>
            <label className="space-y-2 text-sm">
              <FieldLabel field="anchorSpace" />
              <Select onChange={(event) => onChange("anchorSpace", event.target.value)} value={anchorSpaceValue || "safeFrame"}>
                {ANCHOR_SPACE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {ANCHOR_SPACE_LABELS[option]}
                  </option>
                ))}
              </Select>
            </label>
          </>
        ) : null}
      </div>
    </Card>
  );
}

function FieldLabel({ field }) {
  return (
    <span
      className="inline-flex cursor-help items-center gap-1 text-[var(--color-text-sub)]"
      title={FIELD_HELP[field] ?? FIELD_LABELS[field] ?? field}
    >
      {FIELD_LABELS[field] ?? field}
    </span>
  );
}

function normalizeValue(value) {
  const asNumber = Number(value);
  return Number.isNaN(asNumber) ? value : asNumber;
}

function getCommonValue(elements, field) {
  if (!elements.length) {
    return "";
  }

  const [firstElement] = elements;
  const firstValue = firstElement[field];
  const hasSameValue = elements.every((element) => element[field] === firstValue);

  return hasSameValue ? firstValue : "";
}

function hasFillColor(element) {
  return "fillColor" in element;
}

function hasStrokeColor(element) {
  return "strokeColor" in element;
}

function hasStrokeWidth(element) {
  return "strokeWidth" in element;
}

function hasCornerRadius(element) {
  return "cornerRadius" in element;
}

function hasAnchor(element) {
  return element.type === "rect" || element.type === "circle";
}

function sanitizeColorValue(value) {
  if (!value || String(value).startsWith("rgba")) {
    return "#38bdf8";
  }

  return value;
}

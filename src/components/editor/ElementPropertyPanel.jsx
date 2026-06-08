import { Card } from "../common/Card";
import { ColorPicker } from "../common/ColorPicker";
import { Input } from "../common/Input";
import { Select } from "../common/Select";

const FIELD_MAP = {
  rect: ["x", "y", "width", "height", "rotation", "opacity", "zIndex", "strokeWidth", "cornerRadius"],
  circle: ["x", "y", "width", "height", "rotation", "opacity", "zIndex", "strokeWidth"],
  line: ["x1", "y1", "x2", "y2", "opacity", "zIndex", "strokeWidth"],
};

const MULTI_FIELD_ORDER = [
  "x",
  "y",
  "width",
  "height",
  "rotation",
  "opacity",
  "zIndex",
  "strokeWidth",
  "cornerRadius",
  "anchor",
  "anchorSpace",
  "fillColor",
  "strokeColor",
  "dashStyle",
];

const ANCHOR_OPTIONS = ["top-left", "top", "top-right", "left", "center", "right", "bottom-left", "bottom", "bottom-right"];
const ANCHOR_SPACE_OPTIONS = ["safeFrame", "screen"];

const FIELD_LABELS = {
  x: "X 위치",
  y: "Y 위치",
  width: "너비",
  height: "높이",
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
  width: "오브젝트의 너비입니다.",
  height: "오브젝트의 높이입니다.",
  rotation: "오브젝트 회전값입니다.",
  opacity: "0에서 100 사이의 투명도입니다.",
  zIndex: "값이 클수록 더 앞에 그려집니다.",
  strokeWidth: "테두리 또는 선의 두께입니다.",
  cornerRadius: "사각형 모서리를 둥글게 만드는 반경입니다.",
  x1: "선이 시작되는 X 좌표입니다.",
  y1: "선이 시작되는 Y 좌표입니다.",
  x2: "선이 끝나는 X 좌표입니다.",
  y2: "선이 끝나는 Y 좌표입니다.",
  anchor: "해상도 차이가 있을 때 오브젝트가 붙어 있을 기준점입니다.",
  anchorSpace: "앵커를 안전 영역 기준으로 볼지, 전체 화면 기준으로 볼지 정합니다.",
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
  safeFrame: "안전 영역",
  screen: "전체 화면",
};

const DASH_STYLE_LABELS = {
  solid: "실선",
  dash: "파선",
  dot: "점선",
};

export function ElementPropertyPanel({ element, elements = [], onChange }) {
  if (elements.length > 1) {
    return <MultiElementPropertyPanel elements={elements} onChange={onChange} />;
  }

  if (!element) {
    return (
      <Card className="min-h-[360px] p-5">
        <h2 className="text-base font-semibold">속성 패널</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-text-sub)]">
          요소를 선택하면 속성을 편집할 수 있습니다.
        </p>
      </Card>
    );
  }

  const fields = FIELD_MAP[element.type] ?? [];

  return (
    <Card className="min-h-[360px] space-y-4 p-5">
      <PanelHeader title="속성 패널" subtitle={`${getElementTypeLabel(element.type)} | ${element.id}`} />
      <div className="grid gap-3 md:grid-cols-2">
        {fields.map((field) => (
          <FieldControl
            field={field}
            key={field}
            onChange={onChange}
            value={element[field] ?? ""}
          />
        ))}
        {element.type === "rect" || element.type === "circle" ? (
          <>
            <FieldControl field="anchor" onChange={onChange} value={element.anchor ?? "top-left"} />
            <FieldControl field="anchorSpace" onChange={onChange} value={element.anchorSpace ?? "safeFrame"} />
          </>
        ) : null}
        {"fillColor" in element ? (
          <FieldControl field="fillColor" onChange={onChange} value={sanitizeColorValue(element.fillColor)} />
        ) : null}
        {"strokeColor" in element ? (
          <FieldControl field="strokeColor" onChange={onChange} value={sanitizeColorValue(element.strokeColor)} />
        ) : null}
        {"dashStyle" in element ? (
          <FieldControl field="dashStyle" onChange={onChange} value={element.dashStyle} />
        ) : null}
      </div>
    </Card>
  );
}

function MultiElementPropertyPanel({ elements, onChange }) {
  const fields = MULTI_FIELD_ORDER.filter((field) => elements.some((element) => field in element));

  return (
    <Card className="min-h-[360px] space-y-4 p-5">
      <PanelHeader title="속성 패널" subtitle={`${elements.length}개 요소 선택됨`} />
      <div className="grid gap-3 md:grid-cols-2">
        {fields.map((field) => {
          const fieldElements = elements.filter((element) => field in element);
          const value = getCommonValue(fieldElements, field);

          return (
            <FieldControl
              field={field}
              key={field}
              onChange={onChange}
              placeholder={value === "" ? "혼합됨" : undefined}
              value={getDisplayValue(field, value)}
            />
          );
        })}
      </div>
    </Card>
  );
}

function PanelHeader({ title, subtitle }) {
  return (
    <div>
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-[var(--color-text-sub)]">{subtitle}</p>
    </div>
  );
}

function FieldControl({ field, onChange, placeholder, value }) {
  if (field === "anchor") {
    return (
      <label className="space-y-2 text-sm">
        <FieldLabel field={field} />
        <Select onChange={(event) => onChange(field, event.target.value)} value={value || "top-left"}>
          {ANCHOR_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {ANCHOR_LABELS[option]}
            </option>
          ))}
        </Select>
      </label>
    );
  }

  if (field === "anchorSpace") {
    return (
      <label className="space-y-2 text-sm">
        <FieldLabel field={field} />
        <Select onChange={(event) => onChange(field, event.target.value)} value={value || "safeFrame"}>
          {ANCHOR_SPACE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {ANCHOR_SPACE_LABELS[option]}
            </option>
          ))}
        </Select>
      </label>
    );
  }

  if (field === "fillColor" || field === "strokeColor") {
    return (
      <label className="space-y-2 text-sm">
        <FieldLabel field={field} />
        <ColorPicker
          onChange={(event) => onChange(field, event.target.value)}
          value={sanitizeColorValue(value)}
        />
      </label>
    );
  }

  if (field === "dashStyle") {
    return (
      <label className="space-y-2 text-sm">
        <FieldLabel field={field} />
        <Select onChange={(event) => onChange(field, event.target.value)} value={value || "solid"}>
          {Object.entries(DASH_STYLE_LABELS).map(([option, label]) => (
            <option key={option} value={option}>
              {label}
            </option>
          ))}
        </Select>
      </label>
    );
  }

  return (
    <label className="space-y-2 text-sm">
      <FieldLabel field={field} />
      <Input
        onChange={(event) => onChange(field, normalizeValue(event.target.value))}
        placeholder={placeholder}
        value={value}
      />
    </label>
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

function getElementTypeLabel(type) {
  const labels = {
    rect: "사각형",
    circle: "원",
    line: "선",
  };

  return labels[type] ?? type;
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

function getDisplayValue(field, value) {
  if (field === "fillColor" || field === "strokeColor") {
    return sanitizeColorValue(value);
  }

  return value;
}

function sanitizeColorValue(value) {
  if (!value || String(value).startsWith("rgba")) {
    return "#38bdf8";
  }

  return value;
}

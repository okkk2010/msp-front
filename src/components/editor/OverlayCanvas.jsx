import { useEffect, useMemo, useRef, useState } from "react";

import { Card } from "../common/Card";

export function OverlayCanvas({
  canvas,
  elements,
  onDragElement,
  onSelectElement,
  selectedElementId,
}) {
  const svgRef = useRef(null);
  const dragRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const sortedElements = useMemo(
    () => elements.slice().sort((left, right) => left.zIndex - right.zIndex),
    [elements],
  );
  const visibleElements = useMemo(
    () => sortedElements.filter((element) => element.visible !== false),
    [sortedElements],
  );
  const selectedElement =
    sortedElements.find((element) => element.id === selectedElementId) ?? null;
  const selectedBounds =
    selectedElement && selectedElement.visible !== false ? getElementBounds(selectedElement) : null;

  useEffect(() => {
    function handlePointerMove(event) {
      if (!dragRef.current) {
        return;
      }

      const nextPoint = getSvgPoint(svgRef.current, event, canvas);
      if (!nextPoint) {
        return;
      }

      const dx = nextPoint.x - dragRef.current.lastPoint.x;
      const dy = nextPoint.y - dragRef.current.lastPoint.y;

      if (!dx && !dy) {
        return;
      }

      dragRef.current.lastPoint = nextPoint;
      onDragElement(dragRef.current.elementId, { dx, dy });
    }

    function handlePointerUp() {
      dragRef.current = null;
      setIsDragging(false);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [canvas, onDragElement]);

  return (
    <Card className="flex min-h-[520px] flex-col self-start p-5 xl:sticky xl:top-24">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold">Canvas Area</h2>
          <p className="mt-1 text-sm text-[var(--color-text-sub)]">
            SVG viewBox 기준으로 요소를 렌더링하고, 선택한 요소는 드래그로 이동할 수 있습니다.
          </p>
        </div>
        <div className="text-right text-sm text-[var(--color-text-sub)]">
          <p>
            {canvas.baseWidth} x {canvas.baseHeight}
          </p>
          <p>{visibleElements.length} visible</p>
        </div>
      </div>
      <div className="relative mt-5 flex flex-1 items-center justify-center rounded-3xl border border-dashed border-[var(--color-border)] bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] p-4">
        <div
          className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[#0f172a] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]"
          style={{ aspectRatio: `${canvas.baseWidth} / ${canvas.baseHeight}` }}
        >
          {visibleElements.length ? (
            <svg
              ref={svgRef}
              className={["absolute inset-0 h-full w-full", isDragging ? "cursor-grabbing" : "cursor-default"].join(" ")}
              onPointerDown={(event) => {
                if (event.target === event.currentTarget) {
                  onSelectElement(null);
                }
              }}
              preserveAspectRatio="xMidYMid meet"
              viewBox={`0 0 ${canvas.baseWidth} ${canvas.baseHeight}`}
            >
              <GridOverlay canvas={canvas} />
              {visibleElements.map((element) => (
                <g
                  key={element.id}
                  className={element.locked ? "cursor-not-allowed" : isDragging ? "cursor-grabbing" : "cursor-grab"}
                  onPointerDown={(event) => {
                    event.stopPropagation();
                    onSelectElement(element.id);

                    if (element.locked) {
                      return;
                    }

                    const point = getSvgPoint(svgRef.current, event, canvas);
                    if (!point) {
                      return;
                    }

                    dragRef.current = {
                      elementId: element.id,
                      lastPoint: point,
                    };
                    setIsDragging(true);
                  }}
                >
                  <CanvasElement element={element} isSelected={element.id === selectedElementId} />
                </g>
              ))}
              {selectedBounds ? <SelectionOutline bounds={selectedBounds} /> : null}
            </svg>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-lg font-semibold">Canvas Ready</p>
              <p className="mt-2 max-w-md text-sm leading-6 text-[var(--color-text-sub)]">
                Toolbar에서 rect, circle, line을 추가하면 SVG 캔버스에 바로 배치됩니다.
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function GridOverlay({ canvas }) {
  const verticalCount = Math.ceil(canvas.baseWidth / 120);
  const horizontalCount = Math.ceil(canvas.baseHeight / 120);

  return (
    <g opacity="0.12" pointerEvents="none">
      {Array.from({ length: verticalCount + 1 }).map((_, index) => (
        <line
          key={`v-${index}`}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
          x1={index * 120}
          x2={index * 120}
          y1="0"
          y2={canvas.baseHeight}
        />
      ))}
      {Array.from({ length: horizontalCount + 1 }).map((_, index) => (
        <line
          key={`h-${index}`}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1"
          x1="0"
          x2={canvas.baseWidth}
          y1={index * 120}
          y2={index * 120}
        />
      ))}
    </g>
  );
}

function CanvasElement({ element, isSelected }) {
  const sharedProps = {
    opacity: toSvgOpacity(element.opacity),
  };

  if (element.type === "rect") {
    return (
      <rect
        fill={element.fillColor}
        height={element.height}
        rx={element.cornerRadius}
        stroke={isSelected ? "#38BDF8" : element.strokeColor}
        strokeWidth={Math.max(element.strokeWidth, isSelected ? 3 : 1)}
        width={element.width}
        x={element.x}
        y={element.y}
        {...sharedProps}
      />
    );
  }

  if (element.type === "circle") {
    return (
      <ellipse
        cx={element.x + element.width / 2}
        cy={element.y + element.height / 2}
        fill={element.fillColor}
        rx={element.width / 2}
        ry={element.height / 2}
        stroke={isSelected ? "#38BDF8" : element.strokeColor}
        strokeWidth={Math.max(element.strokeWidth, isSelected ? 3 : 1)}
        {...sharedProps}
      />
    );
  }

  return (
    <line
      stroke={isSelected ? "#38BDF8" : element.strokeColor}
      strokeDasharray={getDashArray(element.dashStyle)}
      strokeLinecap="round"
      strokeWidth={Math.max(element.strokeWidth, isSelected ? 5 : 1)}
      x1={element.x1}
      x2={element.x2}
      y1={element.y1}
      y2={element.y2}
      {...sharedProps}
    />
  );
}

function SelectionOutline({ bounds }) {
  return (
    <rect
      fill="transparent"
      height={bounds.height}
      pointerEvents="none"
      stroke="#38BDF8"
      strokeDasharray="16 10"
      strokeWidth="4"
      width={bounds.width}
      x={bounds.x}
      y={bounds.y}
    />
  );
}

function getSvgPoint(svg, event, canvas) {
  if (!svg) {
    return null;
  }

  const rect = svg.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return null;
  }

  return {
    x: ((event.clientX - rect.left) / rect.width) * canvas.baseWidth,
    y: ((event.clientY - rect.top) / rect.height) * canvas.baseHeight,
  };
}

function getElementBounds(element) {
  if (element.type === "line") {
    return {
      x: Math.min(element.x1, element.x2) - 12,
      y: Math.min(element.y1, element.y2) - 12,
      width: Math.abs(element.x2 - element.x1) + 24,
      height: Math.abs(element.y2 - element.y1) + 24,
    };
  }

  return {
    x: element.x - 8,
    y: element.y - 8,
    width: element.width + 16,
    height: element.height + 16,
  };
}

function getDashArray(dashStyle) {
  if (dashStyle === "dash") {
    return "18 12";
  }

  if (dashStyle === "dot") {
    return "6 10";
  }

  return undefined;
}

function toSvgOpacity(value) {
  if (typeof value !== "number") {
    return 1;
  }

  return value > 1 ? value / 100 : value;
}

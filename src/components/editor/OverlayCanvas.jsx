import { useEffect, useMemo, useRef, useState } from "react";

import { Card } from "../common/Card";

const DEFAULT_GRID_SIZE = 20;
const SNAP_THRESHOLD = 8;

export function OverlayCanvas({
  canvas,
  currentMode,
  elements,
  onDragElement,
  onDrawCircle,
  onDrawRect,
  onElementContextAction,
  onResizeElement,
  onSelectElement,
  onSelectElements,
  onToggleElementSelection,
  canPasteElement,
  selectedElementId,
  selectedElementIds = [],
}) {
  const svgRef = useRef(null);
  const dragRef = useRef(null);
  const drawRef = useRef(null);
  const resizeRef = useRef(null);
  const selectionRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [draftRect, setDraftRect] = useState(null);
  const [selectionRect, setSelectionRect] = useState(null);
  const [cursorPoint, setCursorPoint] = useState(null);
  const [activeGuides, setActiveGuides] = useState({ x: null, y: null });
  const [contextMenu, setContextMenu] = useState(null);
  const sortedElements = useMemo(
    () => elements.slice().sort((left, right) => left.zIndex - right.zIndex),
    [elements],
  );
  const visibleElements = useMemo(
    () => sortedElements.filter((element) => element.visible !== false),
    [sortedElements],
  );
  const selectedElement =
    selectedElementIds.length === 1
      ? sortedElements.find((element) => element.id === selectedElementId) ?? null
      : null;
  const selectedIdSet = useMemo(() => new Set(selectedElementIds), [selectedElementIds]);
  const selectedBounds =
    selectedElement && selectedElement.visible !== false ? getElementBounds(selectedElement) : null;

  useEffect(() => {
    function handlePointerMove(event) {
      if (drawRef.current) {
        const nextPoint = getSvgPoint(svgRef.current, event, canvas);
        if (!nextPoint) {
          return;
        }

        const snappedPoint = snapPoint(nextPoint, {
          canvas,
          elements: visibleElements,
          excludeElementId: null,
          isSnapEnabled: true,
          setActiveGuides,
        });
        const nextRect = event.shiftKey
          ? normalizeSquare(drawRef.current.startPoint, snappedPoint.point)
          : normalizeRect(drawRef.current.startPoint, snappedPoint.point);
        drawRef.current.currentRect = nextRect;
        setDraftRect(nextRect);
        return;
      }

      if (selectionRef.current) {
        const nextPoint = getSvgPoint(svgRef.current, event, canvas);
        if (!nextPoint) {
          return;
        }

        const nextRect = normalizeRect(selectionRef.current.startPoint, nextPoint);
        selectionRef.current.currentRect = nextRect;
        setSelectionRect(nextRect);
        return;
      }

      if (resizeRef.current) {
        const nextPoint = getSvgPoint(svgRef.current, event, canvas);
        if (!nextPoint) {
          return;
        }

        const snappedPoint = snapPoint(nextPoint, {
          canvas,
          elements: visibleElements,
          excludeElementId: resizeRef.current.elementId,
          isSnapEnabled: true,
          setActiveGuides,
        });
        onResizeElement(
          resizeRef.current.elementId,
          getResizePatch(resizeRef.current.element, resizeRef.current.handle, snappedPoint.point, {
            fromCenter: event.altKey,
          }),
        );
        return;
      }

      if (!dragRef.current) {
        return;
      }

      const nextPoint = getSvgPoint(svgRef.current, event, canvas);
      if (!nextPoint) {
        return;
      }

      const rawDelta = {
        dx: nextPoint.x - dragRef.current.startPoint.x,
        dy: nextPoint.y - dragRef.current.startPoint.y,
      };
      const constrainedDelta = event.shiftKey ? constrainDeltaToAxis(rawDelta) : rawDelta;
      const desiredDelta = getSnappedMoveDelta({
        bounds: dragRef.current.startBounds,
        canvas,
        elements: visibleElements,
        excludeElementId: dragRef.current.elementId,
        isSnapEnabled: true,
        rawDelta: constrainedDelta,
        setActiveGuides,
      });
      const dx = desiredDelta.dx - dragRef.current.appliedDelta.dx;
      const dy = desiredDelta.dy - dragRef.current.appliedDelta.dy;

      if (!dx && !dy) {
        return;
      }

      dragRef.current.appliedDelta = desiredDelta;
      onDragElement(dragRef.current.elementId, { dx, dy });
    }

    function handlePointerUp() {
      if (drawRef.current) {
        const rect = drawRef.current.currentRect;
        const type = drawRef.current.type;
        drawRef.current = null;
        setDraftRect(null);

        if (rect && rect.width >= 6 && rect.height >= 6) {
          if (type === "circle") {
            onDrawCircle(rect);
          } else {
            onDrawRect(rect);
          }
        }
      }

      if (selectionRef.current) {
        const rect = selectionRef.current.currentRect;
        const baseIds = selectionRef.current.baseIds;
        selectionRef.current = null;
        setSelectionRect(null);

        if (rect && (rect.width >= 4 || rect.height >= 4)) {
          const matchedIds = visibleElements
            .filter((element) => doesRectIntersect(rect, getElementRawBounds(element)))
            .map((element) => element.id);
          onSelectElements(Array.from(new Set([...baseIds, ...matchedIds])));
        } else if (!baseIds.length) {
          onSelectElement(null);
        }
      }

      dragRef.current = null;
      resizeRef.current = null;
      setIsDragging(false);
      setIsResizing(false);
      setActiveGuides({ x: null, y: null });
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("click", closeContextMenu);
    window.addEventListener("scroll", closeContextMenu, true);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("click", closeContextMenu);
      window.removeEventListener("scroll", closeContextMenu, true);
    };
  }, [
    canvas,
    onDragElement,
    onDrawCircle,
    onDrawRect,
    onSelectElement,
    onSelectElements,
    onResizeElement,
    selectedElementIds,
    visibleElements,
  ]);

  function closeContextMenu() {
    setContextMenu(null);
  }

  function handleContextAction(action) {
    if (!contextMenu) {
      return;
    }

    onElementContextAction(action, contextMenu.elementId);
    setContextMenu(null);
  }

  return (
    <Card className="flex min-h-0 flex-col self-stretch rounded-none border-x-0 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold">Canvas Area</h2>
          <p className="mt-1 text-sm text-[var(--color-text-sub)]">
            Select moves and resizes elements. Rect and Circle draw by dragging on the canvas.
          </p>
        </div>
        <div className="flex flex-wrap items-end justify-end gap-3">
          <div className="min-w-24 text-right text-sm text-[var(--color-text-sub)]">
            <p>
              {canvas.baseWidth} x {canvas.baseHeight}
            </p>
            <p>{visibleElements.length} visible</p>
          </div>
        </div>
      </div>
      <div className="relative mt-4 flex min-h-0 flex-1 items-center justify-center border border-dashed border-[var(--color-border)] bg-[linear-gradient(var(--color-canvas-grid)_1px,transparent_1px),linear-gradient(90deg,var(--color-canvas-grid)_1px,transparent_1px)] bg-[size:32px_32px] p-4">
        <div
          className="relative w-full overflow-hidden border border-[var(--color-canvas-frame)] bg-[var(--color-canvas-bg)] shadow-[inset_0_0_0_1px_rgba(15,23,42,0.04)]"
          style={{ aspectRatio: `${canvas.baseWidth} / ${canvas.baseHeight}` }}
        >
          {!visibleElements.length ? (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-lg font-semibold">Canvas Ready</p>
              <p className="mt-2 max-w-md text-sm leading-6 text-[var(--color-text-sub)]">
                Select the Rect or Circle tool and drag on the canvas to draw the first shape.
              </p>
            </div>
          ) : null}
          <svg
            ref={svgRef}
            className={[
              "absolute inset-0 h-full w-full",
              currentMode === "rect" || currentMode === "circle"
                ? "cursor-crosshair"
                : isDragging
                  ? "cursor-grabbing"
                  : isResizing
                    ? "cursor-default"
                    : "cursor-default",
            ].join(" ")}
            onPointerDown={(event) => {
              if (event.button !== 0) {
                return;
              }

              if (currentMode === "rect" || currentMode === "circle") {
                const rawPoint = getSvgPoint(svgRef.current, event, canvas);
                const point = rawPoint
                  ? snapPoint(rawPoint, {
                      canvas,
                      elements: visibleElements,
                      excludeElementId: null,
                      isSnapEnabled: true,
                      setActiveGuides,
                    }).point
                  : null;
                if (!point) {
                  return;
                }

                const initialRect = normalizeRect(point, point);
                drawRef.current = {
                  type: currentMode,
                  startPoint: point,
                  currentRect: initialRect,
                };
                setDraftRect(initialRect);
                onSelectElement(null);
                return;
              }

              if (event.target === event.currentTarget) {
                const point = getSvgPoint(svgRef.current, event, canvas);
                if (!point) {
                  return;
                }

                selectionRef.current = {
                  startPoint: point,
                  currentRect: normalizeRect(point, point),
                  baseIds: event.ctrlKey || event.metaKey ? selectedElementIds : [],
                };
                setSelectionRect(selectionRef.current.currentRect);
              }
            }}
            onContextMenu={(event) => {
              if (event.target !== event.currentTarget) {
                return;
              }

              event.preventDefault();
              setContextMenu({
                elementId: null,
                x: event.clientX,
                y: event.clientY,
              });
            }}
            onPointerLeave={() => {
              setCursorPoint(null);
              if (!dragRef.current && !drawRef.current && !resizeRef.current) {
                setActiveGuides({ x: null, y: null });
              }
            }}
            onPointerMove={(event) => {
              const point = getSvgPoint(svgRef.current, event, canvas);
              setCursorPoint(point);
            }}
            preserveAspectRatio="xMidYMid meet"
            viewBox={`0 0 ${canvas.baseWidth} ${canvas.baseHeight}`}
          >
            <GridOverlay canvas={canvas} gridSize={DEFAULT_GRID_SIZE} />
            <CenterGuides canvas={canvas} />
            {cursorPoint ? <CursorGuides canvas={canvas} point={cursorPoint} /> : null}
            <SnapGuides canvas={canvas} guides={activeGuides} />
            {visibleElements.map((element) => (
              <g
                key={element.id}
                className={element.locked ? "cursor-not-allowed" : isDragging ? "cursor-grabbing" : "cursor-grab"}
                onPointerDown={(event) => {
                  if (event.button !== 0) {
                    return;
                  }

                  if (currentMode !== "select") {
                    return;
                  }

                  event.stopPropagation();

                  if (event.ctrlKey || event.metaKey) {
                    onToggleElementSelection(element.id);
                    return;
                  }

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
                    startBounds: getElementRawBounds(element),
                    startPoint: point,
                    appliedDelta: { dx: 0, dy: 0 },
                  };
                  setIsDragging(true);
                }}
                onContextMenu={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onSelectElement(element.id);
                  setContextMenu({
                    elementId: element.id,
                    x: event.clientX,
                    y: event.clientY,
                  });
                }}
                pointerEvents={currentMode === "select" ? undefined : "none"}
              >
                <CanvasElement element={element} isSelected={selectedIdSet.has(element.id)} />
              </g>
            ))}
            {draftRect ? <DraftShape bounds={draftRect} type={drawRef.current?.type} /> : null}
            {selectionRect ? <MarqueeSelection bounds={selectionRect} /> : null}
            {selectedElementIds.length > 1
              ? visibleElements
                  .filter((element) => selectedIdSet.has(element.id))
                  .map((element) => (
                    <SelectionOutline bounds={getElementBounds(element)} key={`selection-${element.id}`} />
                  ))
              : null}
            {selectedBounds ? <SelectionOutline bounds={selectedBounds} /> : null}
            {currentMode === "select"
              ? visibleElements
                  .filter((element) => selectedIdSet.has(element.id) && hasVisualAnchor(element))
                  .map((element) => <VisualAnchorIndicator canvas={canvas} element={element} key={`anchor-${element.id}`} />)
              : null}
            {currentMode === "select" && selectedElement && selectedElement.locked !== true ? (
              <ResizeHandles
                element={selectedElement}
                onPointerDown={(event, handle) => {
                  if (event.button !== 0) {
                    return;
                  }

                  event.stopPropagation();
                  onSelectElement(selectedElement.id);
                  resizeRef.current = {
                    elementId: selectedElement.id,
                    element: selectedElement,
                    handle,
                  };
                  setIsResizing(true);
                }}
              />
            ) : null}
          </svg>
          {contextMenu ? (
            <ElementContextMenu
              canPaste={canPasteElement}
              isCanvasMenu={contextMenu.elementId === null}
              onAction={handleContextAction}
              x={contextMenu.x}
              y={contextMenu.y}
            />
          ) : null}
        </div>
      </div>
    </Card>
  );
}

function ElementContextMenu({ canPaste, isCanvasMenu, onAction, x, y }) {
  const items = isCanvasMenu
    ? [{ action: "paste", disabled: !canPaste, label: "Paste" }]
    : [
        { action: "delete", label: "Delete" },
        { action: "forward", label: "Bring Forward" },
        { action: "backward", label: "Send Backward" },
        { action: "front", label: "Bring to Front" },
        { action: "back", label: "Send to Back" },
        { action: "copy", label: "Copy" },
        { action: "paste", disabled: !canPaste, label: "Paste" },
        { action: "duplicate", label: "Duplicate" },
      ];

  return (
    <div
      className="fixed z-50 w-44 overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] py-1 shadow-2xl"
      style={{ left: x, top: y }}
      onClick={(event) => event.stopPropagation()}
      role="menu"
    >
      {items.map((item) => (
        <button
          className={[
            "block w-full px-3 py-2 text-left text-sm transition",
            item.disabled
              ? "cursor-not-allowed text-[var(--color-text-sub)] opacity-50"
              : "text-[var(--color-text-main)] hover:bg-[var(--color-surface-soft)]",
          ].join(" ")}
          disabled={item.disabled}
          key={item.action}
          onClick={() => onAction(item.action)}
          type="button"
          role="menuitem"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function GridOverlay({ canvas, gridSize }) {
  const safeGridSize = Math.max(1, gridSize);
  const verticalCount = Math.ceil(canvas.baseWidth / safeGridSize);
  const horizontalCount = Math.ceil(canvas.baseHeight / safeGridSize);

  return (
    <g pointerEvents="none">
      {Array.from({ length: verticalCount + 1 }).map((_, index) => (
        <line
          key={`v-${index}`}
          stroke={index % 5 === 0 ? "var(--color-canvas-grid-strong)" : "var(--color-canvas-grid)"}
          strokeWidth={index % 5 === 0 ? "1.5" : "1"}
          x1={index * safeGridSize}
          x2={index * safeGridSize}
          y1="0"
          y2={canvas.baseHeight}
        />
      ))}
      {Array.from({ length: horizontalCount + 1 }).map((_, index) => (
        <line
          key={`h-${index}`}
          stroke={index % 5 === 0 ? "var(--color-canvas-grid-strong)" : "var(--color-canvas-grid)"}
          strokeWidth={index % 5 === 0 ? "1.5" : "1"}
          x1="0"
          x2={canvas.baseWidth}
          y1={index * safeGridSize}
          y2={index * safeGridSize}
        />
      ))}
    </g>
  );
}

function CursorGuides({ canvas, point }) {
  return (
    <g opacity="0.55" pointerEvents="none">
      <line
        stroke="#FBBF24"
        strokeDasharray="8 8"
        strokeWidth="1.5"
        x1={point.x}
        x2={point.x}
        y1="0"
        y2={canvas.baseHeight}
      />
      <line
        stroke="#FBBF24"
        strokeDasharray="8 8"
        strokeWidth="1.5"
        x1="0"
        x2={canvas.baseWidth}
        y1={point.y}
        y2={point.y}
      />
    </g>
  );
}

function CenterGuides({ canvas }) {
  const centerX = canvas.baseWidth / 2;
  const centerY = canvas.baseHeight / 2;

  return (
    <g opacity="0.75" pointerEvents="none">
      <line
        stroke="#60A5FA"
        strokeDasharray="14 10"
        strokeWidth="2"
        x1={centerX}
        x2={centerX}
        y1="0"
        y2={canvas.baseHeight}
      />
      <line
        stroke="#60A5FA"
        strokeDasharray="14 10"
        strokeWidth="2"
        x1="0"
        x2={canvas.baseWidth}
        y1={centerY}
        y2={centerY}
      />
    </g>
  );
}

function SnapGuides({ canvas, guides }) {
  return (
    <g pointerEvents="none">
      {guides.x !== null ? (
        <line
          stroke="#22C55E"
          strokeWidth="2"
          x1={guides.x}
          x2={guides.x}
          y1="0"
          y2={canvas.baseHeight}
        />
      ) : null}
      {guides.y !== null ? (
        <line
          stroke="#22C55E"
          strokeWidth="2"
          x1="0"
          x2={canvas.baseWidth}
          y1={guides.y}
          y2={guides.y}
        />
      ) : null}
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

function DraftShape({ bounds, type }) {
  if (type === "circle") {
    return (
      <ellipse
        cx={bounds.x + bounds.width / 2}
        cy={bounds.y + bounds.height / 2}
        fill="rgba(56, 189, 248, 0.12)"
        pointerEvents="none"
        rx={bounds.width / 2}
        ry={bounds.height / 2}
        stroke="#38BDF8"
        strokeDasharray="10 8"
        strokeWidth="3"
      />
    );
  }

  return (
    <rect
      fill="rgba(56, 189, 248, 0.12)"
      height={bounds.height}
      pointerEvents="none"
      stroke="#38BDF8"
      strokeDasharray="10 8"
      strokeWidth="3"
      width={bounds.width}
      x={bounds.x}
      y={bounds.y}
    />
  );
}

function ResizeHandles({ element, onPointerDown }) {
  const handles = getResizeHandles(element);

  return (
    <g>
      {handles.map((handle) => (
        <rect
          aria-label={`Resize ${handle.id}`}
          className={handle.cursor}
          fill="#E0F2FE"
          height="14"
          key={handle.id}
          onPointerDown={(event) => onPointerDown(event, handle.id)}
          stroke="#0284C7"
          strokeWidth="2"
          width="14"
          x={handle.x - 7}
          y={handle.y - 7}
        />
      ))}
    </g>
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

// TODO: Remove after the anchor visualization rollout is confirmed in editor QA.
// eslint-disable-next-line no-unused-vars
function AnchorIndicator({ element }) {
  const anchor = element.anchor ?? "top-left";
  const anchorSpace = element.anchorSpace ?? "safeFrame";
  const point = getElementAnchorPoint(element, anchor);
  const label = `${getAnchorLabel(anchor)} / ${anchorSpace === "screen" ? "전체 화면" : "설계 영역"}`;
  const labelPosition = getAnchorLabelPosition(point, anchor);

  return (
    <g pointerEvents="none">
      <line
        stroke="#F97316"
        strokeLinecap="round"
        strokeWidth="3"
        x1={point.x - 10}
        x2={point.x + 10}
        y1={point.y}
        y2={point.y}
      />
      <line
        stroke="#F97316"
        strokeLinecap="round"
        strokeWidth="3"
        x1={point.x}
        x2={point.x}
        y1={point.y - 10}
        y2={point.y + 10}
      />
      <circle cx={point.x} cy={point.y} fill="#FFF7ED" r="7" stroke="#EA580C" strokeWidth="3" />
      <text
        fill="#9A3412"
        fontSize="18"
        fontWeight="700"
        paintOrder="stroke"
        stroke="#FFF7ED"
        strokeLinejoin="round"
        strokeWidth="6"
        textAnchor={labelPosition.textAnchor}
        x={labelPosition.x}
        y={labelPosition.y}
      >
        {label}
      </text>
    </g>
  );
}

function VisualAnchorIndicator({ canvas, element }) {
  const anchor = element.anchor ?? "top-left";
  const anchorSpace = element.anchorSpace ?? "safeFrame";
  const elementPoint = getElementAnchorPoint(element, anchor);
  const referencePoint = getCanvasAnchorPoint(canvas, anchor);
  const guide = getAnchorReferenceGuide(canvas, anchor);
  const label = `${getVisualAnchorLabel(anchor)} / ${anchorSpace === "screen" ? "전체 화면" : "설계 영역"}`;
  const labelPosition = getCanvasAnchorLabelPosition(canvas, referencePoint, anchor);

  return (
    <g pointerEvents="none">
      <rect
        fill="rgba(249, 115, 22, 0.035)"
        height={canvas.baseHeight}
        stroke="#FB923C"
        strokeDasharray="18 10"
        strokeWidth="3"
        width={canvas.baseWidth}
        x="0"
        y="0"
      />
      <VisualAnchorGuide canvas={canvas} guide={guide} />
      <line
        stroke="#EA580C"
        strokeDasharray="10 8"
        strokeWidth="3"
        x1={referencePoint.x}
        x2={elementPoint.x}
        y1={referencePoint.y}
        y2={elementPoint.y}
      />
      <path d={getAnchorPinPath(referencePoint, anchor)} fill="#EA580C" stroke="#FFF7ED" strokeWidth="3" />
      <circle cx={referencePoint.x} cy={referencePoint.y} fill="#EA580C" r="6" stroke="#FFF7ED" strokeWidth="3" />
      <line
        stroke="#F97316"
        strokeLinecap="round"
        strokeWidth="3"
        x1={elementPoint.x - 10}
        x2={elementPoint.x + 10}
        y1={elementPoint.y}
        y2={elementPoint.y}
      />
      <line
        stroke="#F97316"
        strokeLinecap="round"
        strokeWidth="3"
        x1={elementPoint.x}
        x2={elementPoint.x}
        y1={elementPoint.y - 10}
        y2={elementPoint.y + 10}
      />
      <circle cx={elementPoint.x} cy={elementPoint.y} fill="#FFF7ED" r="7" stroke="#EA580C" strokeWidth="3" />
      <text
        fill="#9A3412"
        fontSize="18"
        fontWeight="700"
        paintOrder="stroke"
        stroke="#FFF7ED"
        strokeLinejoin="round"
        strokeWidth="6"
        textAnchor={labelPosition.textAnchor}
        x={labelPosition.x}
        y={labelPosition.y}
      >
        {label}
      </text>
    </g>
  );
}

function VisualAnchorGuide({ canvas, guide }) {
  if (guide.type === "vertical") {
    return (
      <line
        stroke="#FB923C"
        strokeDasharray="14 10"
        strokeWidth="3"
        x1={guide.x}
        x2={guide.x}
        y1="0"
        y2={canvas.baseHeight}
      />
    );
  }

  if (guide.type === "horizontal") {
    return (
      <line
        stroke="#FB923C"
        strokeDasharray="14 10"
        strokeWidth="3"
        x1="0"
        x2={canvas.baseWidth}
        y1={guide.y}
        y2={guide.y}
      />
    );
  }

  return (
    <>
      <line
        stroke="#FB923C"
        strokeDasharray="14 10"
        strokeWidth="3"
        x1={guide.x}
        x2={guide.x}
        y1="0"
        y2={canvas.baseHeight}
      />
      <line
        stroke="#FB923C"
        strokeDasharray="14 10"
        strokeWidth="3"
        x1="0"
        x2={canvas.baseWidth}
        y1={guide.y}
        y2={guide.y}
      />
    </>
  );
}

function MarqueeSelection({ bounds }) {
  return (
    <rect
      fill="rgba(14, 165, 233, 0.16)"
      height={bounds.height}
      pointerEvents="none"
      stroke="#7DD3FC"
      strokeDasharray="10 8"
      strokeWidth="2"
      width={bounds.width}
      x={bounds.x}
      y={bounds.y}
    />
  );
}

function getResizeHandles(element) {
  if (element.type === "line") {
    return [
      { id: "start", cursor: "cursor-move", x: element.x1, y: element.y1 },
      { id: "end", cursor: "cursor-move", x: element.x2, y: element.y2 },
    ];
  }

  const left = element.x;
  const top = element.y;
  const centerX = element.x + element.width / 2;
  const centerY = element.y + element.height / 2;
  const right = element.x + element.width;
  const bottom = element.y + element.height;

  return [
    { id: "nw", cursor: "cursor-nwse-resize", x: left, y: top },
    { id: "n", cursor: "cursor-ns-resize", x: centerX, y: top },
    { id: "ne", cursor: "cursor-nesw-resize", x: right, y: top },
    { id: "e", cursor: "cursor-ew-resize", x: right, y: centerY },
    { id: "se", cursor: "cursor-nwse-resize", x: right, y: bottom },
    { id: "s", cursor: "cursor-ns-resize", x: centerX, y: bottom },
    { id: "sw", cursor: "cursor-nesw-resize", x: left, y: bottom },
    { id: "w", cursor: "cursor-ew-resize", x: left, y: centerY },
  ];
}

function hasVisualAnchor(element) {
  return element.type === "rect" || element.type === "circle";
}

function getElementAnchorPoint(element, anchor) {
  const left = element.x;
  const top = element.y;
  const centerX = element.x + element.width / 2;
  const centerY = element.y + element.height / 2;
  const right = element.x + element.width;
  const bottom = element.y + element.height;

  switch (anchor) {
    case "top":
      return { x: centerX, y: top };
    case "top-right":
      return { x: right, y: top };
    case "left":
      return { x: left, y: centerY };
    case "center":
      return { x: centerX, y: centerY };
    case "right":
      return { x: right, y: centerY };
    case "bottom-left":
      return { x: left, y: bottom };
    case "bottom":
      return { x: centerX, y: bottom };
    case "bottom-right":
      return { x: right, y: bottom };
    case "top-left":
    default:
      return { x: left, y: top };
  }
}

function getCanvasAnchorPoint(canvas, anchor) {
  const left = 0;
  const top = 0;
  const centerX = canvas.baseWidth / 2;
  const centerY = canvas.baseHeight / 2;
  const right = canvas.baseWidth;
  const bottom = canvas.baseHeight;

  switch (anchor) {
    case "top":
      return { x: centerX, y: top };
    case "top-right":
      return { x: right, y: top };
    case "left":
      return { x: left, y: centerY };
    case "center":
      return { x: centerX, y: centerY };
    case "right":
      return { x: right, y: centerY };
    case "bottom-left":
      return { x: left, y: bottom };
    case "bottom":
      return { x: centerX, y: bottom };
    case "bottom-right":
      return { x: right, y: bottom };
    case "top-left":
    default:
      return { x: left, y: top };
  }
}

function getAnchorReferenceGuide(canvas, anchor) {
  if (anchor === "center") {
    return { type: "cross", x: canvas.baseWidth / 2, y: canvas.baseHeight / 2 };
  }

  if (anchor === "top" || anchor === "bottom") {
    return { type: "horizontal", y: anchor === "top" ? 0 : canvas.baseHeight };
  }

  if (anchor === "left" || anchor === "right") {
    return { type: "vertical", x: anchor === "left" ? 0 : canvas.baseWidth };
  }

  return {
    type: "cross",
    x: anchor.includes("right") ? canvas.baseWidth : 0,
    y: anchor.includes("bottom") ? canvas.baseHeight : 0,
  };
}

function getAnchorPinPath(point, anchor) {
  const size = 18;
  const horizontal = anchor.includes("right") ? -1 : 1;
  const vertical = anchor.includes("bottom") ? -1 : 1;

  if (anchor === "top" || anchor === "bottom") {
    return `M ${point.x} ${point.y} l ${size / 2} ${size * vertical} h ${-size} Z`;
  }

  if (anchor === "left" || anchor === "right") {
    return `M ${point.x} ${point.y} l ${size * horizontal} ${size / 2} v ${-size} Z`;
  }

  if (anchor === "center") {
    return `M ${point.x} ${point.y - size / 2} l ${size / 2} ${size / 2} l ${-size / 2} ${size / 2} l ${-size / 2} ${-size / 2} Z`;
  }

  return `M ${point.x} ${point.y} l ${size * horizontal} 0 l 0 ${size * vertical} Z`;
}

function getVisualAnchorLabel(anchor) {
  const labels = {
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

  return labels[anchor] ?? labels["top-left"];
}

function getAnchorLabel(anchor) {
  const labels = {
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

  return labels[anchor] ?? labels["top-left"];
}

function getAnchorLabelPosition(point, anchor) {
  const y = anchor.includes("bottom") ? point.y - 18 : point.y + 30;

  if (anchor.includes("right")) {
    return { x: point.x - 16, y, textAnchor: "end" };
  }

  if (anchor.includes("left")) {
    return { x: point.x + 16, y, textAnchor: "start" };
  }

  if (anchor.includes("bottom")) {
    return { x: point.x, y, textAnchor: "middle" };
  }

  return { x: point.x, y, textAnchor: "middle" };
}

function getCanvasAnchorLabelPosition(canvas, point, anchor) {
  const inset = 28;

  if (anchor === "center") {
    return { x: point.x, y: point.y + 34, textAnchor: "middle" };
  }

  if (anchor.includes("left")) {
    return {
      x: Math.min(canvas.baseWidth - inset, point.x + inset),
      y: getCanvasAnchorLabelY(canvas, point, anchor, inset),
      textAnchor: "start",
    };
  }

  if (anchor.includes("right")) {
    return {
      x: Math.max(inset, point.x - inset),
      y: getCanvasAnchorLabelY(canvas, point, anchor, inset),
      textAnchor: "end",
    };
  }

  return {
    x: point.x,
    y: getCanvasAnchorLabelY(canvas, point, anchor, inset),
    textAnchor: "middle",
  };
}

function getCanvasAnchorLabelY(canvas, point, anchor, inset) {
  if (anchor.includes("bottom")) {
    return Math.max(inset, point.y - inset);
  }

  if (anchor.includes("top")) {
    return Math.min(canvas.baseHeight - inset, point.y + inset + 8);
  }

  return point.y - inset;
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

function getElementRawBounds(element) {
  if (element.type === "line") {
    return {
      x: Math.min(element.x1, element.x2),
      y: Math.min(element.y1, element.y2),
      width: Math.abs(element.x2 - element.x1),
      height: Math.abs(element.y2 - element.y1),
    };
  }

  return {
    x: element.x,
    y: element.y,
    width: element.width,
    height: element.height,
  };
}

function doesRectIntersect(left, right) {
  return (
    left.x <= right.x + right.width &&
    left.x + left.width >= right.x &&
    left.y <= right.y + right.height &&
    left.y + left.height >= right.y
  );
}

function normalizeRect(startPoint, endPoint) {
  return {
    x: Math.min(startPoint.x, endPoint.x),
    y: Math.min(startPoint.y, endPoint.y),
    width: Math.abs(endPoint.x - startPoint.x),
    height: Math.abs(endPoint.y - startPoint.y),
  };
}

function normalizeSquare(startPoint, endPoint) {
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const size = Math.min(Math.abs(dx), Math.abs(dy));
  const x2 = startPoint.x + Math.sign(dx || 1) * size;
  const y2 = startPoint.y + Math.sign(dy || 1) * size;

  return normalizeRect(startPoint, { x: x2, y: y2 });
}

function getResizePatch(element, handle, point, options = {}) {
  if (options.fromCenter) {
    return getCenterResizePatch(element, handle, point);
  }

  if (element.type === "line") {
    if (handle === "start") {
      return {
        x1: Math.round(point.x),
        y1: Math.round(point.y),
      };
    }

    return {
      x2: Math.round(point.x),
      y2: Math.round(point.y),
    };
  }

  const minSize = 8;
  let left = element.x;
  let top = element.y;
  let right = element.x + element.width;
  let bottom = element.y + element.height;

  if (handle.includes("w")) {
    left = Math.min(point.x, right - minSize);
  }

  if (handle.includes("e")) {
    right = Math.max(point.x, left + minSize);
  }

  if (handle.includes("n")) {
    top = Math.min(point.y, bottom - minSize);
  }

  if (handle.includes("s")) {
    bottom = Math.max(point.y, top + minSize);
  }

  return {
    x: Math.round(left),
    y: Math.round(top),
    width: Math.round(right - left),
    height: Math.round(bottom - top),
  };
}

function getCenterResizePatch(element, handle, point) {
  if (element.type === "line") {
    const center = {
      x: (element.x1 + element.x2) / 2,
      y: (element.y1 + element.y2) / 2,
    };

    if (handle === "start") {
      return {
        x1: Math.round(point.x),
        y1: Math.round(point.y),
        x2: Math.round(center.x * 2 - point.x),
        y2: Math.round(center.y * 2 - point.y),
      };
    }

    return {
      x1: Math.round(center.x * 2 - point.x),
      y1: Math.round(center.y * 2 - point.y),
      x2: Math.round(point.x),
      y2: Math.round(point.y),
    };
  }

  const minSize = 8;
  const center = {
    x: element.x + element.width / 2,
    y: element.y + element.height / 2,
  };
  const changesX = handle.includes("e") || handle.includes("w");
  const changesY = handle.includes("n") || handle.includes("s");
  const width = changesX
    ? Math.max(minSize, Math.abs(point.x - center.x) * 2)
    : element.width;
  const height = changesY
    ? Math.max(minSize, Math.abs(point.y - center.y) * 2)
    : element.height;

  return {
    x: Math.round(center.x - width / 2),
    y: Math.round(center.y - height / 2),
    width: Math.round(width),
    height: Math.round(height),
  };
}

function snapPoint(point, options) {
  if (!options.isSnapEnabled) {
    options.setActiveGuides({ x: null, y: null });
    return { point };
  }

  const guideValues = getGuideValues(options);
  const xSnap = findNearestGuide(point.x, guideValues.x);
  const ySnap = findNearestGuide(point.y, guideValues.y);
  const nextPoint = {
    x: xSnap ? xSnap.value : point.x,
    y: ySnap ? ySnap.value : point.y,
  };

  options.setActiveGuides({
    x: xSnap ? xSnap.value : null,
    y: ySnap ? ySnap.value : null,
  });

  return { point: nextPoint };
}

function getSnappedMoveDelta({
  bounds,
  canvas,
  elements,
  excludeElementId,
  isSnapEnabled,
  rawDelta,
  setActiveGuides,
}) {
  if (!isSnapEnabled) {
    setActiveGuides({ x: null, y: null });
    return rawDelta;
  }

  const moving = {
    left: bounds.x + rawDelta.dx,
    centerX: bounds.x + bounds.width / 2 + rawDelta.dx,
    right: bounds.x + bounds.width + rawDelta.dx,
    top: bounds.y + rawDelta.dy,
    centerY: bounds.y + bounds.height / 2 + rawDelta.dy,
    bottom: bounds.y + bounds.height + rawDelta.dy,
  };
  const guideValues = getGuideValues({ canvas, elements, excludeElementId });
  const xSnap = findBestMoveSnap(
    [
      { key: "left", value: moving.left },
      { key: "centerX", value: moving.centerX },
      { key: "right", value: moving.right },
    ],
    guideValues.x,
  );
  const ySnap = findBestMoveSnap(
    [
      { key: "top", value: moving.top },
      { key: "centerY", value: moving.centerY },
      { key: "bottom", value: moving.bottom },
    ],
    guideValues.y,
  );

  setActiveGuides({
    x: xSnap ? xSnap.guide : null,
    y: ySnap ? ySnap.guide : null,
  });

  return {
    dx: xSnap ? rawDelta.dx + xSnap.guide - xSnap.value : rawDelta.dx,
    dy: ySnap ? rawDelta.dy + ySnap.guide - ySnap.value : rawDelta.dy,
  };
}

function constrainDeltaToAxis(delta) {
  if (Math.abs(delta.dx) >= Math.abs(delta.dy)) {
    return {
      dx: delta.dx,
      dy: 0,
    };
  }

  return {
    dx: 0,
    dy: delta.dy,
  };
}

function getGuideValues({ canvas, elements, excludeElementId }) {
  const x = [0, canvas.baseWidth / 2, canvas.baseWidth];
  const y = [0, canvas.baseHeight / 2, canvas.baseHeight];

  elements
    .filter((element) => element.id !== excludeElementId)
    .map(getElementRawBounds)
    .forEach((bounds) => {
      x.push(bounds.x, bounds.x + bounds.width / 2, bounds.x + bounds.width);
      y.push(bounds.y, bounds.y + bounds.height / 2, bounds.y + bounds.height);
    });

  return {
    x: uniqueRoundedValues(x),
    y: uniqueRoundedValues(y),
  };
}

function findNearestGuide(value, guides) {
  return guides.reduce((best, guide) => {
    const distance = Math.abs(value - guide);
    if (distance > SNAP_THRESHOLD || (best && distance >= best.distance)) {
      return best;
    }

    return { distance, value: guide };
  }, null);
}

function findBestMoveSnap(values, guides) {
  return values.reduce((best, item) => {
    const snap = findNearestGuide(item.value, guides);
    if (!snap || (best && snap.distance >= best.distance)) {
      return best;
    }

    return {
      distance: snap.distance,
      guide: snap.value,
      value: item.value,
    };
  }, null);
}

function uniqueRoundedValues(values) {
  return Array.from(new Set(values.map((value) => Math.round(value))));
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

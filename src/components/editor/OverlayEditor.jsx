import { EditorActionBar } from "./EditorActionBar";
import { EditorToolbar } from "./EditorToolbar";
import { ElementPropertyPanel } from "./ElementPropertyPanel";
import { LayerPanel } from "./LayerPanel";
import { OverlayCanvas } from "./OverlayCanvas";
import { OverlayMetaPanel } from "./OverlayMetaPanel";

export function OverlayEditor({
  canvas,
  currentMode,
  elements,
  onAddCircle,
  onAddLine,
  onAddRect,
  onCanvasChange,
  onDelete,
  onElementFieldChange,
  onImport,
  onMetaChange,
  onMoveBack,
  onMoveFront,
  onOpacityChange,
  onPreview,
  onReset,
  onSelectElement,
  onSelectMode,
  opacity,
  overlayMeta,
  selectedElement,
  selectedElementId,
}) {
  return (
    <section className="space-y-4">
      <div className="rounded-3xl border border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10 px-4 py-3 text-sm text-[var(--color-warning)] md:hidden">
        모바일에서는 오버레이 제작 기능이 제한될 수 있습니다. PC 환경에서 제작하는 것을 권장합니다.
      </div>
      <div className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)_360px]">
        <EditorToolbar
          currentMode={currentMode}
          onAddCircle={onAddCircle}
          onAddLine={onAddLine}
          onAddRect={onAddRect}
          onDelete={onDelete}
          onMoveBack={onMoveBack}
          onMoveFront={onMoveFront}
          onSelectMode={onSelectMode}
        />
        <OverlayCanvas canvas={canvas} elements={elements} selectedElementId={selectedElementId} />
        <div className="space-y-4">
          <OverlayMetaPanel
            canvas={canvas}
            onCanvasChange={onCanvasChange}
            onMetaChange={onMetaChange}
            onOpacityChange={onOpacityChange}
            opacity={opacity}
            overlayMeta={overlayMeta}
          />
          <ElementPropertyPanel element={selectedElement} onChange={onElementFieldChange} />
          <LayerPanel
            items={elements}
            onMoveBack={onMoveBack}
            onMoveFront={onMoveFront}
            onSelect={onSelectElement}
            selectedElementId={selectedElementId}
          />
        </div>
      </div>
      <EditorActionBar hasElements={elements.length > 0} onImport={onImport} onPreview={onPreview} onReset={onReset} />
    </section>
  );
}

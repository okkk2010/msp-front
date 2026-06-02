import { useEffect } from "react";

import { EditorActionBar } from "./EditorActionBar";
import { EditorJsonPreviewModal } from "./EditorJsonPreviewModal";
import { EditorToolbar } from "./EditorToolbar";
import { ElementPropertyPanel } from "./ElementPropertyPanel";
import { OverlayCanvas } from "./OverlayCanvas";

export function OverlayEditor({
  canvas,
  currentMode,
  elements,
  isUploading,
  jsonPreview,
  onCanvasSelect,
  onClosePreview,
  onCopySelected,
  onDelete,
  onDragElement,
  onDrawCircle,
  onDrawRect,
  onElementContextAction,
  onElementFieldChange,
  onExportJson,
  onImportJson,
  onMoveBack,
  onMoveFront,
  onOpenPreview,
  onPasteElement,
  onReset,
  onResizeElement,
  onSelectMode,
  onSelectElements,
  onToggleElementSelection,
  onUpload,
  uploadActionLabel = "Upload",
  canPasteElement,
  selectedElement,
  selectedElementId,
  selectedElementIds,
  selectedElements,
}) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (isEditableTarget(event.target)) {
        return;
      }

      const key = event.key.toLowerCase();
      const usesCommandKey = event.ctrlKey || event.metaKey;

      if (usesCommandKey && key === "c") {
        event.preventDefault();
        onCopySelected();
        return;
      }

      if (usesCommandKey && key === "v") {
        event.preventDefault();
        onPasteElement();
        return;
      }

      if (event.key === "Delete") {
        event.preventDefault();
        onDelete();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCopySelected, onDelete, onPasteElement]);

  return (
    <section className="flex h-[calc(100vh-7rem)] flex-col gap-3 overflow-hidden">
      <div className="rounded-3xl border border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10 px-4 py-3 text-sm text-[var(--color-warning)] md:hidden">
        Mobile editor controls are limited. Use a desktop viewport for full editing.
      </div>
      <div className="grid min-h-0 flex-1 items-stretch gap-3 xl:grid-cols-[220px_minmax(0,1fr)_360px]">
        <EditorToolbar
          currentMode={currentMode}
          onDelete={onDelete}
          onMoveBack={onMoveBack}
          onMoveFront={onMoveFront}
          onSelectMode={onSelectMode}
        />
        <OverlayCanvas
          canvas={canvas}
          currentMode={currentMode}
          elements={elements}
          canPasteElement={canPasteElement}
          onDragElement={onDragElement}
          onDrawCircle={onDrawCircle}
          onDrawRect={onDrawRect}
          onElementContextAction={onElementContextAction}
          onResizeElement={onResizeElement}
          onSelectElement={onCanvasSelect}
          onSelectElements={onSelectElements}
          onToggleElementSelection={onToggleElementSelection}
          selectedElementId={selectedElementId}
          selectedElementIds={selectedElementIds}
        />
        <div className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-3">
          <div className="min-h-0 overflow-y-auto pr-1">
            <ElementPropertyPanel
              element={selectedElement}
              elements={selectedElements}
              onChange={onElementFieldChange}
            />
          </div>
          <EditorActionBar
            className="rounded-none border-x-0"
            hasElements={elements.length > 0}
            isUploading={isUploading}
            onExport={onExportJson}
            onImport={onImportJson}
            onPreview={onOpenPreview}
            onReset={onReset}
            onUpload={onUpload}
            uploadActionLabel={uploadActionLabel}
          />
        </div>
      </div>
      <EditorJsonPreviewModal
        errors={jsonPreview.errors}
        jsonText={jsonPreview.jsonText}
        onClose={onClosePreview}
        onExport={onExportJson}
        open={jsonPreview.open}
        summary={jsonPreview.summary}
      />
    </section>
  );
}

function isEditableTarget(target) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
  );
}

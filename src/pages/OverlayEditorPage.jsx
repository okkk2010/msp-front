import {
  addElement,
  moveElementLayer,
  removeElement,
  resetEditor,
  selectElement,
  setCanvas,
  setEditorMode,
  setOverlayMeta,
  setOverlaySettings,
  updateElement,
  useEditorStore,
} from "../store/editorStore";
import { createElement } from "../utils/elementFactory";
import { OverlayEditor } from "../components/editor/OverlayEditor";
import { useToast } from "../hooks/useToast";

export function OverlayEditorPage() {
  const { showToast } = useToast();
  const canvas = useEditorStore((state) => state.canvas);
  const editorMode = useEditorStore((state) => state.editorMode);
  const elements = useEditorStore((state) => state.elements);
  const overlayMeta = useEditorStore((state) => state.overlayMeta);
  const selectedElementId = useEditorStore((state) => state.selectedElementId);
  const opacity = useEditorStore((state) => state.overlaySettings.opacity);
  const selectedElement = elements.find((element) => element.id === selectedElementId) ?? null;

  function handleAddElement(type) {
    addElement(createElement(type));
    setEditorMode(type);
  }

  return (
    <OverlayEditor
      canvas={canvas}
      currentMode={editorMode}
      elements={elements}
      onAddCircle={() => handleAddElement("circle")}
      onAddLine={() => handleAddElement("line")}
      onAddRect={() => handleAddElement("rect")}
      onCanvasChange={setCanvas}
      onDelete={() => {
        if (!selectedElementId) {
          showToast({
            message: "삭제할 요소를 먼저 선택해 주세요.",
            type: "info",
          });
          return;
        }

        removeElement(selectedElementId);
      }}
      onElementFieldChange={(field, value) => {
        if (!selectedElementId) {
          return;
        }

        updateElement(selectedElementId, {
          [field]: value,
        });
      }}
      onImport={() =>
        showToast({
          message: "Import JSON은 이후 단계에서 연결됩니다.",
          type: "info",
        })
      }
      onMetaChange={setOverlayMeta}
      onMoveBack={(id) => moveElementLayer(id ?? selectedElementId, "back")}
      onMoveFront={(id) => moveElementLayer(id ?? selectedElementId, "front")}
      onOpacityChange={(value) =>
        setOverlaySettings({
          opacity: value,
        })
      }
      onPreview={() =>
        showToast({
          message: "Preview 모달은 이후 단계에서 연결됩니다.",
          type: "info",
        })
      }
      onReset={() => resetEditor()}
      onSelectElement={selectElement}
      onSelectMode={setEditorMode}
      opacity={opacity}
      overlayMeta={overlayMeta}
      selectedElement={selectedElement}
      selectedElementId={selectedElementId}
    />
  );
}

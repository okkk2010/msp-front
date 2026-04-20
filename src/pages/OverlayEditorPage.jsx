import { useEffect, useRef, useState } from "react";
import { useBeforeUnload, useBlocker, useNavigate } from "react-router-dom";

import { createOverlay } from "../api/overlayApi";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { OverlayEditor } from "../components/editor/OverlayEditor";
import { ROUTES } from "../constants/routes";
import { useToast } from "../hooks/useToast";
import {
  addElement,
  loadFromOverlayJson,
  moveElement,
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
import { buildOverlayJsonFilename } from "../utils/editorJsonFile";
import { buildOverlayFormData } from "../utils/overlayFormData";
import { buildOverlayJson } from "../utils/overlayJsonBuilder";
import { validateOverlayJson } from "../utils/overlayJsonValidator";
import { generateThumbnail } from "../utils/thumbnailGenerator";
import { getApiErrorMessage } from "../utils/apiError";
import { validateUploadFields } from "../utils/uploadValidator";

export function OverlayEditorPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  const hasInitializedRef = useRef(false);
  const [isUploading, setIsUploading] = useState(false);
  const [shouldBypassExitGuard, setShouldBypassExitGuard] = useState(false);
  const [jsonPreview, setJsonPreview] = useState({
    open: false,
    errors: [],
    jsonText: "",
    summary: null,
  });

  const editorState = useEditorStore((state) => state);
  const canvas = editorState.canvas;
  const editorMode = editorState.editorMode;
  const elements = editorState.elements;
  const overlayMeta = editorState.overlayMeta;
  const selectedElementId = editorState.selectedElementId;
  const opacity = editorState.overlaySettings.opacity;
  const isDirty = editorState.isDirty;
  const selectedElement = elements.find((element) => element.id === selectedElementId) ?? null;
  const shouldWarnOnExit = isDirty && !isUploading && !shouldBypassExitGuard;
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      shouldWarnOnExit && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (hasInitializedRef.current) {
      return;
    }

    hasInitializedRef.current = true;
    resetEditor();
  }, []);

  useEffect(() => {
    if (!shouldWarnOnExit && blocker.state === "blocked") {
      blocker.reset();
    }
  }, [blocker, shouldWarnOnExit]);

  useBeforeUnload((event) => {
    if (!shouldWarnOnExit) {
      return;
    }

    event.preventDefault();
    event.returnValue = "";
  });

  function handleAddElement(type) {
    addElement(createElement(type));
    setEditorMode(type);
  }

  function buildValidatedJson() {
    const overlayJson = buildOverlayJson(editorState);
    const validation = validateOverlayJson(overlayJson);

    return {
      overlayJson,
      validation,
      jsonText: JSON.stringify(overlayJson, null, 2),
    };
  }

  function handlePreview() {
    const { validation, jsonText } = buildValidatedJson();

    setJsonPreview({
      open: true,
      errors: validation.errors,
      jsonText,
      summary: validation.summary,
    });
  }

  function handleExportJson() {
    const { overlayJson, validation, jsonText } = buildValidatedJson();

    if (!validation.isValid) {
      showToast({
        message: validation.errors[0] ?? "Overlay JSON is invalid.",
        type: "error",
      });
      setJsonPreview({
        open: true,
        errors: validation.errors,
        jsonText,
        summary: validation.summary,
      });
      return;
    }

    const blob = new Blob([jsonText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = buildOverlayJsonFilename(overlayMeta.name || overlayJson.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast({
      message: "Overlay JSON exported.",
      type: "success",
    });
  }

  function handleImportClick() {
    if (isDirty && !window.confirm("현재 편집 내용이 있습니다. JSON을 가져오면 현재 상태를 덮어씁니다. 계속하시겠습니까?")) {
      return;
    }

    fileInputRef.current?.click();
  }

  async function handleImportChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const validation = validateOverlayJson(parsed);

      if (!validation.isValid) {
        showToast({
          message:
            validation.errors[0] ??
            "지원하지 않는 overlay.json 형식입니다. 필수 필드와 요소 타입을 확인해 주세요.",
          type: "error",
        });
        setJsonPreview({
          open: true,
          errors: validation.errors,
          jsonText: JSON.stringify(parsed, null, 2),
          summary: validation.summary,
        });
        return;
      }

      loadFromOverlayJson(parsed);
      setJsonPreview((current) => ({
        ...current,
        open: false,
      }));
      showToast({
        message: "Overlay JSON을 불러왔습니다. 업로드 전 code와 메타 정보를 다시 확인하세요.",
        type: "success",
      });
    } catch {
      showToast({
        message: "지원하지 않는 overlay.json 형식입니다. JSON 문법과 필수 필드를 확인해 주세요.",
        type: "error",
      });
    }
  }

  async function handleUpload() {
    const uploadValidation = validateUploadFields(editorState);
    if (!uploadValidation.isValid) {
      showToast({
        message: uploadValidation.errors[0],
        type: "error",
      });
      return;
    }

    const { overlayJson, validation, jsonText } = buildValidatedJson();
    if (!validation.isValid) {
      setJsonPreview({
        open: true,
        errors: validation.errors,
        jsonText,
        summary: validation.summary,
      });
      showToast({
        message: validation.errors[0] ?? "Overlay JSON is invalid.",
        type: "error",
      });
      return;
    }

    try {
      setIsUploading(true);
      const thumbnail = await generateThumbnail(overlayJson);
      const formData = buildOverlayFormData({
        editorState,
        overlayJson,
        thumbnail,
      });
      const created = await createOverlay(formData);

      showToast({
        message: "Overlay uploaded successfully.",
        type: "success",
      });

      setShouldBypassExitGuard(true);
      resetEditor();

      const nextOverlayId = created?.overlayId;
      if (nextOverlayId) {
        navigate(ROUTES.overlayDetail.replace(":overlayId", nextOverlayId));
        return;
      }

      navigate(ROUTES.overlays);
    } catch (error) {
      showToast({
        message: getApiErrorMessage(error),
        type: "error",
      });
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <>
      <input
        accept="application/json"
        className="hidden"
        onChange={handleImportChange}
        ref={fileInputRef}
        type="file"
      />
      <OverlayEditor
        canvas={canvas}
        currentMode={editorMode}
        elements={elements}
        isUploading={isUploading}
        jsonPreview={jsonPreview}
        onAddCircle={() => handleAddElement("circle")}
        onAddLine={() => handleAddElement("line")}
        onAddRect={() => handleAddElement("rect")}
        onCanvasChange={setCanvas}
        onCanvasSelect={selectElement}
        onClosePreview={() =>
          setJsonPreview((current) => ({
            ...current,
            open: false,
          }))
        }
        onDelete={() => {
          if (!selectedElementId) {
            showToast({
              message: "Select an element before deleting.",
              type: "info",
            });
            return;
          }

          if (selectedElement?.locked) {
            showToast({
              message: "Locked element cannot be deleted.",
              type: "error",
            });
            return;
          }

          removeElement(selectedElementId);
        }}
        onDragElement={moveElement}
        onElementFieldChange={(field, value) => {
          if (!selectedElementId) {
            return;
          }

          if (selectedElement?.locked) {
            showToast({
              message: "Locked element cannot be edited.",
              type: "error",
            });
            return;
          }

          updateElement(selectedElementId, {
            [field]: value,
          });
        }}
        onExportJson={handleExportJson}
        onImportJson={handleImportClick}
        onMetaChange={setOverlayMeta}
        onMoveBack={(id) => moveElementLayer(id ?? selectedElementId, "back")}
        onMoveFront={(id) => moveElementLayer(id ?? selectedElementId, "front")}
        onOpacityChange={(value) =>
          setOverlaySettings({
            opacity: value,
          })
        }
        onOpenPreview={handlePreview}
        onReset={() => {
          if (isDirty && !window.confirm("현재 편집 내용을 초기화하시겠습니까?")) {
            return;
          }

          resetEditor();
        }}
        onSelectElement={selectElement}
        onSelectMode={setEditorMode}
        onUpload={handleUpload}
        opacity={opacity}
        overlayMeta={overlayMeta}
        selectedElement={selectedElement}
        selectedElementId={selectedElementId}
      />
      <UnsavedChangesModal
        open={blocker.state === "blocked"}
        onLeave={() => {
          resetEditor();
          blocker.proceed?.();
        }}
        onStay={() => blocker.reset?.()}
      />
    </>
  );
}

function UnsavedChangesModal({ open, onLeave, onStay }) {
  return (
    <Modal open={open} title="Unsaved Changes">
      <p className="text-sm leading-6 text-[var(--color-text-sub)]">
        저장하지 않은 편집 내용이 있습니다. 이 페이지를 떠나면 현재 작업 내용이 사라집니다.
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <Button onClick={onStay} variant="ghost">
          계속 편집
        </Button>
        <Button onClick={onLeave} variant="primary">
          페이지 이동
        </Button>
      </div>
    </Modal>
  );
}

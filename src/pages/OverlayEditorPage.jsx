import { useEffect, useRef, useState } from "react";
import { useBeforeUnload, useBlocker, useLocation, useNavigate, useParams } from "react-router-dom";

import { fetchGamesByPlatform } from "../api/gameApi";
import { createOverlay, fetchOverlayDetail, updateOverlay } from "../api/overlayApi";
import { Button } from "../components/common/Button";
import { Modal } from "../components/common/Modal";
import { OverlayEditor } from "../components/editor/OverlayEditor";
import { UploadOverlayModal } from "../components/editor/UploadOverlayModal";
import { ROUTES } from "../constants/routes";
import { useToast } from "../hooks/useToast";
import {
  addElement,
  loadFromOverlayJson,
  moveElement,
  moveElementLayer,
  removeElements,
  removeElement,
  resetEditor,
  selectElement,
  selectElements,
  setEditorMode,
  setOverlayMeta,
  toggleElementSelection,
  updateElement,
  updateElements,
  moveElementLayerTo,
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
import { buildAssetUrl } from "../utils/assetUrl";

export function OverlayEditorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { overlayId } = useParams();
  const isCustomizeRoute = location.pathname.startsWith("/editor/customize/");
  const sourceOverlayId = isCustomizeRoute ? overlayId : null;
  const editOverlayId = isCustomizeRoute ? null : overlayId;
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  const hasInitializedRef = useRef(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingExisting, setIsLoadingExisting] = useState(Boolean(overlayId));
  const [loadError, setLoadError] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [shouldBypassExitGuard, setShouldBypassExitGuard] = useState(false);
  const [jsonPreview, setJsonPreview] = useState({
    open: false,
    errors: [],
    jsonText: "",
    summary: null,
  });
  const [copiedElement, setCopiedElement] = useState(null);

  const editorState = useEditorStore((state) => state);
  const canvas = editorState.canvas;
  const editorMode = editorState.editorMode;
  const elements = editorState.elements;
  const overlayMeta = editorState.overlayMeta;
  const selectedElementId = editorState.selectedElementId;
  const selectedElementIds = editorState.selectedElementIds ?? [];
  const isDirty = editorState.isDirty;
  const selectedElement = elements.find((element) => element.id === selectedElementId) ?? null;
  const selectedElements = elements.filter((element) => selectedElementIds.includes(element.id));
  const shouldWarnOnExit = isDirty && !isUploading && !shouldBypassExitGuard;
  const isEditMode = Boolean(editOverlayId);
  const isCustomizeMode = Boolean(sourceOverlayId);
  const loadOverlayId = editOverlayId ?? sourceOverlayId;
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      shouldWarnOnExit && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (hasInitializedRef.current) {
      return;
    }

    hasInitializedRef.current = true;

    if (!loadOverlayId) {
      resetEditor();
    }
  }, [loadOverlayId]);

  useEffect(() => {
    if (!loadOverlayId) {
      return;
    }

    let active = true;

    setIsLoadingExisting(true);
    setLoadError("");

    fetchOverlayDetail(loadOverlayId)
      .then(async (detail) => {
        const jsonUrl = buildAssetUrl(detail?.jsonPath);
        if (!jsonUrl) {
          throw new Error("Overlay JSON path is unavailable.");
        }

        const [overlayJson, games] = await Promise.all([
          fetchJsonFile(jsonUrl),
          detail?.platform ? fetchGamesByPlatform(detail.platform).catch(() => []) : Promise.resolve([]),
        ]);

        if (!active) {
          return;
        }

        const matchedGame = Array.isArray(games)
          ? games.find((game) => game.slug === detail.game || String(game.id) === String(overlayJson.game?.id))
          : null;

        const nextCode = isCustomizeMode ? generateCode() : detail.code ?? extractCodeFromOverlayId(detail.overlayId);

        loadFromOverlayJson(overlayJson, {
          overlayId: isCustomizeMode ? "" : detail.overlayId,
          name: isCustomizeMode ? `${detail.name ?? overlayJson.name} Copy` : detail.name ?? overlayJson.name,
          description: detail.description ?? overlayJson.description ?? "",
          code: nextCode,
          platform: detail.platform ?? overlayJson.platform,
          gameId: matchedGame?.id ?? overlayJson.game?.id ?? null,
          gameName: matchedGame?.displayName ?? overlayJson.game?.name ?? detail.game ?? "",
        });
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        resetEditor();
        setLoadError(getApiErrorMessage(error));
      })
      .finally(() => {
        if (!active) {
          return;
        }

        setIsLoadingExisting(false);
      });

    return () => {
      active = false;
    };
  }, [isCustomizeMode, loadOverlayId]);

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

  function handleDrawRect(bounds) {
    addElement(
      createElement("rect", {
        x: Math.round(bounds.x),
        y: Math.round(bounds.y),
        width: Math.round(bounds.width),
        height: Math.round(bounds.height),
      }),
    );
    setEditorMode("select");
  }

  function handleDrawCircle(bounds) {
    addElement(
      createElement("circle", {
        x: Math.round(bounds.x),
        y: Math.round(bounds.y),
        width: Math.round(bounds.width),
        height: Math.round(bounds.height),
      }),
    );
    setEditorMode("select");
  }

  function handleDeleteElement(id = selectedElementId) {
    if (!id && selectedElementIds.length > 1) {
      const deletableIds = selectedElements
        .filter((element) => !element.locked)
        .map((element) => element.id);

      if (!deletableIds.length) {
        showToast({
          message: "Locked elements cannot be deleted.",
          type: "error",
        });
        return;
      }

      removeElements(deletableIds);
      return;
    }

    const target = elements.find((element) => element.id === id) ?? null;
    if (!id || !target) {
      showToast({
        message: "Select an element before deleting.",
        type: "info",
      });
      return;
    }

    if (target.locked) {
      showToast({
        message: "Locked element cannot be deleted.",
        type: "error",
      });
      return;
    }

    removeElement(id);
  }

  function handleCopyElement(id = selectedElementId) {
    const target = elements.find((element) => element.id === id) ?? null;

    if (!target) {
      showToast({
        message: "Select an element before copying.",
        type: "info",
      });
      return;
    }

    setCopiedElement(target);
  }

  function handlePasteElement() {
    if (!copiedElement) {
      showToast({
        message: "Copy an element before pasting.",
        type: "info",
      });
      return;
    }

    addElement(cloneElement(copiedElement, getMaxZIndex(elements) + 1));
  }

  function handleContextAction(action, id) {
    if (action === "paste") {
      handlePasteElement();
      return;
    }

    const target = elements.find((element) => element.id === id) ?? null;

    if (!target) {
      return;
    }

    selectElement(id);

    if (action === "delete") {
      handleDeleteElement(id);
      return;
    }

    if (action === "forward") {
      moveElementLayer(id, "front");
      return;
    }

    if (action === "backward") {
      moveElementLayer(id, "back");
      return;
    }

    if (action === "front") {
      moveElementLayerTo(id, "front");
      return;
    }

    if (action === "back") {
      moveElementLayerTo(id, "back");
      return;
    }

    if (action === "copy") {
      handleCopyElement(id);
      return;
    }

    if (action === "duplicate") {
      setCopiedElement(target);
      addElement(cloneElement(target, getMaxZIndex(elements) + 1));
    }
  }

  function handleElementFieldChange(field, value) {
    if (selectedElementIds.length > 1) {
      const editableIds = selectedElements
        .filter((element) => !element.locked && field in element)
        .map((element) => element.id);

      if (!editableIds.length) {
        showToast({
          message: "Selected elements cannot use this property.",
          type: "info",
        });
        return;
      }

      updateElements(editableIds, {
        [field]: value,
      });
      return;
    }

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

      loadFromOverlayJson(
        parsed,
        isEditMode
          ? {
              overlayId: editOverlayId,
              code: overlayMeta.code,
            }
          : isCustomizeMode
            ? {
                overlayId: "",
                code: generateCode(),
              }
            : {},
      );
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
      const saved = isEditMode
        ? await updateOverlay(editOverlayId, formData)
        : await createOverlay(formData);

      showToast({
        message: isEditMode
          ? "Overlay updated successfully."
          : isCustomizeMode
            ? "Custom overlay created successfully."
            : "Overlay uploaded successfully.",
        type: "success",
      });

      setIsUploadModalOpen(false);
      setShouldBypassExitGuard(true);
      resetEditor();

      const nextOverlayId = saved?.overlayId ?? editOverlayId;
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

  if (isLoadingExisting) {
    return (
      <section className="flex h-[calc(100vh-7rem)] items-center justify-center">
        <p className="text-sm text-[var(--color-text-sub)]">
          {isCustomizeMode ? "Loading overlay for customization..." : "Loading overlay for editing..."}
        </p>
      </section>
    );
  }

  if (loadError) {
    return (
      <section className="space-y-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h1 className="text-xl font-semibold">Unable to load overlay</h1>
        <p className="text-sm text-[var(--color-text-sub)]">{loadError}</p>
        <Button onClick={() => navigate(ROUTES.overlays)} variant="secondary">
          Back to Discover
        </Button>
      </section>
    );
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
        onCanvasSelect={selectElement}
        onClosePreview={() =>
          setJsonPreview((current) => ({
            ...current,
            open: false,
          }))
        }
        canPasteElement={Boolean(copiedElement)}
        onCopySelected={handleCopyElement}
        onDelete={() => handleDeleteElement()}
        onDragElement={moveElement}
        onDrawCircle={handleDrawCircle}
        onDrawRect={handleDrawRect}
        onElementContextAction={handleContextAction}
        onElementFieldChange={handleElementFieldChange}
        onExportJson={handleExportJson}
        onImportJson={handleImportClick}
        onMoveBack={(id) => moveElementLayer(id ?? selectedElementId, "back")}
        onMoveFront={(id) => moveElementLayer(id ?? selectedElementId, "front")}
        onOpenPreview={handlePreview}
        onPasteElement={handlePasteElement}
        onReset={() => {
          if (isDirty && !window.confirm("현재 편집 내용을 초기화하시겠습니까?")) {
            return;
          }

          resetEditor();
        }}
        onResizeElement={updateElement}
        onSelectMode={setEditorMode}
        onSelectElements={selectElements}
        onToggleElementSelection={toggleElementSelection}
        onUpload={() => setIsUploadModalOpen(true)}
        uploadActionLabel={isEditMode ? "Save Changes" : isCustomizeMode ? "Create Overlay" : "Upload"}
        selectedElement={selectedElement}
        selectedElementId={selectedElementId}
        selectedElementIds={selectedElementIds}
        selectedElements={selectedElements}
      />
      <UploadOverlayModal
        canvas={canvas}
        elements={elements}
        isUploading={isUploading}
        mode={isEditMode ? "edit" : "create"}
        onClose={() => setIsUploadModalOpen(false)}
        onMetaChange={setOverlayMeta}
        onSubmit={handleUpload}
        open={isUploadModalOpen}
        overlayMeta={overlayMeta}
        submitLabel={isEditMode ? "Save Changes" : isCustomizeMode ? "Create Overlay" : "Upload"}
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

async function fetchJsonFile(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to load overlay JSON.");
  }

  return response.json();
}

function extractCodeFromOverlayId(overlayId) {
  const value = String(overlayId ?? "");

  if (value.startsWith("ovl_")) {
    return value.slice(4).toUpperCase();
  }

  return value.toUpperCase();
}

function generateCode() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
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

function cloneElement(element, zIndex) {
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${element.type}-${Date.now()}`;
  const copy = {
    ...element,
    id,
    zIndex,
  };

  if (element.type === "line") {
    return {
      ...copy,
      x1: element.x1 + 24,
      x2: element.x2 + 24,
      y1: element.y1 + 24,
      y2: element.y2 + 24,
    };
  }

  return {
    ...copy,
    x: element.x + 24,
    y: element.y + 24,
  };
}

function getMaxZIndex(elements) {
  if (!elements.length) {
    return 0;
  }

  return Math.max(...elements.map((element) => element.zIndex ?? 0));
}

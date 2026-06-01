import { useEffect, useMemo, useState } from "react";

import { fetchGamesByPlatform } from "../../api/gameApi";
import { fetchPlatforms } from "../../api/platformApi";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { Modal } from "../common/Modal";
import { Select } from "../common/Select";
import { Textarea } from "../common/Textarea";

export function UploadOverlayModal({
  canvas,
  elements,
  isUploading,
  onClose,
  onMetaChange,
  onSubmit,
  open,
  overlayMeta,
}) {
  const [platforms, setPlatforms] = useState([]);
  const [games, setGames] = useState([]);
  const [isGameLoading, setIsGameLoading] = useState(false);
  const sortedElements = useMemo(
    () => elements.slice().sort((left, right) => left.zIndex - right.zIndex),
    [elements],
  );

  useEffect(() => {
    let active = true;

    if (!open) {
      return () => {
        active = false;
      };
    }

    fetchPlatforms()
      .then((data) => {
        if (active) {
          setPlatforms(normalizePlatforms(data));
        }
      })
      .catch(() => {
        if (active) {
          setPlatforms([
            { id: 1, name: "Windows", slug: "windows" },
            { id: 2, name: "Android", slug: "android" },
          ]);
        }
      });

    return () => {
      active = false;
    };
  }, [open]);

  useEffect(() => {
    let active = true;

    if (!open || !overlayMeta.platform) {
      setGames([]);
      return () => {
        active = false;
      };
    }

    setIsGameLoading(true);
    fetchGamesByPlatform(overlayMeta.platform)
      .then((data) => {
        if (active) {
          setGames(normalizeGames(data));
        }
      })
      .catch(() => {
        if (active) {
          setGames([]);
        }
      })
      .finally(() => {
        if (active) {
          setIsGameLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [open, overlayMeta.platform]);

  return (
    <Modal className="max-h-[90vh] max-w-5xl overflow-y-auto" open={open} title="Upload Overlay">
      <form
        className="grid gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <OverlayPreview canvas={canvas} elements={sortedElements} />
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm md:col-span-2">
            <span className="text-[var(--color-text-sub)]">name</span>
            <Input
              onChange={(event) => onMetaChange({ name: event.target.value })}
              value={overlayMeta.name}
            />
          </label>
          <label className="space-y-2 text-sm md:col-span-2">
            <span className="text-[var(--color-text-sub)]">description</span>
            <Textarea
              onChange={(event) => onMetaChange({ description: event.target.value })}
              value={overlayMeta.description}
            />
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-[var(--color-text-sub)]">code</span>
            <Input
              maxLength={6}
              onChange={(event) => onMetaChange({ code: event.target.value.toUpperCase() })}
              value={overlayMeta.code}
            />
          </label>
          <div className="flex items-end">
            <Button
              className="w-full"
              onClick={() => onMetaChange({ code: generateCode() })}
              variant="secondary"
            >
              Generate Code
            </Button>
          </div>
          <label className="space-y-2 text-sm">
            <span className="text-[var(--color-text-sub)]">platform</span>
            <Select
              onChange={(event) =>
                onMetaChange({
                  platform: event.target.value,
                  gameId: null,
                  gameName: "",
                })
              }
              value={overlayMeta.platform}
            >
              {platforms.map((platform) => (
                <option key={platform.slug} value={platform.slug}>
                  {platform.name}
                </option>
              ))}
            </Select>
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-[var(--color-text-sub)]">category</span>
            <Select
              onChange={(event) => {
                const selected = games.find((game) => String(game.id) === event.target.value);
                onMetaChange({
                  gameId: selected?.id ?? null,
                  gameName: selected?.displayName ?? "",
                });
              }}
              required
              value={overlayMeta.gameId ?? ""}
            >
              <option value="">{isGameLoading ? "Loading categories..." : "Select category"}</option>
              {games.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.displayName}
                </option>
              ))}
            </Select>
          </label>
        </div>
        <div className="flex justify-end gap-3 border-t border-[var(--color-border)] pt-4">
          <Button disabled={isUploading} onClick={onClose} variant="ghost">
            Cancel
          </Button>
          <Button disabled={isUploading} type="submit" variant="primary">
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function OverlayPreview({ canvas, elements }) {
  return (
    <div className="overflow-hidden border border-[var(--color-border)] bg-[#0f172a]">
      <svg
        className="block h-auto w-full"
        preserveAspectRatio="xMidYMid meet"
        viewBox={`0 0 ${canvas.baseWidth} ${canvas.baseHeight}`}
      >
        <rect fill="#0f172a" height={canvas.baseHeight} width={canvas.baseWidth} x="0" y="0" />
        {elements.map((element) => (
          <PreviewElement element={element} key={element.id} />
        ))}
      </svg>
    </div>
  );
}

function PreviewElement({ element }) {
  const sharedProps = {
    opacity: toSvgOpacity(element.opacity),
  };

  if (element.type === "rect") {
    return (
      <rect
        fill={element.fillColor}
        height={element.height}
        rx={element.cornerRadius}
        stroke={element.strokeColor}
        strokeWidth={element.strokeWidth}
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
        stroke={element.strokeColor}
        strokeWidth={element.strokeWidth}
        {...sharedProps}
      />
    );
  }

  return (
    <line
      stroke={element.strokeColor}
      strokeDasharray={getDashArray(element.dashStyle)}
      strokeLinecap="round"
      strokeWidth={element.strokeWidth}
      x1={element.x1}
      x2={element.x2}
      y1={element.y1}
      y2={element.y2}
      {...sharedProps}
    />
  );
}

function normalizePlatforms(data) {
  return Array.isArray(data)
    ? data
        .map((platform) => ({
          id: platform.id,
          name: platform.name ?? platform.slug ?? platform,
          slug: platform.slug ?? String(platform.name ?? platform).toLowerCase(),
        }))
        .filter((platform) => platform.slug)
    : [];
}

function normalizeGames(data) {
  return Array.isArray(data)
    ? data
        .map((game) => ({
          id: game.id ?? game.slug ?? game.name ?? game.displayName,
          slug: game.slug ?? String(game.name ?? game.displayName ?? game.id).toLowerCase(),
          displayName: game.displayName ?? game.name ?? game.slug ?? String(game.id),
        }))
        .filter((game) => game.id)
    : [];
}

function generateCode() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
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

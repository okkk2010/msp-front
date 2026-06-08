import { useEffect, useState } from "react";

import { fetchGamesByPlatform } from "../../api/gameApi";
import { fetchPlatforms } from "../../api/platformApi";
import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { Input } from "../common/Input";
import { Select } from "../common/Select";
import { Slider } from "../common/Slider";
import { Textarea } from "../common/Textarea";

export function OverlayMetaPanel({
  canvas,
  opacity,
  overlayMeta,
  onCanvasChange,
  onMetaChange,
  onOpacityChange,
}) {
  const [platforms, setPlatforms] = useState([]);
  const [games, setGames] = useState([]);

  useEffect(() => {
    let active = true;

    fetchPlatforms()
      .then((data) => {
        if (!active) {
          return;
        }

        setPlatforms(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setPlatforms([
          { id: 1, name: "Windows", slug: "windows" },
          { id: 2, name: "Android", slug: "android" },
        ]);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    if (!overlayMeta.platform) {
      setGames([]);
      return () => {
        active = false;
      };
    }

    fetchGamesByPlatform(overlayMeta.platform)
      .then((data) => {
        if (!active) {
          return;
        }

        setGames(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setGames([]);
      });

    return () => {
      active = false;
    };
  }, [overlayMeta.platform]);

  return (
    <Card className="space-y-4 p-5">
      <div>
        <h2 className="text-base font-semibold">기본 정보</h2>
        <p className="mt-1 text-sm text-[var(--color-text-sub)]">
          업로드와 JSON 생성에 필요한 기본 정보를 입력합니다.
        </p>
      </div>
      <label className="space-y-2 text-sm">
        <span className="text-[var(--color-text-sub)]">이름</span>
        <Input
          onChange={(event) => onMetaChange({ name: event.target.value })}
          value={overlayMeta.name}
        />
      </label>
      <label className="space-y-2 text-sm">
        <span className="text-[var(--color-text-sub)]">설명</span>
        <Textarea
          onChange={(event) => onMetaChange({ description: event.target.value })}
          value={overlayMeta.description}
        />
      </label>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="text-[var(--color-text-sub)]">코드</span>
          <Input
            maxLength={6}
            onChange={(event) => onMetaChange({ code: event.target.value.toUpperCase() })}
            value={overlayMeta.code}
          />
        </label>
        <div className="flex items-end">
          <Button
            className="w-full"
            onClick={() =>
              onMetaChange({
                code: generateCode(),
              })
            }
            variant="secondary"
          >
            코드 생성
          </Button>
        </div>
        <label className="space-y-2 text-sm">
          <span className="text-[var(--color-text-sub)]">플랫폼</span>
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
          <span className="text-[var(--color-text-sub)]">게임</span>
          <Select
            onChange={(event) => {
              const selected = games.find((game) => String(game.id) === event.target.value);
              onMetaChange({
                gameId: selected?.id ?? null,
                gameName: selected?.displayName ?? "",
              });
            }}
            value={overlayMeta.gameId ?? ""}
          >
            <option value="">게임 선택</option>
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.displayName}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-[var(--color-text-sub)]">기준 너비</span>
          <Input
            onChange={(event) => onCanvasChange({ baseWidth: Number(event.target.value) })}
            value={canvas.baseWidth}
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-[var(--color-text-sub)]">기준 높이</span>
          <Input
            onChange={(event) => onCanvasChange({ baseHeight: Number(event.target.value) })}
            value={canvas.baseHeight}
          />
        </label>
      </div>
      <label className="space-y-2 text-sm">
        <span className="text-[var(--color-text-sub)]">투명도</span>
        <Slider max={100} min={0} onChange={(event) => onOpacityChange(Number(event.target.value))} value={opacity} />
      </label>
    </Card>
  );
}

function generateCode() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

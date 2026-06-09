import { useState } from "react";

import { Button } from "../common/Button";
import { Card } from "../common/Card";
import { PlatformIconBadge } from "../common/PlatformIconBadge";

export function OverlayCard({
  code,
  isSaved,
  likeCount,
  likedByMe,
  name,
  onClick,
  onLike,
  onSave,
  platform,
  thumbnailUrl,
}) {
  return (
    <Card
      className="group flex h-full min-h-[390px] cursor-pointer flex-col overflow-hidden p-0 hover:border-[var(--color-primary)] hover:shadow-md"
      onClick={onClick}
    >
      <section className="border-b border-[var(--color-border)] p-4">
        <Thumbnail name={name} thumbnailUrl={thumbnailUrl} />
      </section>
      <section className="grid min-h-20 grid-cols-2 gap-3 border-b border-[var(--color-border)] p-4">
        <PlatformMetaItem platform={platform} />
        <CodeMetaItem code={code} />
      </section>
      <section className="min-h-20 border-b border-[var(--color-border)] p-4">
        <h3 className="line-clamp-2 break-words text-base font-semibold leading-6 text-[var(--color-text-main)]">
          {name || "제목 없는 오버레이"}
        </h3>
      </section>
      <section className="mt-auto flex items-center gap-2 p-4">
        <Button
          className="shrink-0 whitespace-nowrap"
          onClick={(event) => {
            event.stopPropagation();
            onLike?.();
          }}
          variant={likedByMe ? "primary" : "secondary"}
        >
          <span aria-hidden="true" className="mr-1.5">{likedByMe ? "♥" : "♡"}</span>{likeCount ?? 0}
        </Button>
        <Button
          className="flex-1"
          onClick={(event) => {
            event.stopPropagation();
            onSave?.();
          }}
          variant={isSaved ? "secondary" : "primary"}
        >
          {isSaved ? "저장됨" : "저장"}
        </Button>
      </section>
    </Card>
  );
}

function PlatformMetaItem({ platform }) {
  return (
    <div className="min-w-0 space-y-1">
      <p className="text-[10px] font-semibold uppercase leading-4 text-[var(--color-text-sub)]">Platform</p>
      <PlatformIconBadge platform={platform} />
    </div>
  );
}

function CodeMetaItem({ code }) {
  const [copied, setCopied] = useState(false);
  const value = code ?? "코드 없음";
  const canCopy = Boolean(code) && typeof navigator !== "undefined" && Boolean(navigator.clipboard);

  const baseClassName =
    "block w-full max-w-full truncate rounded-full border border-[var(--color-primary-soft)] bg-[var(--color-primary-soft)] px-3 py-1 text-center text-sm font-semibold leading-5 text-[var(--color-primary)]";

  function handleCopy(event) {
    event.stopPropagation();

    if (!canCopy) {
      return;
    }

    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      })
      .catch(() => {});
  }

  return (
    <div className="min-w-0 space-y-1">
      <p className="text-[10px] font-semibold uppercase leading-4 text-[var(--color-text-sub)]">Code</p>
      {canCopy ? (
        <button
          aria-label={`코드 ${value} 복사`}
          className={`${baseClassName} cursor-pointer transition-colors hover:bg-[var(--color-primary)] hover:text-white`}
          onClick={handleCopy}
          title={copied ? "복사됨" : "클릭하여 코드 복사"}
          type="button"
        >
          {copied ? "복사됨!" : value}
        </button>
      ) : (
        <span className={baseClassName} title={value}>
          {value}
        </span>
      )}
    </div>
  );
}

function Thumbnail({ name, thumbnailUrl }) {
  return thumbnailUrl ? (
    <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg bg-[var(--color-canvas-bg)]">
      <img
        alt={`${name} 미리보기`}
        className="h-full w-full object-contain"
        src={thumbnailUrl}
      />
    </div>
  ) : (
    <div className="flex aspect-video w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-[var(--color-canvas-bg)]">
      <strong className="text-sm font-semibold text-[var(--color-text-main)]">MSP Overlay</strong>
      <span className="mt-1 text-xs text-[var(--color-text-sub)]">업로드된 미리보기가 없습니다</span>
    </div>
  );
}

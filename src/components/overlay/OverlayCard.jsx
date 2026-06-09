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
      <section className="grid min-h-16 grid-cols-2 gap-3 border-b border-[var(--color-border)] p-4">
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
    <div className="flex min-w-0 items-center">
      <PlatformIconBadge platform={platform} />
    </div>
  );
}

function CodeMetaItem({ code }) {
  const [copied, setCopied] = useState(false);
  const value = code ?? "코드 없음";

  function handleCopy(event) {
    event.stopPropagation();

    if (!code || !navigator.clipboard) {
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
    <div className="flex min-w-0 items-center justify-end gap-1.5">
      <span
        className="block max-w-full truncate rounded-full border border-[var(--color-primary-soft)] bg-[var(--color-primary-soft)] px-3 py-1 text-center text-sm font-semibold leading-5 text-[var(--color-primary)]"
        title={value}
      >
        {value}
      </span>
      {code ? (
        <button
          type="button"
          aria-label="코드 복사"
          title={copied ? "복사됨" : "코드 복사"}
          className="shrink-0 rounded-md border border-[var(--color-border)] p-1 text-[var(--color-text-sub)] transition-colors hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-primary)]"
          onClick={handleCopy}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      ) : null}
    </div>
  );
}

function CopyIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="14"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="14"
    >
      <rect height="13" rx="2" width="13" x="9" y="9" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="14"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="14"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
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

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { saveOverlayToLibrary } from "../api/libraryApi";
import { likeOverlay, unlikeOverlay } from "../api/likeApi";
import { fetchOverlayDetail } from "../api/overlayApi";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { OverlayDetailInfo } from "../components/overlay/OverlayDetailInfo";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { markOverlaySaved } from "../store/libraryStore";
import { getApiErrorMessage } from "../utils/apiError";
import { buildAssetUrl } from "../utils/assetUrl";
import { formatRelativeDate } from "../utils/dateFormat";

export function OverlayDetailPage() {
  const navigate = useNavigate();
  const { overlayId } = useParams();
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    setIsLoading(true);
    setError("");

    fetchOverlayDetail(overlayId)
      .then((data) => {
        if (!active) {
          return;
        }

        setDetail(normalizeOverlayDetail(data));
      })
      .catch((requestError) => {
        if (!active) {
          return;
        }

        setError(getApiErrorMessage(requestError));
        setDetail(null);
      })
      .finally(() => {
        if (!active) {
          return;
        }

        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [overlayId, user?.id]);

  async function handleSaveToLibrary() {
    if (!detail) {
      return;
    }

    if (!isAuthenticated) {
      showToast({
        message: "라이브러리에 저장하려면 로그인해 주세요.",
        type: "info",
      });
      return;
    }

    try {
      setIsSaving(true);
      await saveOverlayToLibrary(detail.id);
      markOverlaySaved(detail.id);
      showToast({
        message: "라이브러리에 저장했습니다.",
        type: "success",
      });
    } catch (requestError) {
      showToast({
        message: getApiErrorMessage(requestError),
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleLike() {
    if (!detail) {
      return;
    }

    if (!isAuthenticated) {
      showToast({
        message: "좋아요를 누르려면 로그인해 주세요.",
        type: "info",
      });
      return;
    }

    const nextLiked = !detail.likedByMe;
    const previousLiked = detail.likedByMe;
    const previousCount = detail.likeCount ?? 0;

    setDetail((current) =>
      current
        ? {
            ...current,
            likedByMe: nextLiked,
            likeCount: Math.max(0, (current.likeCount ?? 0) + (nextLiked ? 1 : -1)),
          }
        : current,
    );

    try {
      setIsLiking(true);
      if (nextLiked) {
        await likeOverlay(detail.id);
      } else {
        await unlikeOverlay(detail.id);
      }
    } catch (requestError) {
      setDetail((current) =>
        current
          ? {
              ...current,
              likedByMe: previousLiked,
              likeCount: previousCount,
            }
          : current,
      );
      showToast({
        message: getApiErrorMessage(requestError),
        type: "error",
      });
    } finally {
      setIsLiking(false);
    }
  }

  function handleUseAsTemplate() {
    if (!detail) {
      return;
    }

    if (!isAuthenticated) {
      showToast({
        message: "이 오버레이를 템플릿으로 사용하려면 로그인해 주세요.",
        type: "info",
      });
      return;
    }

    navigate(`/editor/customize/${detail.overlayId}`);
  }

  function handleDownloadJson() {
    if (!detail?.jsonUrl) {
      showToast({
        message: "이 오버레이에는 다운로드 가능한 JSON이 없습니다.",
        type: "info",
      });
      return;
    }

    window.open(detail.jsonUrl, "_blank", "noopener,noreferrer");
  }

  if (isLoading) {
    return (
      <section className="space-y-4">
        <LoadingSpinner label="오버레이 상세 정보를 불러오는 중..." />
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-4">
        <ErrorMessage>{error}</ErrorMessage>
        <Button onClick={() => navigate("/overlays")} variant="secondary">
          탐색으로 돌아가기
        </Button>
      </section>
    );
  }

  if (!detail) {
    return (
      <EmptyState
        description="요청한 오버레이를 찾을 수 없습니다."
        title="오버레이 상세 정보를 사용할 수 없습니다."
      />
    );
  }

  const userId = user?.id;
  const authorId = detail.author?.id;
  const canEdit =
    isAuthenticated &&
    userId !== null &&
    userId !== undefined &&
    authorId !== null &&
    authorId !== undefined &&
    String(userId) === String(authorId);

  return (
    <section className="space-y-6">
      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <PreviewCard detail={detail} />
        <div className="space-y-4">
          <OverlayDetailInfo detail={detail} />
          <div className="grid gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm sm:grid-cols-2 2xl:grid-cols-1">
            {canEdit ? (
              <Button onClick={() => navigate(`/editor/${detail.overlayId}`)} variant="secondary">
                오버레이 편집
              </Button>
            ) : null}
            <Button disabled={isSaving} onClick={handleSaveToLibrary}>
              {isSaving ? "저장 중..." : "라이브러리에 저장"}
            </Button>
            <Button
              disabled={isLiking}
              onClick={handleToggleLike}
              variant={detail.likedByMe ? "primary" : "secondary"}
            >
              <span aria-hidden="true">{detail.likedByMe ? "♥" : "♡"}</span> 좋아요 {detail.likeCount ?? 0}
            </Button>
            {!canEdit ? (
              <Button onClick={handleUseAsTemplate} variant="secondary">
                오버레이 커스터마이즈
              </Button>
            ) : null}
            <Button onClick={handleDownloadJson} variant="secondary">
              JSON 다운로드
            </Button>
            <Button onClick={() => navigate("/overlays")} variant="ghost">
              탐색으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function PreviewCard({ detail }) {
  return (
    <Card className="overflow-hidden p-0">
      {detail.thumbnailUrl ? (
        <div className="flex aspect-video max-h-[calc(100vh-180px)] min-h-[320px] w-full items-center justify-center bg-[var(--color-canvas-bg)] p-3">
          <img
            alt={`${detail.name} 미리보기`}
            className="h-full w-full object-contain"
            src={detail.thumbnailUrl}
          />
        </div>
      ) : (
        <div className="flex aspect-video min-h-[320px] w-full flex-col items-center justify-center bg-[var(--color-surface-soft)]">
          <strong className="text-lg font-semibold">MSP Overlay</strong>
          <span className="mt-2 text-sm text-[var(--color-text-sub)]">업로드된 미리보기가 없습니다</span>
        </div>
      )}
    </Card>
  );
}

function normalizeOverlayDetail(data) {
  if (!data) {
    return null;
  }

  return {
    ...data,
    thumbnailUrl: buildAssetUrl(data.thumbnailPath),
    jsonUrl: buildAssetUrl(data.jsonPath),
    createdAtFormatted: formatRelativeDate(data.createdAt),
    updatedAtFormatted: formatRelativeDate(data.updatedAt),
  };
}

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { fetchOverlayDetail } from "../api/overlayApi";
import { saveOverlayToLibrary } from "../api/libraryApi";
import { Button } from "../components/common/Button";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { Card } from "../components/common/Card";
import { OverlayDetailInfo } from "../components/overlay/OverlayDetailInfo";
import { OverlayElementSummary } from "../components/overlay/OverlayElementSummary";
import { OverlayJsonSummary } from "../components/overlay/OverlayJsonSummary";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { markOverlaySaved } from "../store/libraryStore";
import { buildAssetUrl } from "../utils/assetUrl";
import { getApiErrorMessage } from "../utils/apiError";
import { formatRelativeDate } from "../utils/dateFormat";

export function OverlayDetailPage() {
  const navigate = useNavigate();
  const { overlayId } = useParams();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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
  }, [overlayId]);

  async function handleSaveToLibrary() {
    if (!detail) {
      return;
    }

    if (!isAuthenticated) {
      showToast({
        message: "로그인이 필요한 기능입니다.",
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

  function handleUseAsTemplate() {
    if (!detail) {
      return;
    }

    if (!isAuthenticated) {
      showToast({
        message: "로그인이 필요한 기능입니다.",
        type: "info",
      });
      return;
    }

    navigate(`/editor/${detail.overlayId}`);
  }

  function handleDownloadJson() {
    if (!detail?.jsonUrl) {
      showToast({
        message: "다운로드 가능한 JSON 경로가 없습니다.",
        type: "info",
      });
      return;
    }

    window.open(detail.jsonUrl, "_blank", "noopener,noreferrer");
  }

  if (isLoading) {
    return (
      <section className="space-y-4">
        <LoadingSpinner label="오버레이 상세 정보를 불러오는 중입니다." />
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-4">
        <ErrorMessage>{error}</ErrorMessage>
        <Button onClick={() => navigate("/overlays")} variant="secondary">
          Back to Discover
        </Button>
      </section>
    );
  }

  if (!detail) {
    return (
      <EmptyState
        description="요청한 오버레이를 찾을 수 없습니다."
        title="Overlay detail is unavailable."
      />
    );
  }

  return (
    <section className="space-y-8">
      <PreviewCard detail={detail} />
      <OverlayDetailInfo detail={detail} />
      <div className="flex flex-wrap gap-3">
        <Button disabled={isSaving} onClick={handleSaveToLibrary}>
          {isSaving ? "Saving..." : "Save to Library"}
        </Button>
        <Button onClick={handleUseAsTemplate} variant="secondary">
          Use as Template
        </Button>
        <Button onClick={handleDownloadJson} variant="secondary">
          Download JSON
        </Button>
        <Button onClick={() => navigate("/overlays")} variant="ghost">
          Back to Discover
        </Button>
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <OverlayJsonSummary detail={detail} />
        <OverlayElementSummary />
      </div>
    </section>
  );
}

function PreviewCard({ detail }) {
  return (
    <Card className="overflow-hidden p-0">
      {detail.thumbnailUrl ? (
        <img
          alt={`${detail.name} preview`}
          className="aspect-[16/7] w-full object-cover"
          src={detail.thumbnailUrl}
        />
      ) : (
        <div className="flex aspect-[16/7] w-full flex-col items-center justify-center bg-[var(--color-surface-soft)]">
          <strong className="text-lg font-semibold">MSP Overlay</strong>
          <span className="mt-2 text-sm text-[var(--color-text-sub)]">No Preview</span>
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

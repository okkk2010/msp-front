import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { saveOverlayToLibrary } from "../api/libraryApi";
import { fetchOverlayDetail } from "../api/overlayApi";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { OverlayDetailInfo } from "../components/overlay/OverlayDetailInfo";
import { OverlayElementSummary } from "../components/overlay/OverlayElementSummary";
import { OverlayJsonSummary } from "../components/overlay/OverlayJsonSummary";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { markOverlaySaved } from "../store/libraryStore";
import { getApiErrorMessage } from "../utils/apiError";
import { buildAssetUrl } from "../utils/assetUrl";
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
        message: "Log in to save overlays to your library.",
        type: "info",
      });
      return;
    }

    try {
      setIsSaving(true);
      await saveOverlayToLibrary(detail.id);
      markOverlaySaved(detail.id);
      showToast({
        message: "Saved to your library.",
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
        message: "Log in to use this overlay as a template.",
        type: "info",
      });
      return;
    }

    navigate(`/editor/${detail.overlayId}`);
  }

  function handleDownloadJson() {
    if (!detail?.jsonUrl) {
      showToast({
        message: "No downloadable JSON is available for this overlay.",
        type: "info",
      });
      return;
    }

    window.open(detail.jsonUrl, "_blank", "noopener,noreferrer");
  }

  if (isLoading) {
    return (
      <section className="space-y-4">
        <LoadingSpinner label="Loading overlay details..." />
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
        description="The requested overlay could not be found."
        title="Overlay detail is unavailable."
      />
    );
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_380px]">
        <PreviewCard detail={detail} />
        <div className="space-y-4">
          <OverlayDetailInfo detail={detail} />
          <div className="grid gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm sm:grid-cols-2 2xl:grid-cols-1">
            {isAuthenticated ? (
              <Button onClick={() => navigate(`/editor/${detail.overlayId}`)} variant="secondary">
                Edit Overlay
              </Button>
            ) : null}
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
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
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
        <div className="flex min-h-[420px] items-center justify-center bg-[var(--color-canvas-bg)] p-3">
          <img
            alt={`${detail.name} preview`}
            className="max-h-[70vh] w-full object-contain"
            src={detail.thumbnailUrl}
          />
        </div>
      ) : (
        <div className="flex min-h-[420px] w-full flex-col items-center justify-center bg-[var(--color-surface-soft)]">
          <strong className="text-lg font-semibold">MSP Overlay</strong>
          <span className="mt-2 text-sm text-[var(--color-text-sub)]">No preview uploaded</span>
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

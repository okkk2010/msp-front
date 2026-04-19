import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchGamesByPlatform } from "../api/gameApi";
import { saveOverlayToLibrary } from "../api/libraryApi";
import { fetchOverlayList } from "../api/overlayApi";
import { fetchPlatforms } from "../api/platformApi";
import { Button } from "../components/common/Button";
import { OverlayCodeSearch } from "../components/overlay/OverlayCodeSearch";
import { OverlayFilterBar } from "../components/overlay/OverlayFilterBar";
import { OverlayGrid } from "../components/overlay/OverlayGrid";
import { OverlaySearchBar } from "../components/overlay/OverlaySearchBar";
import { useAuth } from "../hooks/useAuth";
import { useOverlaySearch } from "../hooks/useOverlaySearch";
import { useToast } from "../hooks/useToast";
import { markOverlaySaved } from "../store/libraryStore";
import { getApiErrorMessage } from "../utils/apiError";
import { formatRelativeDate } from "../utils/dateFormat";

export function OverlayListPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const {
    filters,
    resetFilters,
    setCode,
    setGame,
    setKeyword,
    setPlatform,
    setSort,
  } = useOverlaySearch();
  const [items, setItems] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadNonce, setReloadNonce] = useState(0);

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

    if (!filters.platform) {
      setGames([]);
      return () => {
        active = false;
      };
    }

    fetchGamesByPlatform(filters.platform)
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
  }, [filters.platform]);

  useEffect(() => {
    let active = true;

    setIsLoading(true);
    setError("");

    fetchOverlayList(filters)
      .then((data) => {
        if (!active) {
          return;
        }

        const nextItems = normalizeOverlayItems(data);
        setItems(nextItems);
      })
      .catch((requestError) => {
        if (!active) {
          return;
        }

        setItems([]);
        setError(getApiErrorMessage(requestError));
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
  }, [filters, reloadNonce]);

  async function handleSave(item) {
    if (!isAuthenticated) {
      showToast({
        message: "로그인이 필요한 기능입니다.",
        type: "info",
      });
      navigate("/library");
      return;
    }

    try {
      await saveOverlayToLibrary(item.id);
      markOverlaySaved(item.id);
      setItems((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem.id === item.id
            ? {
                ...currentItem,
                isSaved: true,
                savedCount: (currentItem.savedCount ?? 0) + 1,
              }
            : currentItem,
        ),
      );
      showToast({
        message: "라이브러리에 저장했습니다.",
        type: "success",
      });
    } catch (requestError) {
      showToast({
        message: getApiErrorMessage(requestError),
        type: "error",
      });
    }
  }

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Overlay Discover</h1>
        <p className="text-sm text-[var(--color-text-sub)]">
          Find overlay layouts for comfortable 3D gameplay.
        </p>
      </div>
      <div className="grid gap-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 lg:grid-cols-[minmax(0,1fr)_180px_180px_auto]">
        <OverlaySearchBar
          onChange={(event) => setKeyword(event.target.value)}
          value={filters.keyword}
        />
        <OverlayCodeSearch
          onChange={(event) => setCode(event.target.value.toUpperCase())}
          value={filters.code}
        />
        <div className="flex items-end">
          <Button className="w-full" onClick={() => navigate("/editor")}>
            Create Overlay
          </Button>
        </div>
      </div>
      <OverlayFilterBar
        filters={filters}
        games={games}
        onGameChange={(event) => setGame(event.target.value)}
        onPlatformChange={(event) => setPlatform(event.target.value)}
        onReset={resetFilters}
        onSelectCategory={(tab) => {
          setPlatform(tab.platform);
          setSort(tab.sort);
        }}
        onSortChange={(event) => setSort(event.target.value)}
        platforms={platforms}
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-[var(--color-text-sub)]">
          page {filters.page + 1} · size {filters.size}
        </p>
        <Button onClick={resetFilters} variant="ghost">
          Clear Search
        </Button>
      </div>
      <OverlayGrid
        error={error}
        isLoading={isLoading}
        items={items}
        onCardClick={(item) => navigate(`/overlays/${item.overlayId}`)}
        onRetry={() => {
          setReloadNonce((value) => value + 1);
        }}
        onSave={handleSave}
      />
    </section>
  );
}

function normalizeOverlayItems(data) {
  const content = Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [];

  return content.map((item) => ({
    id: item.id,
    overlayId: item.overlayId,
    code: item.code,
    name: item.name,
    description: item.description ?? "",
    platform: normalizePlatform(item.platform),
    game: item.game ? { displayName: item.game } : null,
    thumbnailUrl: buildAssetUrl(item.thumbnailPath),
    author: {
      id: item.id,
      name: item.authorName ?? "Unknown",
    },
    elementTypes: item.elementTypes ?? [],
    isSaved: Boolean(item.isSaved),
    savedCount: item.savedCount ?? 0,
    updatedAt: formatRelativeDate(item.updatedAt),
  }));
}

function normalizePlatform(platform) {
  if (!platform) {
    return null;
  }

  const normalized = String(platform).toLowerCase();

  return {
    name: normalized === "windows" ? "Windows" : normalized === "android" ? "Android" : platform,
    slug: normalized,
  };
}

function buildAssetUrl(path) {
  if (!path) {
    return null;
  }

  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
  return new URL(path, baseUrl).toString();
}

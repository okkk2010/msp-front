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

const DEFAULT_GAME_PLATFORM = "windows";

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
    const gamePlatform = filters.platform || DEFAULT_GAME_PLATFORM;

    fetchGamesByPlatform(gamePlatform)
      .then((data) => {
        if (!active) {
          return;
        }

        setGames(normalizeGameItems(data));
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
        message: "Log in to save overlays to your library.",
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
        message: "Saved to your library.",
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
    <section className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-[var(--color-primary)]">Community overlays</p>
          <h1 className="text-3xl font-semibold">Find a layout that already works</h1>
          <p className="max-w-2xl text-sm leading-6 text-[var(--color-text-sub)]">
            Browse overlays shared by other players, compare preview quality, and save useful layouts before editing.
          </p>
        </div>
        <Button className="w-full lg:w-auto" onClick={() => navigate("/editor")}>
          Create Overlay
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm">
            <div className="space-y-4">
              <OverlaySearchBar
                onChange={(event) => setKeyword(event.target.value)}
                value={filters.keyword}
              />
              <OverlayCodeSearch
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                value={filters.code}
              />
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
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-main)]">
                {isLoading ? "Loading overlays" : `${items.length} overlays found`}
              </p>
              <p className="text-xs text-[var(--color-text-sub)]">
                Page {filters.page + 1} · {filters.size} per page
              </p>
            </div>
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
        </div>
      </div>
    </section>
  );
}

function normalizeGameItems(data) {
  const games = Array.isArray(data) ? data : [];

  return games
    .map((game) => ({
      id: game.id ?? game.slug ?? game.displayName,
      slug: game.slug ?? "",
      displayName: game.displayName ?? game.name ?? game.slug ?? "Unknown game",
      platform: game.platform ?? DEFAULT_GAME_PLATFORM,
    }))
    .filter((game) => game.slug || game.displayName);
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

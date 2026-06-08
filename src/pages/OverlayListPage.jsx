import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { fetchGamesByPlatform } from "../api/gameApi";
import { saveOverlayToLibrary } from "../api/libraryApi";
import { fetchOverlayList } from "../api/overlayApi";
import { Button } from "../components/common/Button";
import { PlatformTabs } from "../components/common/PlatformTabs";
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
  const [searchParams, setSearchParams] = useSearchParams();
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
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadNonce, setReloadNonce] = useState(0);

  useEffect(() => {
    const nextPlatform = normalizePlatformQuery(searchParams.get("platform")) ?? DEFAULT_GAME_PLATFORM;

    if (searchParams.get("platform") !== nextPlatform) {
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        next.set("platform", nextPlatform);
        return next;
      }, { replace: true });
    }

    if (filters.platform !== nextPlatform) {
      setPlatform(nextPlatform);
    }
  }, [filters.platform, searchParams, setPlatform, setSearchParams]);

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
        message: "라이브러리에 저장하려면 로그인해 주세요.",
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

  function handlePlatformChange(nextPlatform) {
    if (nextPlatform === filters.platform) {
      return;
    }

    setPlatform(nextPlatform);
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set("platform", nextPlatform);
      return next;
    });
  }

  function handleResetFilters() {
    resetFilters(filters.platform || DEFAULT_GAME_PLATFORM);
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-[var(--color-primary)]">커뮤니티 오버레이</p>
          <h1 className="text-3xl font-semibold">바로 쓸 수 있는 레이아웃을 찾아보세요</h1>
          <p className="max-w-2xl text-sm leading-6 text-[var(--color-text-sub)]">
            다른 플레이어가 공유한 오버레이를 둘러보고 미리보기 품질을 비교한 뒤, 편집 전에 유용한 레이아웃을 저장하세요.
          </p>
        </div>
        <Button className="w-full lg:w-auto" onClick={() => navigate("/editor")}>
          오버레이 만들기
        </Button>
      </div>
      <PlatformTabs value={filters.platform || DEFAULT_GAME_PLATFORM} onChange={handlePlatformChange} />

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
            onReset={handleResetFilters}
            onSortChange={setSort}
          />
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--color-text-main)]">
                {isLoading ? "오버레이 불러오는 중" : `오버레이 ${items.length}개 찾음`}
              </p>
              <p className="text-xs text-[var(--color-text-sub)]">
                {filters.page + 1}페이지 | 페이지당 {filters.size}개
              </p>
            </div>
            <Button onClick={handleResetFilters} variant="ghost">
              검색 초기화
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

function normalizePlatformQuery(value) {
  const normalized = String(value ?? "").toLowerCase();
  return normalized === "android" || normalized === "windows" ? normalized : null;
}

function normalizeGameItems(data) {
  const games = Array.isArray(data) ? data : [];

  return games
    .map((game) => ({
      id: game.id ?? game.slug ?? game.displayName,
      slug: game.slug ?? "",
      displayName: game.displayName ?? game.name ?? game.slug ?? "알 수 없는 게임",
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
      name: item.authorName ?? "알 수 없음",
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

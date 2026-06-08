import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { fetchLibraryItems } from "../api/libraryApi";
import { fetchGamesByPlatform } from "../api/gameApi";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { PlatformTabs } from "../components/common/PlatformTabs";
import { Select } from "../components/common/Select";
import { LibraryGrid } from "../components/library/LibraryGrid";
import { setLibraryItems } from "../store/libraryStore";
import { buildAssetUrl } from "../utils/assetUrl";
import { getApiErrorMessage } from "../utils/apiError";
import { formatRelativeDate } from "../utils/dateFormat";

const DEFAULT_LIBRARY_PLATFORM = "windows";

export function LibraryPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [games, setGames] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [platform, setPlatform] = useState(DEFAULT_LIBRARY_PLATFORM);
  const [game, setGame] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadNonce, setReloadNonce] = useState(0);

  useEffect(() => {
    const nextPlatform = normalizePlatformQuery(searchParams.get("platform")) ?? DEFAULT_LIBRARY_PLATFORM;

    if (searchParams.get("platform") !== nextPlatform) {
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        next.set("platform", nextPlatform);
        return next;
      }, { replace: true });
    }

    if (platform !== nextPlatform) {
      setPlatform(nextPlatform);
      setGame("");
    }
  }, [platform, searchParams, setSearchParams]);

  useEffect(() => {
    let active = true;

    fetchGamesByPlatform(platform)
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
  }, [platform]);

  useEffect(() => {
    let active = true;

    setIsLoading(true);
    setError("");

    fetchLibraryItems()
      .then((data) => {
        if (!active) {
          return;
        }

        const normalized = normalizeLibraryItems(data);
        setItems(normalized);
        setLibraryItems(normalized);
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
  }, [reloadNonce]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const overlay = item.overlay;
      const matchesKeyword =
        !keyword ||
        [overlay.name, overlay.description, overlay.author?.name]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(keyword.toLowerCase()));
      const matchesPlatform = !platform || overlay.platform?.slug === platform;
      const matchesGame =
        !game || overlay.game?.slug === game || overlay.game?.displayName?.toLowerCase() === game.toLowerCase();

      return matchesKeyword && matchesPlatform && matchesGame;
    });
  }, [game, items, keyword, platform]);

  function resetFilters() {
    setKeyword("");
    setGame("");
  }

  function handlePlatformChange(nextPlatform) {
    if (nextPlatform === platform) {
      return;
    }

    setPlatform(nextPlatform);
    setGame("");
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set("platform", nextPlatform);
      return next;
    });
  }

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">내 라이브러리</h1>
        <p className="text-sm text-[var(--color-text-sub)]">
          나중에 사용할 오버레이를 저장해 둔 공간입니다.
        </p>
      </div>
      <PlatformTabs value={platform} onChange={handlePlatformChange} />
      <div className="grid gap-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 lg:grid-cols-[minmax(0,1fr)_220px_auto]">
        <Input
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="저장한 오버레이 검색"
          value={keyword}
        />
        <Select onChange={(event) => setGame(event.target.value)} value={game}>
          <option value="">모든 게임</option>
          {games.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.displayName}
            </option>
          ))}
        </Select>
        <Button onClick={resetFilters} variant="secondary">
          초기화
        </Button>
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-[var(--color-text-sub)]">
          저장한 오버레이: {filteredItems.length}개
        </p>
        <Button onClick={() => navigate("/overlays")} variant="ghost">
          오버레이 탐색
        </Button>
      </div>
      <LibraryGrid
        error={error}
        isLoading={isLoading}
        items={filteredItems}
        onRetry={() => setReloadNonce((value) => value + 1)}
        onUseAsTemplate={(item) => navigate(`/editor/${item.overlay.overlayId}`)}
        onViewDetail={(item) => navigate(`/overlays/${item.overlay.overlayId}`)}
      />
    </section>
  );
}

function normalizeLibraryItems(data) {
  const items = Array.isArray(data) ? data : [];

  return items.map((item) => ({
    libraryId: item.libraryId,
    savedAt: item.savedAt,
    savedAtFormatted: formatRelativeDate(item.savedAt),
    overlay: {
      id: item.overlay.id,
      overlayId: item.overlay.overlayId,
      code: item.overlay.code,
      name: item.overlay.name,
      description: item.overlay.description ?? "",
      thumbnailUrl: buildAssetUrl(item.overlay.thumbnailPath),
      platform: normalizePlatform(item.overlay.platform),
      game: normalizeGame(item.overlay.game),
      author: {
        id: item.overlay.id,
        name: item.overlay.authorName ?? "알 수 없음",
      },
    },
  }));
}

function normalizePlatform(platform) {
  if (!platform) {
    return null;
  }

  const slug = String(platform).toLowerCase();

  return {
    name: slug === "windows" ? "Windows" : slug === "android" ? "Android" : platform,
    slug,
  };
}

function normalizeGame(game) {
  if (!game) {
    return null;
  }

  return {
    slug: String(game).toLowerCase(),
    displayName: game,
  };
}

function normalizePlatformQuery(value) {
  const normalized = String(value ?? "").toLowerCase();
  return normalized === "android" || normalized === "windows" ? normalized : null;
}

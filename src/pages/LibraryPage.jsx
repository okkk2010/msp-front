import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { fetchLibraryItems, saveOverlayToLibrary } from "../api/libraryApi";
import { fetchGamesByPlatform } from "../api/gameApi";
import { likeOverlay, unlikeOverlay } from "../api/likeApi";
import { fetchMyOverlays } from "../api/overlayApi";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { PlatformTabs } from "../components/common/PlatformTabs";
import { Select } from "../components/common/Select";
import { LibraryGrid } from "../components/library/LibraryGrid";
import { OverlayGrid } from "../components/overlay/OverlayGrid";
import { useToast } from "../hooks/useToast";
import { markOverlaySaved, setLibraryItems } from "../store/libraryStore";
import { buildAssetUrl } from "../utils/assetUrl";
import { getApiErrorMessage } from "../utils/apiError";
import { formatRelativeDate } from "../utils/dateFormat";

const DEFAULT_LIBRARY_PLATFORM = "windows";

const TABS = [
  { key: "saved", label: "저장한 오버레이" },
  { key: "mine", label: "내가 만든 오버레이" },
];

export function LibraryPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = normalizeTabQuery(searchParams.get("tab"));
  const [items, setItems] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [games, setGames] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [platform, setPlatform] = useState(DEFAULT_LIBRARY_PLATFORM);
  const [game, setGame] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMyLoading, setIsMyLoading] = useState(true);
  const [error, setError] = useState("");
  const [myError, setMyError] = useState("");
  const [reloadNonce, setReloadNonce] = useState(0);
  const [myReloadNonce, setMyReloadNonce] = useState(0);

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

  useEffect(() => {
    let active = true;

    setIsMyLoading(true);
    setMyError("");

    fetchMyOverlays()
      .then((data) => {
        if (!active) {
          return;
        }

        setMyItems(normalizeMyOverlays(data));
      })
      .catch((requestError) => {
        if (!active) {
          return;
        }

        setMyItems([]);
        setMyError(getApiErrorMessage(requestError));
      })
      .finally(() => {
        if (!active) {
          return;
        }

        setIsMyLoading(false);
      });

    return () => {
      active = false;
    };
  }, [myReloadNonce]);

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

  const filteredMyItems = useMemo(() => {
    return myItems.filter((overlay) => {
      const matchesKeyword =
        !keyword ||
        [overlay.name, overlay.description]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(keyword.toLowerCase()));
      const matchesPlatform = !platform || overlay.platform?.slug === platform;
      const matchesGame =
        !game || overlay.game?.slug === game || overlay.game?.displayName?.toLowerCase() === game.toLowerCase();

      return matchesKeyword && matchesPlatform && matchesGame;
    });
  }, [game, keyword, myItems, platform]);

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

  function handleTabChange(nextTab) {
    if (nextTab === tab) {
      return;
    }

    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (nextTab === "saved") {
        next.delete("tab");
      } else {
        next.set("tab", nextTab);
      }
      return next;
    });
  }

  async function handleLikeMine(item) {
    const nextLiked = !item.likedByMe;

    setMyItems((current) =>
      current.map((overlay) =>
        overlay.id === item.id
          ? {
              ...overlay,
              likedByMe: nextLiked,
              likeCount: Math.max(0, (overlay.likeCount ?? 0) + (nextLiked ? 1 : -1)),
            }
          : overlay,
      ),
    );

    try {
      if (nextLiked) {
        await likeOverlay(item.id);
      } else {
        await unlikeOverlay(item.id);
      }
    } catch (requestError) {
      setMyItems((current) =>
        current.map((overlay) =>
          overlay.id === item.id
            ? { ...overlay, likedByMe: item.likedByMe, likeCount: item.likeCount ?? 0 }
            : overlay,
        ),
      );
      showToast({
        message: getApiErrorMessage(requestError),
        type: "error",
      });
    }
  }

  async function handleSaveMine(item) {
    try {
      await saveOverlayToLibrary(item.id);
      markOverlaySaved(item.id);
      setMyItems((current) =>
        current.map((overlay) =>
          overlay.id === item.id
            ? { ...overlay, isSaved: true, savedCount: (overlay.savedCount ?? 0) + 1 }
            : overlay,
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
        <h1 className="text-3xl font-semibold">내 라이브러리</h1>
        <p className="text-sm text-[var(--color-text-sub)]">
          {tab === "mine"
            ? "내가 제작한 오버레이를 한곳에서 관리하세요."
            : "나중에 사용할 오버레이를 저장해 둔 공간입니다."}
        </p>
      </div>
      <div className="inline-flex gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] p-1">
        {TABS.map((item) => (
          <button
            key={item.key}
            className={[
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              tab === item.key
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "text-[var(--color-text-sub)] hover:text-[var(--color-text-main)]",
            ].join(" ")}
            onClick={() => handleTabChange(item.key)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
      <PlatformTabs value={platform} onChange={handlePlatformChange} />
      <div className="grid gap-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 lg:grid-cols-[minmax(0,1fr)_220px_auto]">
        <Input
          onChange={(event) => setKeyword(event.target.value)}
          placeholder={tab === "mine" ? "내 오버레이 검색" : "저장한 오버레이 검색"}
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
          {tab === "mine"
            ? `내가 만든 오버레이: ${filteredMyItems.length}개`
            : `저장한 오버레이: ${filteredItems.length}개`}
        </p>
        <Button onClick={() => navigate(tab === "mine" ? "/editor" : "/overlays")} variant="ghost">
          {tab === "mine" ? "오버레이 만들기" : "오버레이 탐색"}
        </Button>
      </div>
      {tab === "mine" ? (
        <OverlayGrid
          error={myError}
          isLoading={isMyLoading}
          items={filteredMyItems}
          onCardClick={(item) => navigate(`/overlays/${item.overlayId}`)}
          onLike={handleLikeMine}
          onRetry={() => setMyReloadNonce((value) => value + 1)}
          onSave={handleSaveMine}
        />
      ) : (
        <LibraryGrid
          error={error}
          isLoading={isLoading}
          items={filteredItems}
          onRetry={() => setReloadNonce((value) => value + 1)}
          onUseAsTemplate={(item) => navigate(`/editor/${item.overlay.overlayId}`)}
          onViewDetail={(item) => navigate(`/overlays/${item.overlay.overlayId}`)}
        />
      )}
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

function normalizeMyOverlays(data) {
  const content = Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [];

  return content.map((item) => ({
    id: item.id,
    overlayId: item.overlayId,
    code: item.code,
    name: item.name,
    description: item.description ?? "",
    platform: normalizePlatform(item.platform),
    game: normalizeGame(item.game),
    thumbnailUrl: buildAssetUrl(item.thumbnailPath),
    isSaved: Boolean(item.isSaved),
    savedCount: item.savedCount ?? 0,
    likeCount: item.likeCount ?? 0,
    likedByMe: Boolean(item.likedByMe),
    updatedAt: formatRelativeDate(item.updatedAt),
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

function normalizeTabQuery(value) {
  return value === "mine" ? "mine" : "saved";
}

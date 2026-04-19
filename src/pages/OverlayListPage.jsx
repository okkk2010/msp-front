import { OverlayCard } from "../components/overlay/OverlayCard";

export function OverlayListPage() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Overlay Discover</h1>
        <p className="text-sm text-[var(--color-text-sub)]">
          OverlayCard 기본형을 먼저 연결해 카드 레이아웃과 상태 표현을 확인할 수 있게 했습니다.
        </p>
      </div>
      <div className="grid gap-4">
        {MOCK_CARDS.map((item) => (
          <OverlayCard
            key={item.code}
            {...item}
            onClick={() => {}}
            onSave={() => {}}
          />
        ))}
      </div>
    </section>
  );
}

const MOCK_CARDS = [
  {
    name: "Combat Assist Overlay",
    description: "원형 범위와 선형 가이드가 포함된 전투 보조 오버레이 프리셋입니다.",
    code: "A1B2C3",
    platform: { name: "Windows" },
    game: { displayName: "Minecraft" },
    author: { name: "MSP Team" },
    elementTypes: ["Circle", "Line"],
    savedCount: 24,
    isSaved: false,
    updatedAt: "3 days ago",
  },
  {
    name: "Raid Marker Pack",
    description: "파티 포지셔닝을 빠르게 파악할 수 있게 도형 배치를 정리한 레이드용 프리셋입니다.",
    code: "Q7W8E9",
    platform: { name: "Windows" },
    game: { displayName: "Lost Ark" },
    author: { name: "OverlayLab" },
    elementTypes: ["Rect", "Circle", "Line"],
    savedCount: 63,
    isSaved: true,
    updatedAt: "1 day ago",
  },
];

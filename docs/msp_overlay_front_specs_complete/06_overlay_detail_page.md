# OverlayDetailPage UI Specification

## 1. 문서 목적

이 문서는 msp overlay의 OverlayDetailPage UI 구조를 정의한다.

상세 페이지는 사용자가 특정 오버레이를 확인하고, 라이브러리에 저장하거나 복제 편집할 수 있게 한다.

## 2. 페이지 목적

- 오버레이 상세 정보 확인
- 미리보기 확인
- 라이브러리 저장
- 이 오버레이를 기반으로 새 오버레이 제작
- Overlay JSON 요약 정보 확인

## 3. 전체 구조

```text
┌──────────────────────────────────────────────┐
│ Header                                       │
├──────────────────────────────────────────────┤
│ [Large Preview]                              │
├──────────────────────────────────────────────┤
│ Overlay Name                                 │
│ by Author                                    │
│ Description                                  │
│ [Save to Library] [Use as Template]          │
├──────────────────────────────────────────────┤
│ Metadata / JSON Summary                      │
└──────────────────────────────────────────────┘
```

## 4. 주요 영역

## 4.1 Preview Area

표시 내용:

- 썸네일 이미지
- 썸네일이 없으면 기본 Preview
- 이후 가능하면 JSON 기반 SVG Preview 표시

## 4.2 Basic Info

표시 정보:

```text
name
author
description
code
platform
game
createdAt
updatedAt
```

## 4.3 Action Buttons

| 버튼 | 동작 |
|---|---|
| Save to Library | `POST /api/library` |
| Saved | 이미 저장됨 표시 |
| Use as Template | `/editor/:id` 이동 |
| Download JSON | JSON 내보내기, 부가 기능 |
| Back to Discover | `/overlays` 이동 |

## 5. JSON Summary

표시 정보:

```text
schemaVersion
canvas.baseWidth
canvas.baseHeight
overlaySettings.opacity
elements.length
element type summary
meta.createdAt
meta.updatedAt
```

## 6. Element Summary

예시:

```text
Elements
- rect: 2
- circle: 1
- line: 3
```

## 7. API

```http
GET /api/overlays/{id}
```

응답 데이터는 메타데이터와 Overlay JSON 요약 정보를 포함해야 한다.

## 8. 비로그인 처리

비로그인 사용자가 Save to Library 클릭 시:

```text
로그인이 필요한 기능입니다.
```

Use as Template도 로그인 필요로 처리한다.

## 9. 복제 편집 정책

기존 오버레이는 원본을 직접 수정하지 않는다.

```text
Use as Template
 → 기존 Overlay JSON을 불러옴
 → 새 overlayId와 새 code로 복제 편집
 → 새 오버레이로 업로드
```

## 10. 완료 기준

- 상세 API를 호출한다.
- 메타데이터를 표시한다.
- JSON 요약 정보를 표시한다.
- 라이브러리 저장이 가능하다.
- Use as Template 버튼으로 Editor에 진입할 수 있다.
- 비로그인 상태에서 보호 기능을 안내한다.

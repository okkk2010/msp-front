# Frontend Implementation Order

## 1. 문서 목적

이 문서는 msp overlay Frontend 구현 순서를 정의한다.

## 2. 구현 전략

전체 구현은 다음 순서로 진행한다.

```text
기본 프로젝트 세팅
 → Layout / Routing
 → Discover / Detail
 → Editor 기본
 → JSON 변환
 → multipart 업로드
 → Auth / Library
 → UX 안정화
```

## 3. 1단계. 프로젝트 초기 세팅

작업:

- Vite React 프로젝트 생성
- Tailwind CSS v4 설정
- React Router 설정
- Axios 설치
- 기본 폴더 구조 생성
- Design Token 적용

완료 기준:

- 앱 실행 가능
- 기본 라우팅 가능
- Tailwind 적용 확인

## 4. 2단계. Layout / Header

작업:

- AppLayout
- Header
- Footer
- ProtectedRoute
- MobileDrawer

완료 기준:

- 전체 페이지에서 Header 표시
- 주요 메뉴 이동 가능

## 5. 3단계. Discover Page

작업:

- OverlayListPage
- OverlayCard
- OverlayFilterBar
- OverlaySearchBar
- CodeSearch
- 목록 API 연동

완료 기준:

- 오버레이 목록 표시
- 검색 / 필터 UI 표시
- 카드 클릭 시 상세 이동

## 6. 4단계. Detail Page

작업:

- OverlayDetailPage
- OverlayJsonSummary
- ElementSummary
- Save 버튼 UI
- Use as Template 버튼

완료 기준:

- 상세 데이터 표시
- JSON 요약 표시
- 복제 편집 진입 가능

## 7. 5단계. Editor 기본

작업:

- OverlayEditorPage
- OverlayCanvas
- EditorToolbar
- ElementPropertyPanel
- editorStore
- rect / circle / line 추가
- 요소 선택 / 이동 / 삭제

완료 기준:

- SVG Canvas 표시
- 도형 추가 가능
- 도형 선택 / 이동 가능
- 속성 수정 가능

## 8. 6단계. JSON 변환

작업:

- overlayJsonBuilder
- overlayJsonValidator
- JSON Export
- JSON Import

완료 기준:

- Editor State를 Overlay JSON으로 변환
- JSON 내보내기 가능
- JSON 가져오기 가능

## 9. 7단계. multipart 업로드

작업:

- UploadOverlayButton
- FormData 생성
- overlayJson Blob 생성
- POST /api/overlays 연동

완료 기준:

- Editor에서 만든 오버레이를 서버에 업로드 가능
- 성공 시 상세 페이지 이동

## 10. 8단계. Auth / Library

작업:

- Google Login Button
- authStore
- GET /api/auth/me
- ProtectedRoute
- POST /api/library
- GET /api/library
- LibraryPage

완료 기준:

- 로그인 상태 제어 가능
- 라이브러리 저장 가능
- 내 라이브러리 조회 가능

## 11. 9단계. UX 안정화

작업:

- Toast
- LoadingSpinner
- EmptyState
- ErrorMessage
- 반응형 정리
- Editor 모바일 안내

완료 기준:

- 로딩 / 빈 상태 / 에러 상태 존재
- 주요 화면이 Desktop에서 안정적으로 보임
- 모바일에서는 Discover / Detail / Library 사용 가능

## 12. 최종 완료 기준

- Discover 카드형 탐색 UI가 구현된다.
- Detail에서 저장 / 복제 편집 가능하다.
- Editor에서 SVG 기반 오버레이 제작 가능하다.
- Editor State를 Overlay JSON으로 변환한다.
- multipart/form-data로 서버 업로드 가능하다.
- JSON 가져오기 / 내보내기 가능하다.
- 라이브러리 조회 가능하다.

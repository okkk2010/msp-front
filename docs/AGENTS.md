# AGENTS.md - msp overlay Frontend Routing Guide

## 1. 목적

이 문서는 msp overlay Frontend 작업을 진행하는 AI Agent / 개발자가 가장 먼저 확인해야 하는 최상단 라우팅 문서다.

세부 구현 명세를 모두 담기보다는, 전체 시스템 흐름을 먼저 설명하고 특정 기능을 구현할 때 어떤 명세 파일을 참조해야 하는지 안내한다.

---

## 2. 현재 확정된 Frontend 방향

msp overlay Frontend의 핵심은 JSON 파일 업로드 사이트가 아니다.

```text
사용자
 → 웹 기반 Overlay Editor에서 레이아웃 생성
 → Frontend가 내부적으로 Overlay JSON 생성
 → Overlay JSON을 Blob으로 변환
 → FormData에 메타데이터, overlayJson, thumbnail을 담음
 → multipart/form-data로 Backend 업로드
 → Backend가 JSON 검증 및 DB/Storage 저장
 → Discover / Detail / Library에서 재사용
```

확정 사항:

| 항목 | 확정 내용 |
|---|---|
| UI 레퍼런스 | Modrinth Discover content 구조 참고 |
| 색상 | Modrinth 색상 복사 금지, 다크 배경 + Primary Color 1개 |
| Editor 방식 | SVG 기반 직접 구현 |
| 업로드 방식 | multipart/form-data |
| JSON 처리 | 사용자가 직접 다루는 파일이 아니라 시스템 내부 포맷 |
| JSON 가져오기/내보내기 | 부가 기능 |
| 기존 오버레이 편집 | 원본 수정이 아니라 복제 편집 |
| 6자리 코드 | 자동 생성 + 직접 수정 가능 |
| 모바일 | 조회 중심, Editor는 PC 우선 |
| 썸네일 | 1차 MVP 기본 썸네일, 이후 자동 생성 |

---

## 3. 전체 시스템 구조

```text
msp overlay
 ┣ Web Frontend
 ┃ ┣ Discover UI
 ┃ ┣ Overlay Detail UI
 ┃ ┣ Overlay Editor
 ┃ ┣ Library UI
 ┃ ┣ Auth UI
 ┃ ┗ Upload Flow
 ┣ Backend Server
 ┃ ┣ Auth API
 ┃ ┣ Overlay API
 ┃ ┣ Library API
 ┃ ┣ Platform API
 ┃ ┣ Game API
 ┃ ┗ JSON Validation
 ┣ Database
 ┃ ┣ users
 ┃ ┣ platforms
 ┃ ┣ games
 ┃ ┣ overlays
 ┃ ┗ user_libraries
 ┣ File Storage
 ┃ ┣ overlay.json
 ┃ ┗ thumbnail.png
 ┣ Windows Client
 ┗ Android Client
```

Frontend는 Backend API와 Overlay JSON 포맷을 기준으로 동작한다.

---

## 4. 작업 라우팅

### 프로젝트 초기 세팅

참조 파일:

1. `16_project_file_structure.md`
2. `17_implementation_order.md`
3. `01_design_system.md`
4. `14_auth_routes_access.md`

작업 내용:

- Vite React 프로젝트 생성
- Tailwind CSS v4 설정
- 라우터 구성
- 기본 Layout 구성
- Axios 인스턴스 구성
- 폴더 구조 생성

### UI 디자인 시스템

참조 파일:

1. `01_design_system.md`
2. `02_header_navigation.md`
3. `05_overlay_card_component.md`

작업 내용:

- 다크 테마 색상 정의
- Primary Color 정의
- 카드 / 버튼 / 입력창 / 배지 스타일 정의
- Header 네비게이션 구현

### Home Page

참조 파일:

1. `03_home_page.md`
2. `01_design_system.md`
3. `14_auth_routes_access.md`

### Discover / Overlay List

참조 파일:

1. `04_discover_overlay_list_page.md`
2. `05_overlay_card_component.md`
3. `15_api_contract_front.md`
4. `18_front_data_model.md`
5. `19_front_api_mapping.md`
6. `20_front_state_management.md`

작업 내용:

- 검색창
- 코드 검색
- 플랫폼 / 게임 필터
- 정렬
- OverlayCard 목록
- 로딩 / 에러 / 빈 상태
- GET `/api/overlays` 연동

### Overlay Detail

참조 파일:

1. `06_overlay_detail_page.md`
2. `18_front_data_model.md`
3. `19_front_api_mapping.md`
4. `20_front_state_management.md`

작업 내용:

- 상세 정보 조회
- JSON 요약 정보 표시
- Save to Library
- Use as Template
- GET `/api/overlays/{id}` 연동
- POST `/api/library` 연동

### Library

참조 파일:

1. `07_library_page.md`
2. `12_library_components_utils.md`
3. `18_front_data_model.md`
4. `19_front_api_mapping.md`
5. `20_front_state_management.md`

### Auth

참조 파일:

1. `14_auth_routes_access.md`
2. `19_front_api_mapping.md`
3. `20_front_state_management.md`

### Overlay Editor

참조 파일:

1. `08_editor_page_structure.md`
2. `09_editor_canvas_svg.md`
3. `10_editor_toolbar_panels.md`
4. `11_editor_state_json.md`
5. `18_front_data_model.md`
6. `20_front_state_management.md`
7. `21_editor_data_flow.md`

### Overlay JSON 변환 / 가져오기 / 내보내기

참조 파일:

1. `11_editor_state_json.md`
2. `13_json_import_export.md`
3. `18_front_data_model.md`
4. `21_editor_data_flow.md`

### 서버 업로드

참조 파일:

1. `12_upload_multipart.md`
2. `19_front_api_mapping.md`
3. `22_upload_formdata_mapping.md`
4. `21_editor_data_flow.md`

---

## 5. 파일별 역할 인덱스

| 파일 | 역할 |
|---|---|
| `AGENTS.md` | 전체 작업 라우팅 문서 |
| `00_system_ui_structure.md` | UI 관점의 전체 시스템 구조 |
| `01_design_system.md` | 색상, 버튼, 카드, 배지 등 디자인 시스템 |
| `02_header_navigation.md` | Header / Navigation 구조 |
| `03_home_page.md` | HomePage UI 명세 |
| `04_discover_overlay_list_page.md` | Discover / OverlayListPage UI 명세 |
| `05_overlay_card_component.md` | OverlayCard 컴포넌트 명세 |
| `06_overlay_detail_page.md` | OverlayDetailPage UI 명세 |
| `07_library_page.md` | LibraryPage UI 명세 |
| `08_editor_page_structure.md` | Editor 전체 화면 구조 |
| `09_editor_canvas_svg.md` | SVG Canvas 구현 명세 |
| `10_editor_toolbar_panels.md` | Toolbar / Property / Layer Panel 명세 |
| `11_editor_state_json.md` | Editor State와 Overlay JSON 관계 |
| `12_upload_multipart.md` | multipart/form-data 업로드 UI 중심 명세 |
| `13_json_import_export.md` | JSON 가져오기 / 내보내기 |
| `14_auth_routes_access.md` | 인증, 라우트 접근 제어 |
| `15_api_contract_front.md` | Front에서 사용하는 API 개요 |
| `16_project_file_structure.md` | React 프로젝트 폴더 구조 |
| `17_implementation_order.md` | 구현 순서 |
| `18_front_data_model.md` | Front 데이터 모델 / DTO 타입 |
| `19_front_api_mapping.md` | API 요청/응답 매핑 상세 |
| `20_front_state_management.md` | Zustand/Store 상태 관리 명세 |
| `21_editor_data_flow.md` | Editor 기능별 데이터 흐름 |
| `22_upload_formdata_mapping.md` | editorState → FormData 전송 규칙 |

---

## 6. 작업 원칙

1. UI만 보고 구현하지 말고 데이터 명세와 함께 확인한다.
2. Editor에서 생성되는 데이터는 항상 Overlay JSON 구조와 동기화되어야 한다.
3. 서버 업로드는 현재 Backend 구현에 맞춰 multipart/form-data를 사용한다.
4. 사용자가 JSON을 직접 업로드하는 흐름은 메인 기능이 아니다.
5. JSON 가져오기/내보내기는 고급 기능 또는 백업 기능으로 둔다.
6. 기존 오버레이를 수정할 때는 원본 수정이 아니라 복제 편집을 기본 정책으로 한다.
7. 모바일에서는 Discover / Detail / Library 중심으로 대응하고, Editor는 PC 우선으로 구현한다.

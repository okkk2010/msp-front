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

---

## 7. 권장 작업 진행 순서

아래 순서는 현재 확정된 Frontend 구조를 기준으로 한 실제 구현 우선순위다.  
Agent는 이 순서를 기본값으로 따르되, 사용자가 특정 기능을 명시하면 해당 기능 라우팅을 우선한다.

```text
1. 프로젝트 기반 세팅
2. 공통 UI / 디자인 시스템
3. 라우팅 / 레이아웃 / 인증 접근 제어
4. API 클라이언트 / 데이터 모델 / 상태 관리 골격
5. Discover 목록 페이지
6. Overlay 상세 페이지
7. Library 페이지
8. Editor 기본 화면 구조
9. SVG Canvas와 도형 렌더링
10. Editor 도형 조작 기능
11. Editor State → Overlay JSON 변환
12. JSON 가져오기 / 내보내기
13. multipart/form-data 업로드
14. 인증 연동과 보호 라우트 마감
15. UX 안정화 / 반응형 / 에러 처리
```

---

## 8. 단계별 작업 계획

### 1단계. 프로젝트 기반 세팅

참조 파일:

1. `16_project_file_structure.md`
2. `17_implementation_order.md`
3. `01_design_system.md`

작업 내용:

- Vite + React 프로젝트 생성
- Tailwind CSS v4 설정
- 기본 폴더 구조 생성
- 환경 변수 구조 생성
- ESLint / Prettier 적용 여부 확인
- 기본 실행 확인

완료 기준:

- `npm run dev`로 프로젝트가 정상 실행된다.
- 기본 페이지가 브라우저에 표시된다.
- Tailwind 클래스가 정상 적용된다.

---

### 2단계. 공통 UI / 디자인 시스템 구축

참조 파일:

1. `01_design_system.md`
2. `02_header_navigation.md`
3. `05_overlay_card_component.md`

작업 내용:

- 다크 테마 색상 변수 정의
- Primary Color 기준 버튼 스타일 정의
- 카드, 배지, 입력창, 셀렉트, 모달, 토스트 기본 컴포넌트 생성
- Header / Navigation 기본 UI 구현

완료 기준:

- 주요 공통 컴포넌트가 재사용 가능한 형태로 존재한다.
- Discover / Detail / Editor에서 동일한 색상과 컴포넌트 스타일을 사용할 수 있다.

---

### 3단계. 라우팅 / 레이아웃 / 접근 제어

참조 파일:

1. `02_header_navigation.md`
2. `14_auth_routes_access.md`
3. `16_project_file_structure.md`

작업 내용:

- React Router 구성
- `AppLayout` 생성
- `ProtectedRoute` 생성
- 주요 페이지 라우트 연결
- 비로그인 접근 제한 정책 적용

대상 라우트:

```text
/
/overlays
/overlays/:id
/editor
/editor/:id
/library
/login/callback
/not-found
```

완료 기준:

- 각 URL 접근 시 올바른 페이지 컴포넌트가 표시된다.
- `/editor`, `/library`는 로그인 필요 라우트로 분리된다.

---

### 4단계. API 클라이언트 / 데이터 모델 / 상태 관리 골격

참조 파일:

1. `18_front_data_model.md`
2. `19_front_api_mapping.md`
3. `20_front_state_management.md`
4. `15_api_contract_front.md`

작업 내용:

- Axios Instance 생성
- API 모듈 분리
- Front 데이터 타입 또는 JSDoc 구조 정리
- `authStore`, `overlayFilterStore`, `editorStore`, `toastStore` 생성
- 공통 에러 처리 기준 생성

완료 기준:

- API 호출 함수가 페이지 코드와 분리되어 있다.
- 목록, 상세, 라이브러리, 업로드에서 같은 API 레이어를 재사용할 수 있다.

---

### 5단계. Discover / Overlay List 구현

참조 파일:

1. `04_discover_overlay_list_page.md`
2. `05_overlay_card_component.md`
3. `18_front_data_model.md`
4. `19_front_api_mapping.md`
5. `20_front_state_management.md`

작업 내용:

- Discover 페이지 레이아웃 구현
- 검색창 구현
- 6자리 코드 검색 구현
- 플랫폼 / 게임 필터 구현
- 정렬 UI 구현
- OverlayCard 목록 구현
- 로딩 / 에러 / 빈 상태 처리
- `GET /api/overlays` 연동

완료 기준:

- 서버에서 받은 오버레이 목록이 카드 형태로 표시된다.
- 검색과 필터 값이 API Query Parameter로 연결된다.

---

### 6단계. Overlay Detail 구현

참조 파일:

1. `06_overlay_detail_page.md`
2. `18_front_data_model.md`
3. `19_front_api_mapping.md`
4. `13_json_import_export.md`

작업 내용:

- 상세 페이지 레이아웃 구현
- 오버레이 메타데이터 표시
- JSON 요약 정보 표시
- element 타입 요약 표시
- `Save to Library` 버튼 구현
- `Use as Template` 버튼 구현
- `GET /api/overlays/{id}` 연동
- `POST /api/library` 연동

완료 기준:

- 특정 오버레이 상세 정보를 확인할 수 있다.
- 저장 버튼과 복제 편집 진입 버튼이 동작한다.

---

### 7단계. Library 페이지 구현

참조 파일:

1. `07_library_page.md`
2. `12_library_components_utils.md`
3. `18_front_data_model.md`
4. `19_front_api_mapping.md`

작업 내용:

- 내 라이브러리 페이지 구현
- 저장한 OverlayCard 목록 표시
- 저장일 / 플랫폼 / 게임 정보 표시
- 상세 이동 구현
- 복제 편집 이동 구현
- `GET /api/library` 연동

완료 기준:

- 로그인 사용자가 저장한 오버레이를 조회할 수 있다.

---

### 8단계. Editor 기본 화면 구조 구현

참조 파일:

1. `08_editor_page_structure.md`
2. `10_editor_toolbar_panels.md`
3. `11_editor_state_json.md`
4. `20_front_state_management.md`

작업 내용:

- Editor 3단 레이아웃 구성
- 좌측 Toolbar 구현
- 중앙 Canvas 영역 구현
- 우측 Property Panel 구현
- Meta Panel 구현
- Bottom Action Bar 구현
- editorStore 초기 상태 연결

완료 기준:

- Editor 화면이 제작 도구 형태로 구성된다.
- 기본 메타 정보와 캔버스 정보가 상태로 관리된다.

---

### 9단계. SVG Canvas와 도형 렌더링

참조 파일:

1. `09_editor_canvas_svg.md`
2. `11_editor_state_json.md`
3. `21_editor_data_flow.md`

작업 내용:

- SVG Canvas 구현
- rect 렌더링
- circle 렌더링
- line 렌더링
- zIndex 기준 렌더링 순서 적용
- visible / locked 기본 처리
- 선택된 요소 표시

완료 기준:

- editorStore의 elements 배열이 SVG 화면에 정확히 표시된다.

---

### 10단계. Editor 도형 조작 기능 구현

참조 파일:

1. `09_editor_canvas_svg.md`
2. `10_editor_toolbar_panels.md`
3. `21_editor_data_flow.md`

작업 내용:

- 도형 추가
- 도형 선택
- 도형 이동
- 도형 삭제
- zIndex 앞으로 / 뒤로
- 속성 패널 값 수정
- 색상 / 투명도 / strokeWidth 수정

완료 기준:

- 사용자가 웹 에디터에서 기본 오버레이 레이아웃을 제작할 수 있다.

---

### 11단계. Editor State → Overlay JSON 변환

참조 파일:

1. `11_editor_state_json.md`
2. `18_front_data_model.md`
3. `21_editor_data_flow.md`

작업 내용:

- `overlayJsonBuilder` 구현
- `overlayJsonValidator` 구현
- `schemaVersion`, `overlayId`, `meta.createdAt`, `meta.updatedAt` 처리
- Editor 상태와 Overlay JSON 필드 매핑
- 업로드 전 JSON 검증

완료 기준:

- 에디터에서 만든 데이터가 확정된 Overlay JSON 구조로 변환된다.
- 잘못된 JSON 구조는 업로드 전에 차단된다.

---

### 12단계. JSON 가져오기 / 내보내기 구현

참조 파일:

1. `13_json_import_export.md`
2. `11_editor_state_json.md`
3. `21_editor_data_flow.md`

작업 내용:

- 현재 Editor 상태를 `overlay.json`으로 다운로드
- `overlay.json` 파일 선택
- FileReader로 JSON 파싱
- JSON 검증 후 Editor 상태 복원
- 잘못된 JSON 오류 표시

완료 기준:

- 사용자가 JSON을 백업하거나 기존 JSON을 에디터에 불러올 수 있다.
- 이 기능은 메인이 아니라 보조 기능으로 유지된다.

---

### 13단계. multipart/form-data 업로드 구현

참조 파일:

1. `12_upload_multipart.md`
2. `22_upload_formdata_mapping.md`
3. `19_front_api_mapping.md`
4. `21_editor_data_flow.md`

작업 내용:

- Editor 상태에서 Overlay JSON 생성
- Overlay JSON을 Blob으로 변환
- FormData 생성
- `name`, `description`, `code`, `platform`, `gameId`, `overlayJson`, `thumbnail` append
- `POST /api/overlays` 호출
- 업로드 성공 시 상세 페이지 이동
- 업로드 실패 시 에러 표시

완료 기준:

- 사용자가 JSON 파일을 직접 업로드하지 않아도, 에디터 결과가 서버에 multipart/form-data로 저장된다.

---

### 14단계. 인증 연동 마감

참조 파일:

1. `14_auth_routes_access.md`
2. `19_front_api_mapping.md`
3. `20_front_state_management.md`

작업 내용:

- Google 로그인 진입 버튼 연결
- 로그인 콜백 처리
- `GET /api/auth/me` 연결
- 로그인 상태 유지 정책 적용
- 로그아웃 처리
- 로그인 필요 기능 UX 정리

완료 기준:

- 로그인 사용자만 Editor / Library / Upload 기능을 사용할 수 있다.

---

### 15단계. UX 안정화 / 반응형 / 에러 처리

참조 파일:

1. `01_design_system.md`
2. `04_discover_overlay_list_page.md`
3. `08_editor_page_structure.md`
4. `14_auth_routes_access.md`

작업 내용:

- Toast 메시지 정리
- Loading 상태 정리
- Empty 상태 정리
- API 에러 코드별 메시지 정리
- Desktop / Tablet / Mobile 반응형 정리
- 모바일에서는 Editor 제한 안내

완료 기준:

- 사용자가 주요 기능을 진행할 때 막히는 지점마다 명확한 안내가 표시된다.
- Discover / Detail / Library는 모바일에서도 조회 가능하다.
- Editor는 PC 우선 정책에 맞게 동작한다.

---

## 9. Agent 작업 시 우선순위 규칙

1. 사용자가 특정 기능을 지시하지 않았다면 `7. 권장 작업 진행 순서`를 따른다.
2. 화면을 구현할 때는 UI 명세 파일과 데이터/API 명세 파일을 함께 확인한다.
3. Editor 관련 작업은 반드시 `11_editor_state_json.md`, `21_editor_data_flow.md`, `22_upload_formdata_mapping.md`를 함께 확인한다.
4. 업로드 작업은 `multipart/form-data` 기준을 변경하지 않는다.
5. JSON 직접 업로드를 메인 플로우로 만들지 않는다.
6. Modrinth 참고 구조는 Discover/List/Card 계열에만 적용하고, Editor에는 적용하지 않는다.
7. 구현 중 명세에 없는 필드를 임의로 추가하지 않는다. 필요한 경우 별도 TODO로 남긴다.

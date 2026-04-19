# JSON Import and Export Specification

## 1. 문서 목적

이 문서는 msp overlay Editor의 JSON 가져오기 / 내보내기 기능을 정의한다.

JSON은 메인 사용자 입력 방식이 아니라 내부 데이터 포맷이다.

다만 백업, 테스트, 고급 사용자 기능을 위해 가져오기 / 내보내기를 제공한다.

## 2. 기능 위치

JSON 가져오기 / 내보내기는 EditorPage의 Bottom Action Bar 또는 메뉴 안에 배치한다.

```text
[Import JSON]
[Export JSON]
```

## 3. JSON 내보내기

## 3.1 목적

현재 Editor State를 overlay.json 파일로 다운로드한다.

## 3.2 사용 목적

- 백업
- 다른 PC로 이동
- 로컬 보관
- 개발 테스트

## 3.3 동작 흐름

```text
Editor State
 → buildOverlayJson()
 → validateOverlayJson()
 → JSON.stringify()
 → Blob 생성
 → overlay.json 다운로드
```

## 3.4 파일명

권장:

```text
{overlayName}_overlay.json
```

공백은 `_`로 치환한다.

## 4. JSON 가져오기

## 4.1 목적

기존 overlay.json 파일을 Editor에 불러와 수정할 수 있게 한다.

## 4.2 동작 흐름

```text
파일 선택
 → FileReader로 읽기
 → JSON.parse
 → validateOverlayJson()
 → Editor State로 변환
 → Canvas에 표시
```

## 4.3 검증 실패 처리

표시 메시지:

```text
지원하지 않는 overlay.json 형식입니다.
누락된 필드 또는 잘못된 요소 타입을 확인해주세요.
```

오류 상세:

- 필수 필드 누락
- opacity 범위 오류
- 지원하지 않는 element type
- JSON parse 오류

## 5. JSON 직접 서버 업로드 정책

JSON 파일을 서버에 바로 업로드하는 플로우는 메인으로 두지 않는다.

확정 정책:

```text
JSON 가져오기
 → Editor에서 시각적으로 확인
 → 필요 시 수정
 → Editor 업로드 버튼으로 서버 업로드
```

## 6. 완료 기준

- Editor 상태를 JSON 파일로 내보낼 수 있다.
- overlay.json 파일을 가져와 Editor에 복원할 수 있다.
- 유효하지 않은 JSON은 업로드하지 않는다.
- 사용자는 JSON을 몰라도 기본 제작 흐름을 사용할 수 있다.

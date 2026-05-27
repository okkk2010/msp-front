# Task Summary

- Vercel 배포 후 로그인과 API 호출이 계속 실패하는 원인을 확인하고, `vercel.json`의 Vite 환경 변수 주입 위치를 수정했다.

# Scope

- Vercel 설정의 빌드 환경 변수 위치 수정
- API 도메인 DNS 및 TCP 연결 상태 확인
- 로그인 시작 URL 후보 확인
- 빌드 검증

# Changed Files

- `vercel.json`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-05-22_fix-vercel-build-env-and-check-api-domain.md`

# Verification Result

- `npm run build` 실행: 성공
- 로컬 빌드 산출물에서 `https://api.msp-overlay.store`가 주입됨을 확인했다.
- `Resolve-DnsName api.msp-overlay.store` 결과: `115.68.226.131`로 해석됨
- `Test-NetConnection api.msp-overlay.store -Port 443` 결과: `TcpTestSucceeded: False`
- `Test-NetConnection api.msp-overlay.store -Port 80` 결과: `TcpTestSucceeded: False`
- `Test-NetConnection api.msp-overlay.store -Port 8080` 결과: `TcpTestSucceeded: False`
- `Invoke-WebRequest`로 `/api/platforms`, `/api/auth/google`, `/oauth2/authorization/google` 확인 시 모두 원격 서버 연결 실패

# Decisions Made

- Vite 정적 앱은 빌드 시점에 `VITE_*` 값이 코드에 치환되므로 `vercel.json`의 `env`를 `build.env`로 이동했다.
- 로그인 URL은 기존 서버 계약으로 남아 있던 `https://api.msp-overlay.store/api/auth/google`를 유지했다.

# Issues

- API 도메인은 DNS가 해석되지만 80, 443, 8080 포트가 외부에서 열려 있지 않다.
- 현재 상태에서는 프론트 설정이 맞아도 브라우저가 서버에 연결할 수 없다.
- 서버가 HTTPS 443으로 서비스되지 않으면 Vercel HTTPS 페이지에서 API 호출과 OAuth 로그인이 정상 동작하기 어렵다.

# Next Steps

- iwin 서버 또는 방화벽에서 443 포트를 열고 HTTPS 리버스 프록시를 API 애플리케이션으로 연결한다.
- 서버 CORS 허용 Origin에 Vercel 프론트 도메인을 추가한다.
- 서버가 실제로 사용하는 Google OAuth 시작 경로가 `/api/auth/google`인지 `/oauth2/authorization/google`인지 확인한다.

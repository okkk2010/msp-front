# Task Summary

- Vercel 배포에서 프론트가 iwin 서버 API 도메인을 사용하도록 `vercel.json`을 추가했다.

# Scope

- Vercel 빌드 설정 추가
- Vite 공개 환경 변수로 API 서버 도메인과 Google 로그인 URL 지정
- React Router SPA 경로 새로고침 대응 rewrite 추가

# Changed Files

- `vercel.json`
- `docs/worklogs/_index.md`
- `docs/worklogs/2026-05-22_add-vercel-api-domain-config.md`

# Verification Result

- `npm run build` 실행: 성공
- Vercel 설정 파일에서 `VITE_API_BASE_URL`이 `https://api.msp-overlay.store`로 지정됨을 확인했다.
- Vercel 설정 파일에서 `VITE_GOOGLE_LOGIN_URL`이 `https://api.msp-overlay.store/api/auth/google`로 지정됨을 확인했다.

# Decisions Made

- API 도메인은 HTTPS 기준 `https://api.msp-overlay.store`를 사용했다.
- Vite 앱이므로 `outputDirectory`는 기존 빌드 산출물 경로인 `dist`로 지정했다.
- React Router 직접 접근과 새로고침을 위해 모든 경로를 `/index.html`로 rewrite했다.

# Issues

- 서버 CORS 설정은 프론트 저장소에서 확인할 수 없다. Vercel 프론트 도메인이 서버의 허용 Origin에 포함되어야 한다.

# Next Steps

- Vercel에 재배포한 뒤 브라우저 DevTools Network에서 요청 URL이 `https://api.msp-overlay.store/api/...`로 나가는지 확인한다.
- 서버에서 Vercel 프론트 도메인에 대한 CORS credentials 허용 여부를 확인한다.

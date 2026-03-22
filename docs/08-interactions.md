# Interactions & UX

## 개요
포트폴리오 전반에 걸친 인터랙션 및 UX 요소 정리.

## 파일
- `components/CustomCursor.tsx`
- `components/LoadingScreen.tsx`
- `components/MagneticButton.tsx`
- `components/TextReveal.tsx`

## 커스텀 커서
- 기본 커서 숨김
- 원형 커서 (큰 원 + 작은 점)
- `data-cursor-view` 속성 요소 위에서 확대
- `useSpring`으로 부드러운 추적
- 모바일에서는 비활성화

## 로딩 스크린
- 초기 로딩 시 표시
- "Creative / Developer / Portfolio" 텍스트 애니메이션
- 0% → 100% 프로그레스 바
- 완료 시 위로 슬라이드하며 사라짐
- `onComplete` 콜백으로 메인 콘텐츠 표시

## 스무스 스크롤
- **Lenis** 라이브러리 사용
- 설정:
  - `duration: 1.2`
  - `smoothWheel: true`
  - `touchMultiplier: 2`
- `data-lenis-prevent`: 특정 영역 스크롤 방지 (모달 등)
- `lenis-stopped`: 모달 오픈 시 배경 스크롤 차단

## 프로그레스 바
- 화면 최상단 가로 바
- 스크롤 진행도에 따라 좌→우 확장
- `useScroll` + `useSpring` 조합

## 텍스트 선택 방지
- `body`에 `user-select: none` 적용
- `input`, `textarea`는 선택 허용 (관리자 페이지)

## Noise Texture
- SVG 기반 fractal noise 패턴
- `opacity: 0.03` + `mix-blend-overlay`
- 프리미엄 질감 연출

## 반응형 디자인
| 요소 | 모바일 | 데스크톱 |
|------|--------|----------|
| 프로젝트 카드 | 1열 | 2열 |
| Hero 텍스트 | `13vw` | `15vw` |
| Video Reel | 1개씩 스와이프 | 3개씩 표시 |
| 관리자 패널 | 풀스크린 | 사이드 패널 |
| 커스텀 커서 | 숨김 | 표시 |
| 장식 요소 | 숨김 (`hidden md:block`) | 표시 |

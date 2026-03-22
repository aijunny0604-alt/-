# Hero Section

## 개요
포트폴리오 최상단의 풀스크린 인트로 섹션. 방문자에게 첫인상을 전달하는 핵심 영역.

## 파일
- `components/Hero.tsx`
- `constants.ts` → `HERO_TEXT`

## 구성 요소

### 타이포그래피 애니메이션
- "YEONG JUN" / "LEE" 글자가 하나씩 등장 (stagger animation)
- 각 글자에 hover 시 bounce 효과
- 두 번째 줄은 italic 스타일 + 반짝이는 shine 효과

### 패럴랙스 효과
- 스크롤 시 첫 번째 줄은 왼쪽, 두 번째 줄은 오른쪽으로 이동
- 전체 섹션이 축소 + blur 처리되며 사라짐
- `position: fixed`로 고정, 콘텐츠가 위로 덮음

### 마우스 반응형
- 마우스 위치에 따라 배경 gradient orb 이동
- 3개의 gradient orb (primary, secondary, accent)
- `useSpring`으로 부드러운 추적

### 장식 요소
- Floating particles (15개, 랜덤 위치/크기)
- 수평 reveal 라인 2개
- 대각선 장식 라인
- Noise texture overlay
- 스크롤 인디케이터 (애니메이션 바)

## 사용 기술
| 기술 | 용도 |
|------|------|
| `useScroll` / `useTransform` | 패럴랙스 스크롤 |
| `useMotionValue` / `useSpring` | 마우스 추적 |
| `motion.span` variants | 글자별 stagger 애니메이션 |
| CSS `mix-blend-mode` | 텍스트 블렌딩 |

## 커스터마이징
`constants.ts`에서 텍스트 변경:
```ts
export const HERO_TEXT = {
  line1: "YEONG JUN",
  line2: "LEE",
  sub: "순간을 포착하고..."
};
```

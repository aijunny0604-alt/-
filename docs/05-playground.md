# Playground Section

## 개요
실험적 작업물, 모션 그래픽 스터디, 일상 영감을 모아둔 아카이브 섹션. Masonry 레이아웃.

## 파일
- `App.tsx` (인라인 섹션)
- `components/Lightbox.tsx` - 풀스크린 이미지 뷰어
- `types.ts` → `PlaygroundItem`
- `constants.ts` → `PLAYGROUND_ITEMS`

## 데이터 구조
```ts
interface PlaygroundItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  caption?: string;
}
```

## 구성 요소

### Masonry 레이아웃
- CSS `columns-3` (데스크톱) / `columns-1` (모바일)
- `break-inside-avoid`로 카드 분리
- 이미지 원본 비율 유지 (`h-auto`)

### 이미지 효과
- 기본: 흑백 (grayscale)
- 호버 시: 컬러 전환 + scale 1.05 확대
- 캡션 오버레이 (호버 시 표시)

### 영상
- `<video>` 태그로 자동 재생 (muted, loop)
- 호버 시 흑백 → 컬러

### Lightbox
- 이미지 클릭 시 풀스크린 뷰어
- 좌우 화살표로 이미지 탐색
- 하단 썸네일 스트립
- 줌 인/아웃 기능
- ESC 키로 닫기

## 관리자 기능
- PLAY 탭에서 아이템 추가/삭제
- 이미지/영상 타입 선택
- URL 및 캡션 편집

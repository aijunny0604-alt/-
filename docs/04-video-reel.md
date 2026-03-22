# Video Reel Section

## 개요
YouTube 영상 포트폴리오를 가로 스크롤 캐러셀로 보여주는 섹션.

## 파일
- `components/VideoSection.tsx`
- `types.ts` → `VideoItem`
- `constants.ts` → `VIDEO_ITEMS`

## 데이터 구조
```ts
interface VideoItem {
  id: string;
  title: string;
  url: string; // YouTube URL
  description?: string;
}
```

## 구성 요소

### 가로 스크롤 캐러셀
- `overflow-x-auto` + `snap-x snap-mandatory`
- 스크롤바 숨김 (CSS `scrollbar-hide`)
- 반응형 카드 크기:
  - 모바일: `85vw` (1개씩)
  - 태블릿: `50% - 12px` (2개씩)
  - 데스크톱: `33.333% - 16px` (3개씩)

### 네비게이션
- 헤더 우측 `← →` 화살표 버튼 (데스크톱만)
- 카드 너비 + gap 만큼 스크롤
- `scrollBy` + `behavior: 'smooth'`

### 영상 카드
- YouTube 썸네일 자동 표시 (`maxresdefault.jpg`)
- 빨간 재생 버튼 오버레이
- 호버 시 썸네일 확대 + 밝기 변경
- 하단 gradient 오버레이

### 재생 모드
- 썸네일 클릭 → YouTube iframe 임베드로 전환
- `autoplay=1` 자동 재생
- X 버튼으로 재생 종료 → 썸네일 복귀

### YouTube URL 파싱
지원하는 URL 형식:
- `https://youtu.be/VIDEO_ID`
- `https://youtube.com/watch?v=VIDEO_ID`
- `https://youtube.com/embed/VIDEO_ID`
- `https://youtube.com/shorts/VIDEO_ID`

## 관리자 기능
- VIDEO 탭에서 영상 관리
- 제목, YouTube URL, 설명 편집
- 영상 추가/삭제
- URL 입력 시 썸네일 미리보기 자동 표시
- localStorage에 저장

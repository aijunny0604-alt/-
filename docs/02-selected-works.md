# Selected Works Section

## 개요
프로젝트 포트폴리오를 카드 형태로 보여주는 메인 섹션. 클릭 시 상세 페이지 오버레이.

## 파일
- `components/ProjectCard.tsx` - 프로젝트 카드
- `components/ProjectDetail.tsx` - 상세 페이지 오버레이
- `components/Lightbox.tsx` - 풀스크린 이미지 뷰어
- `types.ts` → `Project`, `ProjectMedia`
- `constants.ts` → `PROJECTS`

## 데이터 구조
```ts
interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  imagePosition?: string; // 이미지 포커스 위치 (예: '30% 50%')
  video?: string;
  year: string;
  description: string;
  gallery?: ProjectMedia[];
  tags?: string[];
}
```

## ProjectCard 기능

### 3D 틸트 효과
- 마우스 위치에 따라 카드가 3D 회전
- `transformPerspective: 1000` + `preserve-3d`
- shine 효과 오버레이

### 패럴랙스 이미지
- 스크롤 시 이미지가 컨테이너 내에서 수직 이동
- `h-[130%]` / `-top-[15%]`로 여유 공간 확보
- clip-path reveal 애니메이션

### 호버 효과
- 이미지 scale 1.08 확대
- 제목 italic 변환 + 수평 이동
- 카테고리 → 설명 텍스트 슬라이드
- "View Project" 플로팅 버튼 등장
- YouTube 영상 자동 재생 (호버 시)

### 이미지 포커스 위치
- `imagePosition` 속성으로 `object-position` 제어
- 관리자 페이지에서 이미지 클릭으로 설정

## ProjectDetail 기능
- 하단에서 올라오는 풀스크린 오버레이
- 좌상단 `← 돌아가기` 버튼 + 우상단 `X` 닫기 버튼
- 메인 미디어 (이미지 또는 YouTube 임베드)
- 갤러리: Video 섹션 / Stills 섹션 분리
- Stills 클릭 시 Lightbox 풀스크린 뷰어

## 레이아웃
- 2열 그리드 (데스크톱), 1열 (모바일)
- 홀수/짝수 인덱스에 따라 `md:mt-40` offset
- `rounded-t-[5rem]`으로 시트 메타포

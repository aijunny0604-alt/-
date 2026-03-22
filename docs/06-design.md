# Design Section

## 개요
포스터, 앨범 커버, 브랜드 아이덴티티 등 그래픽 디자인 작업물을 세로 카드로 보여주는 섹션.

## 파일
- `components/DesignSection.tsx`
- `types.ts` → `DesignItem`
- `constants.ts` → `DESIGN_ITEMS`

## 데이터 구조
```ts
interface DesignItem {
  id: string;
  title: string;
  category: string; // 'Poster Design', 'Album Cover', 'Branding' 등
  image: string;
  year: string;
  description?: string;
  tools?: string[]; // ['Photoshop', 'Illustrator', 'Figma']
}
```

## 구성 요소

### 헤더
- "Visual Identity" 타이틀
- 펜 아이콘 + "Design Works" 레이블
- 서브 텍스트: "포스터, 앨범 커버, 브랜딩 등 시각적 아이덴티티를 창조합니다."

### 카드 레이아웃
- 가로 스크롤 (`overflow-x-auto`)
- 세로형 카드 (`aspect-[3/4]`)
- 어두운 카드 배경 (`bg-neutral-900`)

### 호버 효과
- 이미지 확대 + 어둡게
- 카테고리, 제목, 연도 정보 오버레이 등장
- 부드러운 전환 애니메이션

### 디자인 상세
- 카드 클릭 시 상세 모달 (선택 기능)
- 카테고리별 분류
- 사용 도구 태그 표시

## 관리자 기능
- DESIGN 탭에서 작업물 관리
- 제목, 카테고리, 연도, 설명, 도구 편집
- 이미지 업로드 또는 갤러리에서 선택
- 순서 변경 (위/아래 이동)
- 추가/삭제

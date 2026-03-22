# Honor Section

## 개요
수상 내역을 전시회 스타일로 보여주는 섹션. 어두운 배경에 영상과 텍스트 조합.

## 파일
- `App.tsx` (인라인 섹션)
- `types.ts` → `Award`
- `constants.ts` → `AWARDS`

## 데이터 구조
```ts
interface Award {
  year: string;
  title: string;
  organization: string;
  result: string;
  video?: string;
  description?: string;
}
```

## 구성 요소

### 레이아웃
- 어두운 배경 (`bg-neutral-900`)
- 2열 레이아웃: 영상 65% + 텍스트 35%
- 모바일에서는 세로 스택

### 영상 표시
- YouTube URL 자동 감지 → iframe 임베드
- 로컬 영상 → `<video>` 태그
- 자동 재생 (muted, loop)
- 좌상단 수상 결과 배지 (`우수상`)

### 텍스트 영역
- 연도/주관 기관 (pill badge)
- 수상 제목 (대형 serif 폰트)
- 골드 구분선
- 설명 텍스트

### 애니메이션
- `whileInView` 등장 애니메이션
- 영상: 아래에서 위로 (`y: 50 → 0`)
- 텍스트: 오른쪽에서 왼쪽으로 (`x: 50 → 0`)

## 관리자 기능
- HONORS 탭에서 수상 내역 추가/수정/삭제
- 영상 URL 변경 가능

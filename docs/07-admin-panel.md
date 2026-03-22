# Admin Panel

## 개요
포트폴리오 콘텐츠를 실시간으로 관리하는 관리자 패널. 코드 수정 없이 프로젝트, 수상, 영상 등을 관리.

## 파일
- `components/AdminModal.tsx`
- `components/ImagePicker.tsx`
- `components/ChatWidget.tsx` (비밀 명령어 처리)

## 접근 방법
채팅 위젯에서 다음 명령어 입력:
- `/영준`
- `/관리자`

또는 좌하단 톱니바퀴 아이콘 클릭.

## 탭 구성

### WORKS (프로젝트)
- 좌측: 프로젝트 목록 (선택식)
- 우측: 선택된 프로젝트 편집
- 편집 가능 항목:
  - 제목, 카테고리, 연도, 설명
  - 메인 이미지 (URL 직접 입력 / 갤러리 선택 / 파일 업로드)
  - **이미지 포커스 위치** (이미지 클릭으로 설정, 빨간 점 표시)
  - 호버 영상 (YouTube URL 또는 MP4)
  - 갤러리: Motion(영상) / Stills(이미지) 분리 관리
- 프로젝트 추가/삭제

### HONORS (수상 내역)
- 연도, 제목, 주관 기관, 수상 결과
- 영상 URL, 설명
- 추가/삭제

### PLAY (Playground)
- 이미지/영상 타입 선택
- URL, 캡션 편집
- 아이템 추가/삭제

### DESIGN (디자인)
- 2열 카드 그리드 편집
- 제목, 카테고리(드롭다운), 연도, 설명
- 사용 도구 (쉼표 구분)
- 이미지 업로드/선택
- 순서 변경 (위/아래 버튼)

### VIDEO (영상)
- YouTube URL만 입력하면 썸네일 자동 표시
- 제목, URL, 설명 편집
- 영상 추가/삭제

## 저장 방식
- **localStorage** 기반
- 저장 버튼 클릭 시 모든 탭 데이터 일괄 저장
- 키 목록:
  - `portfolio_projects`
  - `portfolio_awards`
  - `portfolio_playground`
  - `portfolio_design`
  - `portfolio_videos`

## 초기화
- `초기화` 버튼 클릭 시 `constants.ts` 기본값으로 리셋
- localStorage 데이터 삭제

## 이미지 포커스 위치 조절
- 메인 이미지 미리보기에서 직접 클릭
- 클릭 좌표를 `object-position` 퍼센트 값으로 변환
- 빨간 원 인디케이터로 현재 포커스 위치 표시
- "중앙으로 초기화" 버튼 제공
- ProjectCard, ProjectDetail 양쪽에 반영

## ImagePicker
- `public/images/` 내 이미지 갤러리
- 현재 선택된 이미지 하이라이트
- 클릭으로 선택 후 적용

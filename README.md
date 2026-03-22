# YEONGJUN Portfolio

AI 아티스트 이영준의 포트폴리오 웹사이트

**Live**: https://aijunny0604-alt.github.io/yeongjun-portfolio/

## Features

### Sections
- **Hero** - 인터랙티브 타이포그래피 애니메이션, 마우스 반응형 효과
- **Selected Works** - 포토그래피, 제품 촬영, 영상 편집, AI 아트워크 프로젝트
- **Honor** - 매경미디어 AI 영상 광고 공모전 우수상
- **Video Reel** - YouTube 영상 포트폴리오 (가로 스크롤 캐러셀)
- **Playground** - 실험적 작업물 아카이브
- **Design** - 포스터, 앨범 커버, 브랜드 아이덴티티
- **About** - SNS 링크 (Instagram, YouTube, Flickr)

### Admin Panel
채팅 위젯에서 `/영준` 또는 `/관리자` 입력으로 접근

- **WORKS** - 프로젝트 추가/수정/삭제, 이미지 포커스 위치 조절
- **HONORS** - 수상 내역 관리
- **PLAY** - Playground 아이템 관리
- **DESIGN** - 디자인 작업물 관리
- **VIDEO** - YouTube 영상 추가/수정/삭제

모든 변경사항은 localStorage에 저장되어 브라우저에서 유지됩니다.

### Interactions
- 3D 틸트 효과 (프로젝트 카드)
- 패럴랙스 스크롤
- 커스텀 커서
- Framer Motion 애니메이션
- Lenis 스무스 스크롤
- 풀스크린 라이트박스

## Tech Stack

| Category | Tech |
|----------|------|
| Framework | React 19 |
| Language | TypeScript |
| Build | Vite |
| Animation | Framer Motion |
| Scroll | Lenis |
| Icons | Lucide React |
| AI Chat | Google Gemini API |
| Styling | Tailwind CSS |
| Deploy | GitHub Pages |

## Development

```bash
# Install
npm install

# Dev server
npm run dev

# Build
npm run build
```

## Deployment

GitHub Pages에 자동 배포 (`.github/workflows/deploy.yml`)

`main` 브랜치에 push하면 자동으로 빌드 및 배포됩니다.

## Contact

- Instagram: [@d_concepts2](https://www.instagram.com/d_concepts2/)
- YouTube: [@dconcepts7777](https://www.youtube.com/@dconcepts7777)
- Flickr: [200364842@N07](https://www.flickr.com/photos/200364842@N07/)
- Email: lyjcg0604@naver.com

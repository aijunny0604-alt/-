# Tech Stack & Architecture

## 프로젝트 구조
```
yeongjun-portfolio/
├── App.tsx                  # 메인 앱 컴포넌트 (라우팅, 상태 관리)
├── index.tsx                # 엔트리 포인트
├── index.html               # HTML 템플릿 + Tailwind 설정
├── types.ts                 # TypeScript 인터페이스 정의
├── constants.ts             # 기본 데이터 (프로젝트, 수상, 영상 등)
├── vite.config.ts           # Vite 빌드 설정
├── tsconfig.json            # TypeScript 설정
├── metadata.json            # 앱 메타데이터
├── components/
│   ├── Hero.tsx             # Hero 섹션
│   ├── ProjectCard.tsx      # 프로젝트 카드
│   ├── ProjectDetail.tsx    # 프로젝트 상세 오버레이
│   ├── VideoSection.tsx     # Video Reel 캐러셀
│   ├── DesignSection.tsx    # 디자인 포트폴리오
│   ├── AdminModal.tsx       # 관리자 패널
│   ├── ImagePicker.tsx      # 이미지 갤러리 선택기
│   ├── ChatWidget.tsx       # AI 채팅 위젯
│   ├── Lightbox.tsx         # 풀스크린 이미지 뷰어
│   ├── CustomCursor.tsx     # 커스텀 커서
│   ├── LoadingScreen.tsx    # 로딩 화면
│   ├── MagneticButton.tsx   # 마그네틱 버튼
│   └── TextReveal.tsx       # 텍스트 reveal 애니메이션
├── services/
│   └── geminiService.ts     # Google Gemini API 연동
├── public/
│   └── images/              # 포트폴리오 이미지 (23장)
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Pages 배포 워크플로우
└── docs/                    # 프로젝트 문서
```

## 기술 스택

### Core
| 기술 | 버전 | 용도 |
|------|------|------|
| React | 19.2.3 | UI 프레임워크 |
| TypeScript | 5.8.2 | 타입 안전성 |
| Vite | 6.2.0 | 번들러 & 개발 서버 |

### UI & Animation
| 기술 | 버전 | 용도 |
|------|------|------|
| Framer Motion | 12.29.0 | 애니메이션 (scroll, hover, 전환) |
| Lenis | 1.3.17 | 스무스 스크롤 |
| Lucide React | 0.563.0 | 아이콘 |
| Tailwind CSS | CDN | 유틸리티 CSS |

### API
| 기술 | 용도 |
|------|------|
| Google Gemini API | AI 채팅 위젯 |

### 배포
| 기술 | 용도 |
|------|------|
| GitHub Pages | 정적 호스팅 |
| GitHub Actions | CI/CD 자동 배포 |

## 상태 관리
- **React useState** - 로컬 컴포넌트 상태
- **localStorage** - 관리자 패널 데이터 영속화
- **Props drilling** - 부모 → 자식 데이터 전달

### localStorage 키
| 키 | 데이터 |
|-----|--------|
| `portfolio_projects` | 프로젝트 목록 |
| `portfolio_awards` | 수상 내역 |
| `portfolio_playground` | Playground 아이템 |
| `portfolio_design` | 디자인 작업물 |
| `portfolio_videos` | YouTube 영상 |

## 빌드 설정 (vite.config.ts)
- `base`: 프로덕션 → `/yeongjun-portfolio/`, 개발 → `/`
- Gemini API 키: 환경변수에서 주입
- 경로 별칭: `@` → 프로젝트 루트

## 폰트
- **Inter** (sans-serif) - 본문, UI
- **Playfair Display** (serif) - 제목, 강조
- Google Fonts CDN으로 로드

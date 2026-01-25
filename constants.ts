import { Project, Award, PlaygroundItem } from './types';

export const HERO_TEXT = {
  line1: "JIWOO",
  line2: "PARK",
  sub: "서울을 기반으로 활동하는 크리에이티브 개발자입니다. 심미성과 기능성을 결합하여 기억에 남는 디지털 경험을 만듭니다."
};

// [안내] 내 사진과 영상을 올리는 방법:
// 1. 프로젝트 폴더 내 'public' 등의 폴더에 이미지/영상을 넣으세요.
// 2. 아래 image: 부분의 주소를 내 파일 경로(예: '/images/my-work.jpg')로 수정하세요.
// 3. 또는 구글 드라이브나 클라우드에 있는 'https://...' 형태의 웹 주소를 그대로 넣어도 됩니다.

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Ethereal Commerce',
    category: '웹 디자인 & 개발',
    year: '2024',
    // [수정] 메인 썸네일 이미지 경로
    image: 'https://picsum.photos/800/600?random=1',
    // [수정] 마우스 오버 시 재생될 영상 경로 (영상이 없으면 이 줄을 지우거나 undefined로 두세요)
    video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    description: '부드러운 화면 전환과 마이크로 인터랙션에 중점을 둔 헤드리스 쇼피파이(Headless Shopify) 커머스 사이트입니다.',
    tags: ['React', 'Shopify Storefront API', 'WebGL', 'GSAP'],
    // [수정] 상세 페이지 갤러리 (type을 'image' 또는 'video'로 지정하고 url을 넣으세요)
    gallery: [
      { type: 'image', url: 'https://picsum.photos/800/600?random=10' },
      { type: 'video', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' },
      { type: 'image', url: 'https://picsum.photos/800/800?random=11' },
      { type: 'image', url: 'https://picsum.photos/800/500?random=12' }
    ]
  },
  {
    id: '2',
    title: 'Lumina Branding',
    category: '브랜드 아이덴티티',
    year: '2023',
    image: 'https://picsum.photos/800/800?random=2', 
    video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    description: '친환경 조명 스타트업을 위한 전체적인 비주얼 아이덴티티 리뉴얼 프로젝트입니다.',
    tags: ['Brand Strategy', 'Typography', '3D Rendering'],
    gallery: [
      { type: 'image', url: 'https://picsum.photos/800/800?random=20' },
      { type: 'image', url: 'https://picsum.photos/800/1200?random=21' },
      { type: 'video', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4' }
    ]
  },
  {
    id: '3',
    title: 'Kinetic Type',
    category: '모션 그래픽',
    year: '2023',
    image: 'https://picsum.photos/600/800?random=3',
    // video 속성이 없으면 이미지만 확대되는 인터랙션이 적용됩니다.
    description: '3D 공간에서의 가독성을 탐구한 실험적인 타이포그래피 프로젝트입니다.',
    tags: ['After Effects', 'Cinema 4D', 'p5.js'],
    gallery: [
      { type: 'image', url: 'https://picsum.photos/600/800?random=30' },
      { type: 'video', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
      { type: 'image', url: 'https://picsum.photos/600/400?random=31' }
    ]
  },
  {
    id: '4',
    title: 'Orbit Dashboard',
    category: '프로덕트 디자인',
    year: '2024',
    image: 'https://picsum.photos/800/500?random=4',
    video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    description: '위성 추적 시스템을 위한 데이터 시각화 대시보드 플랫폼입니다.',
    tags: ['Figma', 'React', 'D3.js', 'Tailwind CSS'],
    gallery: [
      { type: 'image', url: 'https://picsum.photos/800/500?random=40' },
      { type: 'image', url: 'https://picsum.photos/800/500?random=41' },
      { type: 'video', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4' }
    ]
  }
];

export const AWARDS: Award[] = [
  {
    year: '2024',
    title: 'Generative AI Innovation Challenge',
    organization: 'Samsung Electronics',
    result: 'Grand Prize (대상)',
    // [수정] 수상작 영상 경로를 여기에 입력하세요.
    video: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    description: '생성형 AI 모델을 활용하여 사용자의 감정을 실시간으로 시각화하는 인터랙티브 아트워크입니다. 기술적 혁신성과 예술적 표현력의 조화를 높이 평가받아 대상을 수상했습니다.'
  }
];

// [추가] Playground (아카이브) 데이터
export const PLAYGROUND_ITEMS: PlaygroundItem[] = [
  { id: '1', type: 'image', url: 'https://picsum.photos/600/800?random=100', caption: 'Daily Render 001' },
  { id: '2', type: 'image', url: 'https://picsum.photos/800/600?random=101', caption: 'UI Concept' },
  { id: '3', type: 'video', url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', caption: 'Motion Study' },
  { id: '4', type: 'image', url: 'https://picsum.photos/600/600?random=102', caption: 'Texture Experiment' },
  { id: '5', type: 'image', url: 'https://picsum.photos/800/1000?random=103', caption: 'Poster Design' },
];

export const ABOUT_TEXT = `
  저는 미니멀리즘과 인터랙티브 디자인에 열정을 가진 크리에이티브 개발자입니다. 
  좋은 디자인이란 보이지 않으면서도 자연스럽게 작동하는 것이라고 믿습니다. 
  기술적 정교함과 예술적 감각을 결합하여 사용자에게 오래 기억될 수 있는 디지털 서사를 만들어냅니다.
`;

export const SOCIAL_LINKS = [
  { name: 'Instagram', url: '#' },
  { name: 'LinkedIn', url: '#' },
  { name: 'Twitter', url: '#' },
  { name: 'GitHub', url: '#' },
];
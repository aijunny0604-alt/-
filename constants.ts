import { Project, Award, PlaygroundItem, DesignItem } from './types';

export const HERO_TEXT = {
  line1: "YEONG JUN",
  line2: "LEE",
  sub: "순간을 포착하고, 감동을 편집합니다. 사진과 영상으로 당신의 이야기를 전달하는 크리에이터입니다."
};

// [안내] 내 사진과 영상을 올리는 방법:
// 1. 아래 image: 부분에 Flickr, YouTube 등의 URL을 직접 입력하세요.
// 2. 또는 public/images 폴더에 파일을 넣고 '/images/파일명.jpg' 형태로 입력하세요.

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Dynamic Moments',
    category: '포토그래피',
    year: '2024',
    image: 'https://picsum.photos/800/600?random=1',  // [TODO] 드리프트 사진 URL
    // video: '',  // 호버 시 재생할 영상 (선택사항)
    description: '속도와 역동성을 담은 자동차 포토그래피. 드리프트의 긴장감과 아드레날린을 한 장의 사진에 담았습니다.',
    tags: ['Automotive', 'Action', 'Drift', 'Sports'],
    gallery: [
      // [TODO] 갤러리 이미지/영상 URL 추가
      { type: 'image', url: 'https://picsum.photos/800/600?random=10' },
      { type: 'image', url: 'https://picsum.photos/800/800?random=11' },
      { type: 'image', url: 'https://picsum.photos/800/500?random=12' }
    ]
  },
  {
    id: '2',
    title: 'Product Showcase',
    category: '제품 촬영',
    year: '2024',
    image: 'https://picsum.photos/800/800?random=2',  // [TODO] 제품 사진 URL
    description: '제품의 디테일과 질감을 극대화하는 상업 사진. 자동차 파츠부터 다양한 제품까지, 판매를 이끄는 이미지를 만듭니다.',
    tags: ['Commercial', 'Product', 'Lighting', 'Detail'],
    gallery: [
      // [TODO] 갤러리 이미지 URL 추가
      { type: 'image', url: 'https://picsum.photos/800/800?random=20' },
      { type: 'image', url: 'https://picsum.photos/800/600?random=21' },
      { type: 'image', url: 'https://picsum.photos/600/800?random=22' }
    ]
  },
  {
    id: '3',
    title: 'Cinematic Films',
    category: '영상 편집',
    year: '2024',
    image: 'https://picsum.photos/800/500?random=3',  // [TODO] 영상 썸네일 URL
    // video: '',  // [TODO] YouTube URL 또는 영상 파일
    description: '자동차의 역동적인 움직임부터 웨딩의 감동적인 순간까지. 다양한 장르를 아우르는 시네마틱 영상 편집.',
    tags: ['Cinematic', 'Wedding', 'Automotive', 'Color Grading'],
    gallery: [
      // [TODO] YouTube 영상이나 이미지 URL 추가
      { type: 'video', url: 'https://www.youtube.com/watch?v=YOUR_VIDEO_ID' },
      { type: 'image', url: 'https://picsum.photos/800/450?random=30' },
      { type: 'image', url: 'https://picsum.photos/800/450?random=31' }
    ]
  },
  {
    id: '4',
    title: 'AI Creations',
    category: 'AI 아트워크',
    year: '2024',
    image: 'https://picsum.photos/800/800?random=4',  // [TODO] AI 이미지 URL
    description: 'AI 기술을 활용한 창의적인 이미지 생성. 상상력의 한계를 넘어서는 새로운 비주얼 아트.',
    tags: ['AI Art', 'Generative', 'Creative', 'Digital Art'],
    gallery: [
      // [TODO] AI 생성 이미지 URL 추가
      { type: 'image', url: 'https://picsum.photos/800/800?random=40' },
      { type: 'image', url: 'https://picsum.photos/600/800?random=41' },
      { type: 'image', url: 'https://picsum.photos/800/600?random=42' }
    ]
  }
];

export const AWARDS: Award[] = [
  {
    year: '2024',
    title: '매경미디어 AI 영상 광고·숏폼 공모전',
    organization: '매일경제',
    result: '우수상',
    video: 'https://youtu.be/m-AkFwNKQ0g',
    description: 'AI 기술을 활용하여 제작한 영상 광고로 우수상을 수상했습니다. 창의적인 스토리텔링과 AI 영상 편집 기술의 조화를 높이 평가받았습니다.'
  }
];

export const PLAYGROUND_ITEMS: PlaygroundItem[] = [
  // [TODO] 추가 작업물이나 실험적인 이미지들
  { id: '1', type: 'image', url: 'https://picsum.photos/600/800?random=100', caption: 'Behind the Scenes' },
  { id: '2', type: 'image', url: 'https://picsum.photos/800/600?random=101', caption: 'Test Shot' },
  { id: '3', type: 'image', url: 'https://picsum.photos/600/600?random=102', caption: 'Color Study' },
];

// 디자인 포트폴리오 (포스터, 앨범커버, 브랜딩 등)
export const DESIGN_ITEMS: DesignItem[] = [
  {
    id: '1',
    title: 'Event Poster',
    category: 'Poster Design',
    year: '2024',
    image: 'https://picsum.photos/600/800?random=200',
    description: '이벤트를 위한 시선을 사로잡는 포스터 디자인',
    tools: ['Photoshop', 'Illustrator']
  },
  {
    id: '2',
    title: 'Album Artwork',
    category: 'Album Cover',
    year: '2024',
    image: 'https://picsum.photos/600/600?random=201',
    description: '음악의 분위기를 시각적으로 표현한 앨범 커버',
    tools: ['Photoshop', 'Cinema 4D']
  },
  {
    id: '3',
    title: 'Brand Identity',
    category: 'Branding',
    year: '2024',
    image: 'https://picsum.photos/600/800?random=202',
    description: '브랜드의 핵심 가치를 담은 아이덴티티 디자인',
    tools: ['Illustrator', 'Figma']
  }
];

export const ABOUT_TEXT = `
  순간의 감정과 움직임을 포착하는 포토그래퍼이자 영상 에디터입니다.
  자동차의 역동적인 순간부터 웨딩의 감동적인 장면까지,
  다양한 장르를 넘나들며 당신만의 이야기를 만들어드립니다.
`;

export const SOCIAL_LINKS = [
  { name: 'Instagram', url: '#' },
  { name: 'YouTube', url: '#' },
  { name: 'Flickr', url: '#' },
  { name: 'Contact', url: '#' },
];

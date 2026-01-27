import { Project, Award, PlaygroundItem, DesignItem } from './types';

export const HERO_TEXT = {
  line1: "YEONG JUN",
  line2: "LEE",
  sub: "순간을 포착하고, 감동을 편집합니다. 사진과 영상으로 당신의 이야기를 전달하는 크리에이터입니다."
};

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Dynamic Moments',
    category: '포토그래피',
    year: '2024',
    image: '/images/53786435527_17433df4d8_b.jpg',
    description: '속도와 역동성을 담은 자동차 포토그래피. 드리프트의 긴장감과 아드레날린을 한 장의 사진에 담았습니다.',
    tags: ['Automotive', 'Action', 'Drift', 'Sports'],
    gallery: [
      { type: 'image', url: '/images/53786435532_71a623a182_b.jpg' },
      { type: 'image', url: '/images/53787388841_ac27535c43_b.jpg' },
      { type: 'image', url: '/images/53879429516_f2c37d8997_b.jpg' },
      { type: 'image', url: '/images/53879842125_e8e6af958c_b.jpg' },
      { type: 'image', url: '/images/53911971263_457184d4c0_b.jpg' }
    ]
  },
  {
    id: '2',
    title: 'Product Showcase',
    category: '제품 촬영',
    year: '2024',
    image: '/images/53928174748_96dd496038_b.jpg',
    description: '제품의 디테일과 질감을 극대화하는 상업 사진. 자동차 파츠부터 다양한 제품까지, 판매를 이끄는 이미지를 만듭니다.',
    tags: ['Commercial', 'Product', 'Lighting', 'Detail'],
    gallery: [
      { type: 'image', url: '/images/53928308389_705ac179e1_b.jpg' },
      { type: 'image', url: '/images/53935058229_c97521cb14_b.jpg' },
      { type: 'image', url: '/images/53935571015_07ec914a87_b.jpg' },
      { type: 'image', url: '/images/53937223321_2718ab9056_b.jpg' }
    ]
  },
  {
    id: '3',
    title: 'Cinematic Films',
    category: '영상 편집',
    year: '2024',
    image: '/images/53942097638_989f096918_b.jpg',
    description: '자동차의 역동적인 움직임부터 웨딩의 감동적인 순간까지. 다양한 장르를 아우르는 시네마틱 영상 편집.',
    tags: ['Cinematic', 'Wedding', 'Automotive', 'Color Grading'],
    gallery: [
      { type: 'image', url: '/images/53964377422_4c0216b542_b.jpg' },
      { type: 'image', url: '/images/53967565291_bce5a19f46_b.jpg' },
      { type: 'image', url: '/images/53967766648_2cfd72e9cc_b.jpg' },
      { type: 'image', url: '/images/53967969555_755b521cec_b.jpg' }
    ]
  },
  {
    id: '4',
    title: 'AI Creations',
    category: 'AI 아트워크',
    year: '2024',
    image: '/images/53968820042_ec311e50ec_b.jpg',
    description: 'AI 기술을 활용한 창의적인 이미지 생성. 상상력의 한계를 넘어서는 새로운 비주얼 아트.',
    tags: ['AI Art', 'Generative', 'Creative', 'Digital Art'],
    gallery: [
      { type: 'image', url: '/images/53618095933_87aaf22e57_b.jpg' },
      { type: 'image', url: '/images/53618095938_b261990a8f_b.jpg' },
      { type: 'image', url: '/images/53618156348_73505003d3_b.jpg' },
      { type: 'image', url: '/images/53618210828_888417f683_b.jpg' }
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
  { id: '1', type: 'image', url: '/images/53618395435_32f2431b97_b.jpg', caption: 'Behind the Scenes' },
  { id: '2', type: 'image', url: '/images/53662149094_451ac4f80f_b.jpg', caption: 'Test Shot' },
  { id: '3', type: 'image', url: '/images/53786435527_17433df4d8_b.jpg', caption: 'Color Study' },
];

export const DESIGN_ITEMS: DesignItem[] = [
  {
    id: '1',
    title: 'Event Poster',
    category: 'Poster Design',
    year: '2024',
    image: '/images/53618095933_87aaf22e57_b.jpg',
    description: '이벤트를 위한 시선을 사로잡는 포스터 디자인',
    tools: ['Photoshop', 'Illustrator']
  },
  {
    id: '2',
    title: 'Album Artwork',
    category: 'Album Cover',
    year: '2024',
    image: '/images/53618156348_73505003d3_b.jpg',
    description: '음악의 분위기를 시각적으로 표현한 앨범 커버',
    tools: ['Photoshop', 'Cinema 4D']
  },
  {
    id: '3',
    title: 'Brand Identity',
    category: 'Branding',
    year: '2024',
    image: '/images/53618210828_888417f683_b.jpg',
    description: '브랜드의 핵심 가치를 담은 아이덴티티 디자인',
    tools: ['Illustrator', 'Figma']
  }
];

export const ABOUT_TEXT = `
  부산에서 태어나 바다의 깊이와 도시의 역동성을 품고 자란 AI 아티스트입니다.
  전통적인 사진과 영상의 경계를 넘어, 인공지능 기술과 창작 예술을 융합하여
  새로운 시각적 경험을 만들어갑니다. 기술과 감성의 조화로움 속에서
  상상을 현실로, 순간을 영원으로 담아내는 크리에이터입니다.
`;

export const SOCIAL_LINKS = [
  { name: 'Instagram', url: '#' },
  { name: 'YouTube', url: '#' },
  { name: 'Flickr', url: '#' },
  { name: 'Contact', url: '#' },
];
